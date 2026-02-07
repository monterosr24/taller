import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VacationService } from '../../core/services/vacation.service';
import { WorkerService } from '../../core/services/worker.service';
import { Worker, VacationBalance } from '../../core/models/models';

@Component({
    selector: 'app-vacation-form',
    templateUrl: './vacation-form.component.html',
    styleUrls: ['./vacation-form.component.css']
})
export class VacationFormComponent implements OnInit {
    vacationForm: FormGroup;
    workers: Worker[] = [];
    selectedWorkerBalance: VacationBalance | null = null;
    loadingBalance = false;

    constructor(
        private fb: FormBuilder,
        private vacationService: VacationService,
        private workerService: WorkerService,
        private router: Router,
        private snackBar: MatSnackBar
    ) {
        this.vacationForm = this.fb.group({
            workerId: ['', Validators.required],
            totalDays: ['', [Validators.required, Validators.min(1)]],
            notes: ['']
        });
    }

    ngOnInit(): void {
        this.loadWorkers();

        // Watch for worker changes to load balance
        this.vacationForm.get('workerId')?.valueChanges.subscribe((workerId) => {
            if (workerId) {
                this.loadWorkerBalance(workerId);
            }
        });
    }

    loadWorkers(): void {
        this.workerService.getAll().subscribe({
            next: (workers) => this.workers = workers,
            error: (error) => console.error('Error loading workers:', error)
        });
    }

    loadWorkerBalance(workerId: number): void {
        this.loadingBalance = true;
        this.selectedWorkerBalance = null;

        this.workerService.getVacationBalance(workerId).subscribe({
            next: (balance) => {
                this.selectedWorkerBalance = balance;
                this.loadingBalance = false;
            },
            error: (error) => {
                console.error('Error loading vacation balance:', error);
                this.loadingBalance = false;
                this.snackBar.open('Error al cargar el balance de vacaciones', 'Cerrar', { duration: 3000 });
            }
        });
    }

    get totalDays(): number {
        return this.vacationForm.get('totalDays')?.value || 0;
    }

    get hasInsufficientBalance(): boolean {
        if (!this.selectedWorkerBalance) return false;
        return this.totalDays > this.selectedWorkerBalance.availableDays;
    }

    onSubmit(): void {
        if (this.vacationForm.invalid) {
            return;
        }

        if (this.hasInsufficientBalance) {
            this.snackBar.open('Saldo de vacaciones insuficiente', 'Cerrar', {
                duration: 5000,
                panelClass: ['error-snackbar']
            });
            return;
        }

        // Calculate dates (starting today)
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + this.totalDays - 1);

        const formData = {
            workerId: this.vacationForm.get('workerId')?.value,
            startDate: startDate,
            endDate: endDate,
            totalDays: this.totalDays,
            notes: this.vacationForm.get('notes')?.value
        };

        this.vacationService.create(formData).subscribe({
            next: () => {
                this.snackBar.open('Vacación aprobada automáticamente', 'Cerrar', { duration: 3000 });
                this.router.navigate(['/vacations']);
            },
            error: (error) => {
                const errorMsg = error.error?.details || error.error?.error || 'Error al procesar la solicitud';
                this.snackBar.open(errorMsg, 'Cerrar', {
                    duration: 5000,
                    panelClass: ['error-snackbar']
                });
            }
        });
    }

    onCancel(): void {
        this.router.navigate(['/vacations']);
    }
}
