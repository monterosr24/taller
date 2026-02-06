import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { WorkerService } from '../../core/services/worker.service';
import { Worker } from '../../core/models/models';

@Component({
    selector: 'app-worker-list',
    templateUrl: './worker-list.component.html',
    styleUrls: ['./worker-list.component.css']
})
export class WorkerListComponent implements OnInit {
    workers: Worker[] = [];
    displayedColumns: string[] = ['id', 'first_name', 'last_name', 'document_number', 'phone', 'email', 'base_salary', 'actions'];
    loading = false;

    constructor(
        private workerService: WorkerService,
        private router: Router,
        private snackBar: MatSnackBar
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
                this.snackBar.open('Error loading workers', 'Close', { duration: 3000 });
                this.loading = false;
            }
        });
    }

    editWorker(id: number): void {
        this.router.navigate(['/workers/edit', id]);
    }

    deleteWorker(id: number): void {
        if (confirm('Are you sure you want to deactivate this worker?')) {
            this.workerService.delete(id).subscribe({
                next: () => {
                    this.snackBar.open('Worker deactivated successfully', 'Close', { duration: 3000 });
                    this.loadWorkers();
                },
                error: (error) => {
                    console.error('Error deleting worker:', error);
                    this.snackBar.open('Error deleting worker', 'Close', { duration: 3000 });
                }
            });
        }
    }

    createWorker(): void {
        this.router.navigate(['/workers/new']);
    }
}
