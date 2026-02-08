import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InvoiceService } from '../../core/services/invoice.service';
import { SupplierService } from '../../core/services/supplier.service';
import { Invoice, Supplier } from '../../core/models/models';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-invoice-form',
    templateUrl: './invoice-form.component.html',
    styleUrls: ['./invoice-form.component.css']
})
export class InvoiceFormComponent implements OnInit {
    invoiceForm: FormGroup;
    isEditMode = false;
    invoiceId?: number;
    submitting = false;
    suppliers: Supplier[] = [];

    constructor(
        private fb: FormBuilder,
        private invoiceService: InvoiceService,
        private supplierService: SupplierService,
        private router: Router,
        private route: ActivatedRoute,
        private snackBar: MatSnackBar
    ) {
        this.invoiceForm = this.fb.group({
            invoiceNumber: ['', Validators.required],
            supplierId: ['', Validators.required],
            description: [''],
            totalAmount: ['', [Validators.required, Validators.min(0)]],
            invoiceDate: ['', Validators.required],
            dueDate: ['']
        });
    }

    ngOnInit(): void {
        this.loadSuppliers();

        this.route.params.subscribe(params => {
            if (params['id']) {
                this.isEditMode = true;
                this.invoiceId = +params['id'];
                this.loadInvoice(this.invoiceId);
            }
        });
    }

    private loadSuppliers(): void {
        this.supplierService.getAll().subscribe({
            next: (suppliers) => {
                this.suppliers = suppliers.filter(s => s.isActive);
            },
            error: (error) => {
                console.error('Error loading suppliers:', error);
                this.snackBar.open('Error loading suppliers', 'Close', { duration: 3000 });
            }
        });
    }

    private loadInvoice(id: number): void {
        this.invoiceService.getById(id).subscribe({
            next: (invoice: any) => {
                this.invoiceForm.patchValue({
                    invoiceNumber: invoice.invoiceNumber,
                    supplierId: invoice.supplierId,
                    description: invoice.description,
                    totalAmount: invoice.totalAmount,
                    invoiceDate: new Date(invoice.invoiceDate),
                    dueDate: invoice.dueDate ? new Date(invoice.dueDate) : null
                });
            },
            error: (error) => {
                console.error('Error loading invoice:', error);
                this.snackBar.open('Error loading invoice', 'Close', { duration: 3000 });
            }
        });
    }

    onSubmit(): void {
        if (this.invoiceForm.valid && !this.submitting) {
            this.submitting = true;

            const invoiceData: Invoice = {
                ...this.invoiceForm.value,
                invoiceDate: this.invoiceForm.value.invoiceDate instanceof Date
                    ? this.invoiceForm.value.invoiceDate
                    : new Date(this.invoiceForm.value.invoiceDate),
                dueDate: this.invoiceForm.value.dueDate
                    ? (this.invoiceForm.value.dueDate instanceof Date
                        ? this.invoiceForm.value.dueDate
                        : new Date(this.invoiceForm.value.dueDate))
                    : undefined
            };

            const operation = this.isEditMode
                ? this.invoiceService.update(this.invoiceId!, invoiceData)
                : this.invoiceService.create(invoiceData);

            operation.subscribe({
                next: () => {
                    this.snackBar.open(
                        `Invoice ${this.isEditMode ? 'updated' : 'created'} successfully`,
                        'Close',
                        { duration: 3000 }
                    );
                    this.router.navigate(['/invoices']);
                },
                error: (error) => {
                    console.error('Error saving invoice:', error);
                    this.snackBar.open(
                        error.error?.message || 'Error saving invoice',
                        'Close',
                        { duration: 3000 }
                    );
                    this.submitting = false;
                }
            });
        }
    }

    onCancel(): void {
        this.router.navigate(['/invoices']);
    }
}
