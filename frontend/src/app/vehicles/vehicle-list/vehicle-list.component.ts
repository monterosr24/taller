import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VehicleService } from '../../core/services/vehicle.service';
import { Vehicle } from '../../core/models/models';

@Component({
    selector: 'app-vehicle-list',
    template: `
    <div class="container">
      <div class="header">
        <h2>Vehicles</h2>
        <button mat-raised-button color="primary" (click)="router.navigate(['/vehicles/new'])">
          <mat-icon>add</mat-icon> Add Vehicle
        </button>
      </div>
      <mat-card>
        <table mat-table [dataSource]="vehicles" class="mat-elevation-z8">
          <ng-container matColumnDef="license_plate">
            <th mat-header-cell *matHeaderCellDef>License Plate</th>
            <td mat-cell *matCellDef="let v">{{v.license_plate}}</td>
          </ng-container>
          <ng-container matColumnDef="brand">
            <th mat-header-cell *matHeaderCellDef>Brand</th>
            <td mat-cell *matCellDef="let v">{{v.brand}}</td>
          </ng-container>
          <ng-container matColumnDef="model">
            <th mat-header-cell *matHeaderCellDef>Model</th>
            <td mat-cell *matCellDef="let v">{{v.model}}</td>
          </ng-container>
          <ng-container matColumnDef="year">
            <th mat-header-cell *matHeaderCellDef>Year</th>
            <td mat-cell *matCellDef="let v">{{v.year}}</td>
          </ng-container>
          <ng-container matColumnDef="owner_name">
            <th mat-header-cell *matHeaderCellDef>Owner</th>
            <td mat-cell *matCellDef="let v">{{v.owner_name}}</td>
          </ng-container>
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef class="mat-column-actions">Actions</th>
            <td mat-cell *matCellDef="let v" class="mat-column-actions">
              <button mat-icon-button color="primary" (click)="router.navigate(['/vehicles/edit', v.id])"><mat-icon>edit</mat-icon></button>
              <button mat-icon-button color="warn" (click)="delete(v.id)"><mat-icon>delete</mat-icon></button>
            </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
      </mat-card>
    </div>
  `,
    styles: ['.container { padding: 20px; } .header { display: flex; justify-content: space-between; margin-bottom: 20px; } table { width: 100%; }']
})
export class VehicleListComponent implements OnInit {
    vehicles: Vehicle[] = [];
    displayedColumns = ['license_plate', 'brand', 'model', 'year', 'owner_name', 'actions'];

    constructor(public router: Router, private service: VehicleService, private snackBar: MatSnackBar) { }

    ngOnInit(): void {
        this.service.getAll().subscribe(data => this.vehicles = data);
    }

    delete(id: number): void {
        if (confirm('Delete this vehicle?')) {
            this.service.delete(id).subscribe(() => {
                this.snackBar.open('Deleted', 'Close', { duration: 2000 });
                this.ngOnInit();
            });
        }
    }
}
