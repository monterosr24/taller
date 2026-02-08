import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SupplierService } from '../../core/services/supplier.service';
import { Supplier } from '../../core/models/models';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-supplier-form',
    templateUrl: './supplier-form.component.html',
    styleUrls: ['./supplier-form.component.css']
})
export class SupplierFormComponent implements OnInit {
    supplierForm: FormGroup;
    isEditMode = false;
    supplierId?: number;
    submitting = false;

    constructor(
        private fb: FormBuilder,
        private supplierService: SupplierService,
        private router: Router,
        private route: ActivatedRoute,
        private snackBar: MatSnackBar
    ) {
        this.supplierForm = this.fb.group({
            name: ['', Validators.required],
            contactName: [''],
            phone: [''],
            email: ['', Validators.email],
            address: [''],
            notes: ['']
        });
    }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            if (params['id']) {
                this.isEditMode = true;
                this.supplierId = +params['id'];
                this.loadSupplier(this.supplierId);
            }
        });
    }

    private loadSupplier(id: number): void {
        this.supplierService.getById(id).subscribe({
            next: (supplier) => {
                this.supplierForm.patchValue({
                    name: supplier.name,
                    contactName: supplier.contactName,
                    phone: supplier.phone,
                    email: supplier.email,
                    address: supplier.address,
                    notes: supplier.notes
                });
            },
            error: (error) => {
                console.error('Error loading supplier:', error);
                this.snackBar.open('Error loading supplier', 'Close', { duration: 3000 });
            }
        });
    }

    onSubmit(): void {
        if (this.supplierForm.valid && !this.submitting) {
            this.submitting = true;

            const supplierData: Supplier = this.supplierForm.value;

            const operation = this.isEditMode
                ? this.supplierService.update(this.supplierId!, supplierData)
                : this.supplierService.create(supplierData);

            operation.subscribe({
                next: () => {
                    this.snackBar.open(
                        `Supplier ${this.isEditMode ? 'updated' : 'created'} successfully`,
                        'Close',
                        { duration: 3000 }
                    );
                    this.router.navigate(['/suppliers']);
                },
                error: (error) => {
                    console.error('Error saving supplier:', error);
                    this.snackBar.open('Error saving supplier', 'Close', { duration: 3000 });
                    this.submitting = false;
                }
            });
        }
    }

    onCancel(): void {
        this.router.navigate(['/suppliers']);
    }
}
