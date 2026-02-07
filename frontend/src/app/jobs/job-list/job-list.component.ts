import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { JobService } from '../../core/services/job.service';
import { WorkerService } from '../../core/services/worker.service';
import { VehicleService } from '../../core/services/vehicle.service';
import { Job, Worker, Vehicle } from '../../core/models/models';
import { AdvanceDialogComponent } from '../advance-dialog/advance-dialog.component';
import { AdvanceListDialogComponent } from '../advance-list-dialog/advance-list-dialog.component';

@Component({
    selector: 'app-job-list',
    templateUrl: './job-list.component.html',
    styleUrls: ['./job-list.component.css']
})
export class JobListComponent implements OnInit {
    jobs: Job[] = [];
    workers: Worker[] = [];
    vehicles: Vehicle[] = [];
    displayedColumns: string[] = ['id', 'vehicle', 'worker', 'description', 'totalAmount', 'advanceAmount', 'balance', 'status', 'actions'];
    loading = false;

    constructor(
        private jobService: JobService,
        private workerService: WorkerService,
        private vehicleService: VehicleService,
        private router: Router,
        private dialog: MatDialog,
        private snackBar: MatSnackBar
    ) { }

    ngOnInit(): void {
        this.loadJobs();
        this.loadWorkers();
        this.loadVehicles();
    }

    loadJobs(): void {
        this.loading = true;
        this.jobService.getAll().subscribe({
            next: (data) => {
                this.jobs = data;
                this.loading = false;
            },
            error: (error) => {
                console.error('Error loading jobs:', error);
                this.loading = false;
            }
        });
    }

    loadWorkers(): void {
        this.workerService.getAll().subscribe({
            next: (data) => this.workers = data,
            error: (error) => console.error('Error loading workers:', error)
        });
    }

    loadVehicles(): void {
        this.vehicleService.getAll().subscribe({
            next: (data) => this.vehicles = data,
            error: (error) => console.error('Error loading vehicles:', error)
        });
    }

    getWorkerName(workerId: number): string {
        const worker = this.workers.find(w => w.id === workerId);
        return worker ? `${worker.firstName} ${worker.lastName}` : 'N/A';
    }

    getVehicleInfo(vehicleId: number): string {
        const vehicle = this.vehicles.find(v => v.id === vehicleId);
        return vehicle ? `${vehicle.licensePlate} - ${vehicle.brand} ${vehicle.model}` : 'N/A';
    }

    getBalance(job: Job): number {
        return job.totalAmount - (job.advanceAmount || 0);
    }

    getStatusColor(status: string): string {
        switch (status) {
            case 'completed': return 'success';
            case 'in_progress': return 'primary';
            case 'pending': return 'warn';
            case 'cancelled': return 'accent';
            default: return '';
        }
    }

    getStatusLabel(status: string): string {
        switch (status) {
            case 'completed': return 'Completado';
            case 'in_progress': return 'En Progreso';
            case 'pending': return 'Pendiente';
            case 'cancelled': return 'Cancelado';
            default: return status;
        }
    }

    createJob(): void {
        this.router.navigate(['/jobs/new']);
    }

    editJob(id: number): void {
        this.router.navigate(['/jobs/edit', id]);
    }

    addAdvance(job: Job): void {
        const dialogRef = this.dialog.open(AdvanceDialogComponent, {
            width: '400px',
            data: { job }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.jobService.addAdvance(job.id!, result).subscribe({
                    next: () => {
                        this.snackBar.open('Adelanto registrado exitosamente', 'Cerrar', {
                            duration: 3000
                        });
                        this.loadJobs();
                    },
                    error: (error) => {
                        console.error('Error adding advance:', error);
                        const errorMsg = error.error?.details || error.error?.error || 'Error al registrar adelanto';
                        this.snackBar.open(errorMsg, 'Cerrar', {
                            duration: 5000,
                            panelClass: ['error-snackbar']
                        });
                    }
                });
            }
        });
    }

    viewAdvances(job: Job): void {
        this.dialog.open(AdvanceListDialogComponent, {
            width: '700px',
            data: { job }
        });
    }

    deleteJob(id: number): void {
        if (confirm('¿Estás seguro de eliminar este trabajo?')) {
            this.jobService.delete(id).subscribe({
                next: () => {
                    this.snackBar.open('Trabajo eliminado exitosamente', 'Cerrar', {
                        duration: 3000
                    });
                    this.loadJobs();
                },
                error: (error) => {
                    console.error('Error deleting job:', error);
                    const errorMsg = error.error?.details || error.error?.error || 'Error al eliminar trabajo';
                    this.snackBar.open(errorMsg, 'Cerrar', {
                        duration: 5000,
                        panelClass: ['error-snackbar']
                    });
                }
            });
        }
    }
}
