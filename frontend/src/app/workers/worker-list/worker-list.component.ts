import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { WorkerService } from '../../core/services/worker.service';
import { Worker } from '../../core/models/models';
import { ColumnConfig, TableAction, TableConfig } from '../../shared/components/data-table/models/table-config.model';
import { FilterType } from '../../shared/components/data-table/models/filter-config.model';
import { VacationRequestDialogComponent } from '../vacation-request-dialog/vacation-request-dialog.component';

@Component({
    selector: 'app-worker-list',
    templateUrl: './worker-list.component.html',
    styleUrls: ['./worker-list.component.css']
})
export class WorkerListComponent implements OnInit {
    workers: Worker[] = [];
    loading = false;

    columns: ColumnConfig<Worker>[] = [
        {
            key: 'firstName',
            header: 'First Name',
            sortable: true,
            filter: {
                type: FilterType.TEXT,
                placeholder: 'Search first name...'
            }
        },
        {
            key: 'lastName',
            header: 'Last Name',
            sortable: true,
            filter: {
                type: FilterType.TEXT,
                placeholder: 'Search last name...'
            }
        },
        {
            key: 'email',
            header: 'Email',
            sortable: true,
            hideOnMobile: true,
            filter: {
                type: FilterType.TEXT,
                placeholder: 'Search email...'
            }
        },
        {
            key: 'phone',
            header: 'Phone',
            sortable: true,
            hideOnMobile: true,
            filter: {
                type: FilterType.TEXT,
                placeholder: 'Search phone...'
            }
        },
        {
            key: 'hireDate',
            header: 'Hire Date',
            sortable: true,
            formatter: (value) => value ? new Date(value).toLocaleDateString() : 'N/A'
        },
        {
            key: 'baseSalary',
            header: 'Salary',
            sortable: true,
            align: 'right',
            formatter: (value) => value ? `$${value.toLocaleString()}` : 'N/A',
            hideOnMobile: true
        }
    ];

    actions: TableAction<Worker>[] = [
        {
            label: 'Edit',
            icon: 'edit',
            action: (row) => this.editWorker(row.id!),
            color: 'primary'
        },
        {
            label: 'Request Vacation',
            icon: 'beach_access',
            action: (row) => this.requestVacation(row.id!),
            color: 'accent'
        },
        {
            label: 'Delete',
            icon: 'delete',
            action: (row) => this.deleteWorker(row.id!),
            color: 'warn'
        }
    ];

    tableConfig: TableConfig = {
        enableSearch: false, // Using column filters instead
        enablePagination: true,
        pageSizeOptions: [10, 25, 50, 100],
        defaultPageSize: 10,
        enableRowClick: false,
        stickyHeader: true,
        enableColumnFilters: true,
        emptyMessage: 'No workers registered',
        loadingMessage: 'Loading workers...'
    };

    constructor(
        private workerService: WorkerService,
        private router: Router,
        private dialog: MatDialog
    ) { }

    ngOnInit(): void {
        this.loadWorkers();
    }

    loadWorkers(): void {
        this.loading = true;
        this.workerService.getAll().subscribe({
            next: (data) => {
                this.workers = data;
                this.loading = false;
            },
            error: (error) => {
                console.error('Error loading workers:', error);
                this.loading = false;
            }
        });
    }

    createWorker(): void {
        this.router.navigate(['/workers/new']);
    }

    editWorker(id: number): void {
        this.router.navigate(['/workers/edit', id]);
    }

    requestVacation(workerId: number): void {
        const worker = this.workers.find(w => w.id === workerId);
        if (!worker) return;

        const dialogRef = this.dialog.open(VacationRequestDialogComponent, {
            width: '500px',
            data: { worker }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                // Vacation was created successfully
                console.log('Vacation created:', result);
            }
        });
    }

    deleteWorker(id: number): void {
        if (confirm('Are you sure you want to delete this worker?')) {
            this.workerService.delete(id).subscribe({
                next: () => this.loadWorkers(),
                error: (error) => console.error('Error deleting worker:', error)
            });
        }
    }
}
