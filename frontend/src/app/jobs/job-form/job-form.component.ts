import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { JobService } from '../../core/services/job.service';
import { WorkerService } from '../../core/services/worker.service';
import { VehicleService } from '../../core/services/vehicle.service';
import { Job, Worker, Vehicle } from '../../core/models/models';

@Component({
    selector: 'app-job-form',
    templateUrl: './job-form.component.html',
    styleUrls: ['./job-form.component.css']
})
export class JobFormComponent implements OnInit {
    jobForm: FormGroup;
    isEditMode = false;
    jobId?: number;
    workers: Worker[] = [];
    vehicles: Vehicle[] = [];
    loading = false;

    statusOptions = [
        { value: 'pending', label: 'Pendiente' },
        { value: 'in_progress', label: 'En Progreso' },
        { value: 'completed', label: 'Completado' },
        { value: 'cancelled', label: 'Cancelado' }
    ];

    constructor(
        private fb: FormBuilder,
        private jobService: JobService,
        private workerService: WorkerService,
        private vehicleService: VehicleService,
        private router: Router,
        private route: ActivatedRoute,
        private snackBar: MatSnackBar
    ) {
        this.jobForm = this.fb.group({
            vehicleId: ['', Validators.required],
            workerId: ['', Validators.required],
            description: ['', [Validators.required, Validators.maxLength(500)]],
            totalAmount: ['', [Validators.required, Validators.min(0)]],
            status: ['pending', Validators.required],
            startDate: [''],
            endDate: ['']
        });
    }

    ngOnInit(): void {
        this.loadWorkers();
        this.loadVehicles();

        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.isEditMode = true;
            this.jobId = +id;
            this.loadJob(this.jobId);
        }
    }

    loadWorkers(): void {
        this.workerService.getAll().subscribe({
            next: (data) => {
                this.workers = data.filter(w => w.is_active);
            },
            error: (error) => console.error('Error loading workers:', error)
        });
    }

    loadVehicles(): void {
        this.vehicleService.getAll().subscribe({
            next: (data) => this.vehicles = data,
            error: (error) => console.error('Error loading vehicles:', error)
        });
    }

    loadJob(id: number): void {
        this.loading = true;
        this.jobService.getById(id).subscribe({
            next: (job) => {
                this.jobForm.patchValue({
                    vehicleId: job.vehicle_id,
                    workerId: job.worker_id,
                    description: job.description,
                    totalAmount: job.total_amount,
                    status: job.status,
                    startDate: job.start_date,
                    endDate: job.end_date
                });
                this.loading = false;
            },
            error: (error) => {
                console.error('Error loading job:', error);
                this.loading = false;
            }
        });
    }

    getWorkerDisplayName(worker: Worker): string {
        return `${worker.first_name} ${worker.last_name}`;
    }

    getVehicleDisplayName(vehicle: Vehicle): string {
        return `${vehicle.license_plate} - ${vehicle.brand} ${vehicle.model}`;
    }

    onSubmit(): void {
        if (this.jobForm.valid) {
            this.loading = true;
            const job: Job = this.jobForm.value;

            if (this.isEditMode && this.jobId) {
                this.jobService.update(this.jobId, job).subscribe({
                    next: () => {
                        this.snackBar.open('Trabajo actualizado exitosamente', 'Cerrar', {
                            duration: 3000
                        });
                        this.router.navigate(['/jobs']);
                    },
                    error: (error) => {
                        console.error('Error updating job:', error);
                        this.loading = false;
                        const errorMsg = error.error?.details || error.error?.error || 'Error al actualizar el trabajo';
                        this.snackBar.open(errorMsg, 'Cerrar', {
                            duration: 5000,
                            panelClass: ['error-snackbar']
                        });
                    }
                });
            } else {
                this.jobService.create(job).subscribe({
                    next: () => {
                        this.snackBar.open('Trabajo creado exitosamente', 'Cerrar', {
                            duration: 3000
                        });
                        this.router.navigate(['/jobs']);
                    },
                    error: (error) => {
                        console.error('Error creating job:', error);
                        this.loading = false;
                        const errorMsg = error.error?.details || error.error?.error || 'Error al crear el trabajo';
                        this.snackBar.open(errorMsg, 'Cerrar', {
                            duration: 5000,
                            panelClass: ['error-snackbar']
                        });
                    }
                });
            }
        } else {
            this.snackBar.open('Por favor completa todos los campos requeridos', 'Cerrar', {
                duration: 3000,
                panelClass: ['error-snackbar']
            });
        }
    }

    cancel(): void {
        this.router.navigate(['/jobs']);
    }
}
