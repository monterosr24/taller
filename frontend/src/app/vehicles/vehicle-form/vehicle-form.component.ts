import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VehicleService } from '../../core/services/vehicle.service';

@Component({
    selector: 'app-vehicle-form',
    template: `
    <div class="container" style="max-width: 800px; margin: 0 auto; padding: 20px;">
      <h2>{{ isEdit ? 'Edit' : 'New' }} Vehicle</h2>
      <mat-card>
        <form [formGroup]="form" (ngSubmit)="submit()">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px;">
            <mat-form-field class="form-field-full-width">
              <mat-label>License Plate</mat-label>
              <input matInput formControlName="license_plate" required>
            </mat-form-field>
            <mat-form-field class="form-field-full-width">
              <mat-label>Brand</mat-label>
              <input matInput formControlName="brand">
            </mat-form-field>
            <mat-form-field class="form-field-full-width">
              <mat-label>Model</mat-label>
              <input matInput formControlName="model">
            </mat-form-field>
            <mat-form-field class="form-field-full-width">
              <mat-label>Year</mat-label>
              <input matInput type="number" formControlName="year">
            </mat-form-field>
            <mat-form-field class="form-field-full-width">
              <mat-label>Owner Name</mat-label>
              <input matInput formControlName="owner_name">
            </mat-form-field>
            <mat-form-field class="form-field-full-width">
              <mat-label>Owner Phone</mat-label>
              <input matInput formControlName="owner_phone">
            </mat-form-field>
          </div>
          <div class="form-actions">
            <button mat-button type="button" (click)="router.navigate(['/vehicles'])">Cancel</button>
            <button mat-raised-button color="primary" type="submit" [disabled]="!form.valid">Save</button>
          </div>
        </form>
      </mat-card>
    </div>
  `
})
export class VehicleFormComponent implements OnInit {
    form: FormGroup;
    isEdit = false;
    id?: number;

    constructor(
        private fb: FormBuilder,
        private service: VehicleService,
        public router: Router,
        private route: ActivatedRoute,
        private snackBar: MatSnackBar
    ) {
        this.form = this.fb.group({
            license_plate: ['', Validators.required],
            brand: [''],
            model: [''],
            year: [''],
            owner_name: [''],
            owner_phone: ['']
        });
    }

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.isEdit = true;
            this.id = +id;
            this.service.getById(this.id).subscribe(data => this.form.patchValue(data));
        }
    }

    submit(): void {
        if (this.form.valid) {
            const req = this.isEdit ? this.service.update(this.id!, this.form.value) : this.service.create(this.form.value);
            req.subscribe(() => {
                this.snackBar.open('Saved', 'Close', { duration: 2000 });
                this.router.navigate(['/vehicles']);
            });
        }
    }
}
