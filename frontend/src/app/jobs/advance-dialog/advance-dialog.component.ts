import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Job } from '../../core/models/models';

@Component({
    selector: 'app-advance-dialog',
    templateUrl: './advance-dialog.component.html',
    styleUrls: ['./advance-dialog.component.css']
})
export class AdvanceDialogComponent {
    advanceForm: FormGroup;
    job: Job;
    maxAdvance: number;

    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<AdvanceDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { job: Job }
    ) {
        this.job = data.job;
        this.maxAdvance = this.job.totalAmount - (this.job.advanceAmount || 0);

        this.advanceForm = this.fb.group({
            amount: ['', [Validators.required, Validators.min(0.01), Validators.max(this.maxAdvance)]],
            description: [''],
            advanceDate: [new Date(), Validators.required]
        });
    }

    get balance(): number {
        return this.job.totalAmount - (this.job.advanceAmount || 0);
    }

    onCancel(): void {
        this.dialogRef.close();
    }

    onSubmit(): void {
        if (this.advanceForm.valid) {
            this.dialogRef.close(this.advanceForm.value);
        }
    }
}
