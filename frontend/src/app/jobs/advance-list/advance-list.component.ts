import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdvanceService } from '../../core/services/advance.service';
import { Advance } from '../../core/models/models';

@Component({
    selector: 'app-advance-list',
    templateUrl: './advance-list.component.html',
    styleUrls: ['./advance-list.component.css']
})
export class AdvanceListComponent implements OnInit {
    advances: Advance[] = [];
    displayedColumns: string[] = ['id', 'jobId', 'description', 'amount', 'advanceDate', 'createdAt'];
    loading = false;

    constructor(
        private advanceService: AdvanceService,
        private router: Router,
        private snackBar: MatSnackBar
    ) { }

    ngOnInit(): void {
        this.loadAdvances();
    }

    loadAdvances(): void {
        this.loading = true;
        this.advanceService.getAll().subscribe({
            next: (data) => {
                this.advances = data;
                this.loading = false;
            },
            error: (error) => {
                console.error('Error loading advances:', error);
                this.snackBar.open('Error loading advances', 'Close', { duration: 3000 });
                this.loading = false;
            }
        });
    }

    viewJob(jobId: number): void {
        this.router.navigate(['/jobs/edit', jobId]);
    }
}
