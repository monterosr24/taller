import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { JobService } from '../../core/services/job.service';
import { Job, Advance } from '../../core/models/models';

@Component({
    selector: 'app-advance-list-dialog',
    templateUrl: './advance-list-dialog.component.html',
    styleUrls: ['./advance-list-dialog.component.css']
})
export class AdvanceListDialogComponent implements OnInit {
    job: Job;
    advances: Advance[] = [];
    displayedColumns: string[] = ['id', 'amount', 'description', 'advanceDate', 'createdAt'];
    loading = false;
    totalAdvances = 0;

    constructor(
        public dialogRef: MatDialogRef<AdvanceListDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { job: Job },
        private jobService: JobService
    ) {
        this.job = data.job;
    }

    ngOnInit(): void {
        this.loadAdvances();
    }

    loadAdvances(): void {
        this.loading = true;
        this.jobService.getAdvances(this.job.id!).subscribe({
            next: (advances) => {
                this.advances = advances;
                this.totalAdvances = advances.reduce((sum, adv) => sum + adv.amount, 0);
                this.loading = false;
            },
            error: (error) => {
                console.error('Error loading advances:', error);
                this.loading = false;
            }
        });
    }

    onClose(): void {
        this.dialogRef.close();
    }

    get balance(): number {
        return this.job.totalAmount - (this.job.advanceAmount || 0);
    }
}
