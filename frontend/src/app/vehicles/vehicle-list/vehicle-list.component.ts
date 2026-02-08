import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VehicleService } from '../../core/services/vehicle.service';
import { Vehicle } from '../../core/models/models';
import { ColumnConfig, TableAction, TableConfig } from '../../shared/components/data-table/models/table-config.model';
import { FilterType } from '../../shared/components/data-table/models/filter-config.model';

@Component({
  selector: 'app-vehicle-list',
  templateUrl: './vehicle-list.component.html',
  styleUrls: ['./vehicle-list.component.css']
})
export class VehicleListComponent implements OnInit {
  vehicles: Vehicle[] = [];
  loading = false;

  columns: ColumnConfig<Vehicle>[] = [
    {
      key: 'licensePlate',
      header: 'License Plate',
      sortable: true,
      filter: {
        type: FilterType.TEXT,
        placeholder: 'Search license plate...'
      }
    },
    {
      key: 'brand',
      header: 'Brand',
      sortable: true,
      filter: {
        type: FilterType.TEXT,
        placeholder: 'Search brand...'
      }
    },
    {
      key: 'model',
      header: 'Model',
      sortable: true,
      filter: {
        type: FilterType.TEXT,
        placeholder: 'Search model...'
      }
    },
    {
      key: 'year',
      header: 'Year',
      sortable: true,
      align: 'center',
      hideOnMobile: true
    }
  ];

  actions: TableAction<Vehicle>[] = [
    {
      label: 'Edit',
      icon: 'edit',
      action: (row) => this.editVehicle(row.id!),
      color: 'primary'
    },
    {
      label: 'Delete',
      icon: 'delete',
      action: (row) => this.deleteVehicle(row.id!),
      color: 'warn'
    }
  ];

  tableConfig: TableConfig = {
    enableSearch: false, // Using column filters instead
    enablePagination: true,
    pageSizeOptions: [10, 25, 50, 100],
    defaultPageSize: 10,
    enableRowClick: false,
    stickyHeader: true,
    enableColumnFilters: true,
    emptyMessage: 'No vehicles registered',
    loadingMessage: 'Loading vehicles...'
  };

  constructor(
    private vehicleService: VehicleService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadVehicles();
  }

  loadVehicles(): void {
    this.loading = true;
    this.vehicleService.getAll().subscribe({
      next: (data) => {
        this.vehicles = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading vehicles:', error);
        this.loading = false;
      }
    });
  }

  createVehicle(): void {
    this.router.navigate(['/vehicles/new']);
  }

  editVehicle(id: number): void {
    this.router.navigate(['/vehicles/edit', id]);
  }

  deleteVehicle(id: number): void {
    if (confirm('Are you sure you want to delete this vehicle?')) {
      this.vehicleService.delete(id).subscribe({
        next: () => this.loadVehicles(),
        error: (error) => console.error('Error deleting vehicle:', error)
      });
    }
  }
}
