import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { WorkerListComponent } from './workers/worker-list/worker-list.component';
import { WorkerFormComponent } from './workers/worker-form/worker-form.component';
import { VehicleListComponent } from './vehicles/vehicle-list/vehicle-list.component';
import { VehicleFormComponent } from './vehicles/vehicle-form/vehicle-form.component';
import { JobListComponent } from './jobs/job-list/job-list.component';
import { JobFormComponent } from './jobs/job-form/job-form.component';
import { VacationListComponent } from './vacations/vacation-list/vacation-list.component';
import { VacationFormComponent } from './vacations/vacation-form/vacation-form.component';
import { InvoiceListComponent } from './invoices/invoice-list/invoice-list.component';
import { InvoiceFormComponent } from './invoices/invoice-form/invoice-form.component';

const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'workers', component: WorkerListComponent },
    { path: 'workers/new', component: WorkerFormComponent },
    { path: 'workers/edit/:id', component: WorkerFormComponent },
    { path: 'vehicles', component: VehicleListComponent },
    { path: 'vehicles/new', component: VehicleFormComponent },
    { path: 'vehicles/edit/:id', component: VehicleFormComponent },
    { path: 'jobs', component: JobListComponent },
    { path: 'jobs/new', component: JobFormComponent },
    { path: 'jobs/edit/:id', component: JobFormComponent },
    { path: 'vacations', component: VacationListComponent },
    { path: 'vacations/new', component: VacationFormComponent },
    { path: 'vacations/edit/:id', component: VacationFormComponent },
    { path: 'invoices', component: InvoiceListComponent },
    { path: 'invoices/new', component: InvoiceFormComponent },
    { path: 'invoices/edit/:id', component: InvoiceFormComponent },
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
