import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { InvoiceService } from '../../core/services/invoice.service';
import { SupplierService } from '../../core/services/supplier.service';
import { Invoice, Supplier } from '../../core/models/models';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-batch-payment-dialog',
    templateUrl: './batch-payment-dialog.component.html',
    styleUrls: ['./batch-payment-dialog.component.css']
})
export class BatchPaymentDialogComponent implements OnInit {
    inputNumbers: string = '';

    // Suppliers
    suppliers: Supplier[] = [];
    selectedSupplierId: number | null = null;

    // Results
    foundInvoices: Invoice[] = [];
    alreadyPaidInvoices: Invoice[] = [];
    notFoundNumbers: string[] = [];
    totalAmount: number = 0;

    step: 'input' | 'verify' = 'input';
    isProcessing = false;

    // Selection
    selectedInvoiceIds: Set<number> = new Set();

    constructor(
        private dialogRef: MatDialogRef<BatchPaymentDialogComponent>,
        private invoiceService: InvoiceService,
        private supplierService: SupplierService,
        private snackBar: MatSnackBar
    ) { }

    ngOnInit(): void {
        this.loadSuppliers();
    }

    loadSuppliers() {
        this.supplierService.getAll().subscribe({
            next: (data) => {
                this.suppliers = data;
            },
            error: (err) => {
                console.error('Error loading suppliers', err);
                this.snackBar.open('Error loading suppliers', 'Close', { duration: 3000 });
            }
        });
    }

    onVerify() {
        if (!this.inputNumbers.trim()) return;

        this.isProcessing = true;
        // Split by comma or newline
        const numbers = this.inputNumbers.split(/[\n,]+/).map(s => s.trim()).filter(s => s.length > 0);

        this.invoiceService.reconcile(numbers, this.selectedSupplierId || undefined).subscribe({
            next: (result) => {
                this.foundInvoices = result.payable;
                this.alreadyPaidInvoices = result.alreadyPaid;
                this.notFoundNumbers = result.notFound;
                this.totalAmount = result.totalAmount;

                // Select all PAYABLE by default
                this.foundInvoices.forEach(inv => this.selectedInvoiceIds.add(inv.id!));

                this.step = 'verify';
                this.isProcessing = false;
            },
            error: (err) => {
                console.error(err);
                this.snackBar.open('Error verifying invoices', 'Close', { duration: 3000 });
                this.isProcessing = false;
            }
        });
    }

    onBack() {
        this.step = 'input';
        this.foundInvoices = [];
        this.alreadyPaidInvoices = [];
        this.notFoundNumbers = [];
        this.selectedInvoiceIds.clear();
    }

    toggleSelection(id: number) {
        if (this.selectedInvoiceIds.has(id)) {
            this.selectedInvoiceIds.delete(id);
        } else {
            this.selectedInvoiceIds.add(id);
        }
        this.recalculateTotal();
    }

    recalculateTotal() {
        this.totalAmount = this.foundInvoices
            .filter(inv => this.selectedInvoiceIds.has(inv.id!))
            .reduce((sum, inv) => sum + Number(inv.totalAmount), 0);
    }

    onPay() {
        if (this.selectedInvoiceIds.size === 0) return;

        this.isProcessing = true;
        const ids = Array.from(this.selectedInvoiceIds);

        this.invoiceService.batchPay(ids).subscribe({
            next: () => {
                this.snackBar.open('Invoices marked as paid successfully', 'Close', { duration: 3000 });
                this.dialogRef.close(true); // Return true to refresh list
            },
            error: (err) => {
                console.error(err);
                this.snackBar.open('Error processing payments', 'Close', { duration: 3000 });
                this.isProcessing = false;
            }
        });
    }

    onCancel() {
        this.dialogRef.close(false);
    }
}
