import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { VacationService } from '../../core/services/vacation.service';
import { WorkerService } from '../../core/services/worker.service';
import { Worker, Vacation } from '../../core/models/models';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface VacationRequestDialogData {
    worker: Worker;
}

@Component({
    selector: 'app-vacation-request-dialog',
    templateUrl: './vacation-request-dialog.component.html',
    styleUrls: ['./vacation-request-dialog.component.css']
})
export class VacationRequestDialogComponent implements OnInit {
    vacationForm: FormGroup;
    submitting = false;
    availableDays = 0; // Will be loaded from API
    loading = true;

    constructor(
        private fb: FormBuilder,
        private vacationService: VacationService,
        private workerService: WorkerService,
        private snackBar: MatSnackBar,
        public dialogRef: MatDialogRef<VacationRequestDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: VacationRequestDialogData
    ) {
        this.vacationForm = this.fb.group({
            days: ['', [Validators.required, Validators.min(1)]],
            type: ['annual', Validators.required],
            notes: ['']
        });
    }

    ngOnInit(): void {
        // Fetch real vacation balance
        this.workerService.getVacationBalance(this.data.worker.id!).subscribe({
            next: (balance: any) => {
                this.availableDays = balance.availableDays || 0;
                this.loading = false;

                // Update validators with actual available days
                this.vacationForm.get('days')?.setValidators([
                    Validators.required,
                    Validators.min(1),
                    Validators.max(this.availableDays)
                ]);
                this.vacationForm.get('days')?.updateValueAndValidity();
            },
            error: (error) => {
                console.error('Error fetching vacation balance:', error);
                this.availableDays = 0;
                this.loading = false;
                this.snackBar.open('Error loading vacation balance', 'Close', {
                    duration: 3000
                });
            }
        });
    }

    onSubmit(): void {
        if (this.vacationForm.valid && !this.submitting) {
            this.submitting = true;

            const days = this.vacationForm.value.days;

            const vacation: Partial<Vacation> = {
                workerId: this.data.worker.id,
                totalDays: days,
                status: 'approved',  // Auto-approved
                type: this.vacationForm.value.type,
                notes: this.vacationForm.value.notes || ''
            };

            this.vacationService.create(vacation as Vacation).subscribe({
                next: (result) => {
                    this.snackBar.open('Vacation approved successfully!', 'Close', {
                        duration: 3000
                    });
                    this.dialogRef.close(result);
                },
                error: (error) => {
                    console.error('Error creating vacation:', error);
                    this.snackBar.open('Error submitting vacation request', 'Close', {
                        duration: 3000
                    });
                    this.submitting = false;
                }
            });
        }
    }

    onCancel(): void {
        this.dialogRef.close();
    }

    get remainingDays(): number {
        const requestedDays = this.vacationForm.get('days')?.value || 0;
        return Math.max(0, this.availableDays - requestedDays);
    }
}
