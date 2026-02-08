import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SalaryAdvanceService } from '../../core/services/salary-advance.service';
import { Worker, SalaryAdvance, AvailableAdvanceInfo } from '../../core/models/models';

@Component({
    selector: 'app-salary-advance-dialog',
    templateUrl: './salary-advance-dialog.component.html',
    styleUrls: ['./salary-advance-dialog.component.css']
})
export class SalaryAdvanceDialogComponent implements OnInit {
    advanceForm: FormGroup;
    worker: Worker;
    advances: SalaryAdvance[] = [];
    availableInfo: AvailableAdvanceInfo | null = null;
    loading = true;
    submitting = false;

    constructor(
        public dialogRef: MatDialogRef<SalaryAdvanceDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { worker: Worker },
        private fb: FormBuilder,
        private salaryAdvanceService: SalaryAdvanceService,
        private snackBar: MatSnackBar
    ) {
        this.worker = data.worker;
        this.advanceForm = this.fb.group({
            amount: ['', [Validators.required, Validators.min(0.01)]],
            notes: ['']
        });
    }

    ngOnInit(): void {
        this.loadAvailableInfo();
        this.loadAdvances();
    }

    loadAvailableInfo(): void {
        this.loading = true;
        this.salaryAdvanceService.getAvailableAdvance(this.worker.id!).subscribe({
            next: (info) => {
                this.availableInfo = info;
                this.loading = false;

                // Set max validator for amount
                this.advanceForm.get('amount')?.setValidators([
                    Validators.required,
                    Validators.min(0.01),
                    Validators.max(info.availableAmount)
                ]);
                this.advanceForm.get('amount')?.updateValueAndValidity();
            },
            error: (error) => {
                console.error('Error loading available advance:', error);
                this.snackBar.open(
                    'This worker is not eligible for salary advances',
                    'Close',
                    { duration: 5000 }
                );
                this.loading = false;
                this.dialogRef.close();
            }
        });
    }

    loadAdvances(): void {
        this.salaryAdvanceService.getByWorkerId(this.worker.id!).subscribe({
            next: (advances) => {
                this.advances = advances;
            },
            error: (error) => {
                console.error('Error loading advances:', error);
            }
        });
    }

    onSubmit(): void {
        if (this.advanceForm.valid && this.availableInfo && !this.submitting) {
            this.submitting = true;

            const advance: SalaryAdvance = {
                workerId: this.worker.id!,
                amount: this.advanceForm.value.amount,
                advanceDate: new Date(),
                paymentPeriodStart: this.availableInfo.currentPeriodStart,
                paymentPeriodEnd: this.availableInfo.currentPeriodEnd,
                notes: this.advanceForm.value.notes
            };

            this.salaryAdvanceService.create(advance).subscribe({
                next: () => {
                    this.snackBar.open('Salary advance created successfully', 'Close', { duration: 3000 });
                    this.advanceForm.reset();
                    this.loadAvailableInfo();
                    this.loadAdvances();
                    this.submitting = false;
                },
                error: (error) => {
                    console.error('Error creating advance:', error);
                    this.snackBar.open(
                        error.error?.error || 'Error creating salary advance',
                        'Close',
                        { duration: 3000 }
                    );
                    this.submitting = false;
                }
            });
        }
    }

    deleteAdvance(advance: SalaryAdvance): void {
        if (confirm(`Delete advance of $${advance.amount}?`)) {
            this.salaryAdvanceService.delete(advance.id!).subscribe({
                next: () => {
                    this.snackBar.open('Advance deleted successfully', 'Close', { duration: 3000 });
                    this.loadAvailableInfo();
                    this.loadAdvances();
                },
                error: (error) => {
                    console.error('Error deleting advance:', error);
                    this.snackBar.open('Error deleting advance', 'Close', { duration: 3000 });
                }
            });
        }
    }

    getPaymentFrequencyLabel(frequency: string): string {
        const labels: any = {
            'weekly': 'Semanal',
            'biweekly': 'Quincenal',
            'monthly': 'Mensual'
        };
        return labels[frequency] || frequency;
    }

    onClose(): void {
        this.dialogRef.close();
    }
}
