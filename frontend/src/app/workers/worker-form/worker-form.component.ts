import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { WorkerService } from '../../core/services/worker.service';
import { Worker } from '../../core/models/models';

@Component({
    selector: 'app-worker-form',
    templateUrl: './worker-form.component.html',
    styleUrls: ['./worker-form.component.css']
})
export class WorkerFormComponent implements OnInit {
    workerForm: FormGroup;
    isEditMode = false;
    workerId?: number;
    submitting = false;

    constructor(
        private fb: FormBuilder,
        private workerService: WorkerService,
        private router: Router,
        private route: ActivatedRoute,
        private snackBar: MatSnackBar
    ) {
        this.workerForm = this.fb.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            documentNumber: [''],
            phone: [''],
            email: ['', Validators.email],
            hireDate: [''],
            baseSalary: ['', [Validators.min(0)]],
            paymentFrequency: ['monthly'],
            workerType: ['direct']
        });
    }

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.isEditMode = true;
            this.workerId = +id;
            this.loadWorker(this.workerId);
        }
    }

    loadWorker(id: number): void {
        this.submitting = true;
        this.workerService.getById(id).subscribe({
            next: (worker) => {
                this.workerForm.patchValue({
                    firstName: worker.firstName,
                    lastName: worker.lastName,
                    documentNumber: worker.documentNumber,
                    phone: worker.phone,
                    email: worker.email,
                    hireDate: worker.hireDate ? new Date(worker.hireDate) : null,
                    baseSalary: worker.baseSalary,
                    paymentFrequency: worker.paymentFrequency || 'monthly',
                    workerType: worker.workerType || 'direct'
                });
                this.submitting = false;
            },
            error: (error) => {
                console.error('Error loading worker:', error);
                this.snackBar.open('Error loading worker', 'Close', { duration: 3000 });
                this.submitting = false;
            }
        });
    }

    onSubmit(): void {
        if (this.workerForm.valid) {
            this.submitting = true;
            const workerData: Worker = this.workerForm.value;

            const request = this.isEditMode
                ? this.workerService.update(this.workerId!, workerData)
                : this.workerService.create(workerData);

            request.subscribe({
                next: () => {
                    const message = this.isEditMode ? 'Worker updated successfully' : 'Worker created successfully';
                    this.snackBar.open(message, 'Close', { duration: 3000 });
                    this.router.navigate(['/workers']);
                },
                error: (error) => {
                    console.error('Error saving worker:', error);
                    this.snackBar.open('Error saving worker', 'Close', { duration: 3000 });
                    this.submitting = false;
                }
            });
        }
    }

    onCancel(): void {
        this.router.navigate(['/workers']);
    }
}
