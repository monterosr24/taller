import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { JobService } from '../../core/services/job.service';
import { Job } from '../../core/models/models';
import { ColumnConfig, TableAction, TableConfig } from '../../shared/components/data-table/models/table-config.model';
import { FilterType } from '../../shared/components/data-table/models/filter-config.model';
import { AdvanceListDialogComponent } from '../advance-list-dialog/advance-list-dialog.component';
import { AdvanceDialogComponent } from '../advance-dialog/advance-dialog.component';

// Extended interface for display purposes
interface JobDisplay extends Job {
    vehicleName?: string;
    workerName?: string;
}

@Component({
    selector: 'app-job-list',
    templateUrl: './job-list.component.html',
    styleUrls: ['./job-list.component.css']
})
export class JobListComponent implements OnInit {
    jobs: JobDisplay[] = [];
    loading = false;

    columns: ColumnConfig<JobDisplay>[] = [
        {
            key: 'vehicleName',
            header: 'Vehicle',
            sortable: true,
            formatter: (_value, row) => row.vehicleName || 'N/A',
            filter: {
                type: FilterType.TEXT,
                placeholder: 'Search vehicle...'
            }
        },
        {
            key: 'description',
            header: 'Description',
            sortable: true,
            filter: {
                type: FilterType.TEXT,
                placeholder: 'Search description...'
            }
        },
        {
            key: 'workerName',
            header: 'Worker',
            sortable: true,
            formatter: (_value, row) => row.workerName || 'Unassigned',
            hideOnMobile: true,
            filter: {
                type: FilterType.TEXT,
                placeholder: 'Search worker...'
            }
        },
        {
            key: 'startDate',
            header: 'Start Date',
            sortable: true,
            formatter: (value) => value ? new Date(value).toLocaleDateString() : 'N/A',
            hideOnMobile: true
        },
        {
            key: 'status',
            header: 'Status',
            sortable: true,
            align: 'center',
            formatter: (value) => this.getStatusLabel(value),
            filter: {
                type: FilterType.SELECT,
                placeholder: 'Filter by status',
                options: [
                    { label: 'Pending', value: 'Pending' },
                    { label: 'In Progress', value: 'In Progress' },
                    { label: 'Completed', value: 'Completed' },
                    { label: 'Cancelled', value: 'Cancelled' }
                ]
            }
        },
        {
            key: 'totalAmount',
            header: 'Total Amount',
            sortable: true,
            align: 'right',
            formatter: (value) => value ? `$${value.toLocaleString()}` : '$0'
        },
        {
            key: 'advanceAmount',
            header: 'Advances',
            sortable: true,
            align: 'right',
            formatter: (value) => value ? `$${value.toLocaleString()}` : '$0',
            hideOnMobile: true
        },
        {
            key: 'balance',
            header: 'Balance',
            sortable: true,
            align: 'right',
            formatter: (_value, row) => {
                const balance = (row.totalAmount || 0) - (row.advanceAmount || 0);
                return `$${balance.toLocaleString()}`;
            }
        }
    ];

    actions: TableAction<JobDisplay>[] = [
        {
            label: 'Edit',
            icon: 'edit',
            action: (row) => this.editJob(row.id!),
            color: 'primary'
        },
        {
            label: 'Add Advance',
            icon: 'payments',
            action: (row) => this.addAdvance(row),
            color: 'accent'
        },
        {
            label: 'View Advances',
            icon: 'list_alt',
            action: (row) => this.viewAdvances(row.id!),
            color: 'accent'
        },
        {
            label: 'Delete',
            icon: 'delete',
            action: (row) => this.deleteJob(row.id!),
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
        emptyMessage: 'No jobs registered',
        loadingMessage: 'Loading jobs...'
    };

    constructor(
        private jobService: JobService,
        private router: Router,
        private dialog: MatDialog
    ) { }

    ngOnInit(): void {
        this.loadJobs();
    }

    loadJobs(): void {
        this.loading = true;
        this.jobService.getAll().subscribe({
            next: (jobs: any[]) => {
                // Map jobs to include computed properties
                this.jobs = jobs.map((job: any) => ({
                    ...job,
                    vehicleName: job.vehicle?.licensePlate || 'N/A',
                    workerName: job.worker ? `${job.worker.firstName} ${job.worker.lastName}` : 'Unassigned'
                }));
                this.loading = false;
            },
            error: (error: any) => {
                console.error('Error loading jobs:', error);
                this.loading = false;
            }
        });
    }

    createJob(): void {
        this.router.navigate(['/jobs/new']);
    }

    editJob(id: number): void {
        this.router.navigate(['/jobs/edit', id]);
    }

    viewAdvances(jobId: number): void {
        const dialogRef = this.dialog.open(AdvanceListDialogComponent, {
            width: '800px',
            data: { jobId: jobId }
        });

        dialogRef.afterClosed().subscribe(() => {
            this.loadJobs();
        });
    }

    addAdvance(job: JobDisplay): void {
        const dialogRef = this.dialog.open(AdvanceDialogComponent, {
            width: '500px',
            data: { job: job }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                // Create advance with jobId
                const advanceData = {
                    ...result,
                    jobId: job.id
                };

                // Import AdvanceService if needed
                this.jobService.addAdvance(job.id!, result).subscribe({
                    next: () => {
                        this.loadJobs();
                    },
                    error: (error) => {
                        console.error('Error creating advance:', error);
                    }
                });
            }
        });
    }

    deleteJob(id: number): void {
        if (confirm('Are you sure you want to delete this job?')) {
            this.jobService.delete(id).subscribe({
                next: () => this.loadJobs(),
                error: (error) => console.error('Error deleting job:', error)
            });
        }
    }

    getStatusLabel(status: string): string {
        const labels: { [key: string]: string } = {
            'pending': 'Pending',
            'in_progress': 'In Progress',
            'completed': 'Completed',
            'cancelled': 'Cancelled'
        };
        return labels[status] || status;
    }
}
