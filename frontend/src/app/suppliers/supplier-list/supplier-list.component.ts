import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SupplierService } from '../../core/services/supplier.service';
import { Supplier } from '../../core/models/models';
import { ColumnConfig, TableAction, TableConfig } from '../../shared/components/data-table/models/table-config.model';
import { FilterType } from '../../shared/components/data-table/models/filter-config.model';

@Component({
    selector: 'app-supplier-list',
    templateUrl: './supplier-list.component.html',
    styleUrls: ['./supplier-list.component.css']
})
export class SupplierListComponent implements OnInit {
    suppliers: Supplier[] = [];
    columns: ColumnConfig[] = [];
    tableConfig: TableConfig = {};
    actions: TableAction<Supplier>[] = [];

    constructor(
        private supplierService: SupplierService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.setupColumns();
        this.setupActions();
        this.setupTableConfig();
        this.loadSuppliers();
    }

    private setupColumns(): void {
        this.columns = [
            {
                key: 'name',
                header: 'Supplier Name',
                sortable: true,
                filter: {
                    type: FilterType.TEXT,
                    placeholder: 'Filter by name...'
                }
            },
            {
                key: 'contactName',
                header: 'Contact Person',
                sortable: true,
                filter: {
                    type: FilterType.TEXT,
                    placeholder: 'Filter by contact...'
                }
            },
            {
                key: 'phone',
                header: 'Phone',
                sortable: true,
                filter: {
                    type: FilterType.TEXT,
                    placeholder: 'Filter by phone...'
                }
            },
            {
                key: 'email',
                header: 'Email',
                sortable: true,
                filter: {
                    type: FilterType.TEXT,
                    placeholder: 'Filter by email...'
                }
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

    private setupActions(): void {
        this.actions = [
            {
                label: 'Edit',
                icon: 'edit',
                color: 'primary',
                action: (supplier: Supplier) => this.editSupplier(supplier)
            },
            {
                label: 'Delete',
                icon: 'delete',
                color: 'warn',
                action: (supplier: Supplier) => this.deleteSupplier(supplier)
            }
        ];
    }

    private loadSuppliers(): void {
        this.supplierService.getAll().subscribe({
            next: (data) => {
                this.suppliers = data;
            },
            error: (error) => {
                console.error('Error loading suppliers:', error);
            }
        });
    }

    onCreate(): void {
        this.router.navigate(['/suppliers/new']);
    }

    editSupplier(supplier: Supplier): void {
        this.router.navigate(['/suppliers/edit', supplier.id]);
    }

    deleteSupplier(supplier: Supplier): void {
        if (confirm(`Are you sure you want to delete supplier ${supplier.name}?`)) {
            this.supplierService.delete(supplier.id!).subscribe({
                next: () => {
                    this.loadSuppliers();
                },
                error: (error) => {
                    console.error('Error deleting supplier:', error);
                }
            });
        }
    }
}
