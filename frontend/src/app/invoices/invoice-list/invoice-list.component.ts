import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { InvoiceService } from '../../core/services/invoice.service';
import { Invoice } from '../../core/models/models';
import { ColumnConfig, TableAction, TableConfig } from '../../shared/components/data-table/models/table-config.model';
import { FilterType } from '../../shared/components/data-table/models/filter-config.model';
import { BatchPaymentDialogComponent } from '../batch-payment-dialog/batch-payment-dialog.component';

@Component({
    selector: 'app-invoice-list',
    templateUrl: './invoice-list.component.html',
    styleUrls: ['./invoice-list.component.css']
})
export class InvoiceListComponent implements OnInit {
    invoices: Invoice[] = [];
    columns: ColumnConfig[] = [];
    tableConfig: TableConfig = {};
    actions: TableAction<Invoice>[] = [];
    showAll: boolean = false;

    constructor(
        private invoiceService: InvoiceService,
        private router: Router,
        private dialog: MatDialog
    ) { }

    // ...

    openBatchPayment(): void {
        const dialogRef = this.dialog.open(BatchPaymentDialogComponent, {
            width: '600px',
            disableClose: true
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.loadInvoices();
            }
        });
    }

    ngOnInit(): void {
        this.setupColumns();
        this.setupActions();
        this.setupTableConfig();
        this.loadInvoices();
    }

    private setupColumns(): void {
        this.columns = [
            {
                key: 'invoiceNumber',
                header: 'Invoice #',
                sortable: true,
                filter: {
                    type: FilterType.TEXT,
                    placeholder: 'Filter by number...'
                }
            },
            {
                key: 'supplierName',
                header: 'Supplier',
                sortable: true,
                filter: {
                    type: FilterType.TEXT,
                    placeholder: 'Filter by supplier...'
                }
            },
            {
                key: 'totalAmount',
                header: 'Amount',
                sortable: true,
                align: 'right',
                formatter: (value) => `$${value.toLocaleString()}`
            },
            {
                key: 'paymentStatus',
                header: 'Status',
                sortable: true,
                filter: {
                    type: FilterType.SELECT,
                    options: [
                        { label: 'Pending', value: 'pending' },
                        { label: 'Paid', value: 'paid' },
                        { label: 'Cancelled', value: 'cancelled' }
                    ]
                },
                formatter: (value) => {
                    const statusMap: any = {
                        'pending': 'Pendiente',
                        'paid': 'Pagada',
                        'cancelled': 'Cancelada'
                    };
                    return statusMap[value] || value;
                }
            },
            {
                key: 'invoiceDate',
                header: 'Date',
                sortable: true,
                formatter: (value) => new Date(value).toLocaleDateString()
            }
        ];
    }

    private setupActions(): void {
        this.actions = [
            {
                label: 'Edit',
                icon: 'edit',
                color: 'primary',
                action: (invoice: Invoice) => this.editInvoice(invoice)
            },
            {
                label: 'Delete',
                icon: 'delete',
                color: 'warn',
                action: (invoice: Invoice) => this.deleteInvoice(invoice)
            }
        ];
    }

    private setupTableConfig(): void {
        this.tableConfig = {
            enableSearch: false,
            enableColumnFilters: true,
            enablePagination: true,
            pageSizeOptions: [10, 25, 50],
            defaultPageSize: 10,
            enableSelection: false
        };
    }

    private loadInvoices(): void {
        this.invoiceService.getAll().subscribe({
            next: (data) => {
                // Map supplier.name and store
                this.invoices = data.map((invoice: any) => ({
                    ...invoice,
                    supplierName: invoice.supplier?.name || 'N/A'
                }));
            },
            error: (error) => {
                console.error('Error loading invoices:', error);
            }
        });
    }

    onCreate(): void {
        this.router.navigate(['/invoices/new']);
    }

    editInvoice(invoice: Invoice): void {
        this.router.navigate(['/invoices/edit', invoice.id]);
    }

    deleteInvoice(invoice: Invoice): void {
        if (confirm(`Are you sure you want to delete invoice ${invoice.invoiceNumber}?`)) {
            this.invoiceService.delete(invoice.id!).subscribe({
                next: () => {
                    this.loadInvoices();
                },
                error: (error) => {
                    console.error('Error deleting invoice:', error);
                }
            });
        }
    }
}
