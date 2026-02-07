import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Material imports
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { HomeComponent } from './home/home.component';

// Worker components
import { WorkerListComponent } from './workers/worker-list/worker-list.component';
import { WorkerFormComponent } from './workers/worker-form/worker-form.component';

// Vehicle components
import { VehicleListComponent } from './vehicles/vehicle-list/vehicle-list.component';
import { VehicleFormComponent } from './vehicles/vehicle-form/vehicle-form.component';

// Job components
import { JobListComponent } from './jobs/job-list/job-list.component';
import { JobFormComponent } from './jobs/job-form/job-form.component';
import { AdvanceDialogComponent } from './jobs/advance-dialog/advance-dialog.component';
import { AdvanceListComponent } from './jobs/advance-list/advance-list.component';
import { AdvanceListDialogComponent } from './jobs/advance-list-dialog/advance-list-dialog.component';

// Vacation components
import { VacationListComponent } from './vacations/vacation-list/vacation-list.component';
import { VacationFormComponent } from './vacations/vacation-form/vacation-form.component';

// Invoice components
import { InvoiceListComponent } from './invoices/invoice-list/invoice-list.component';
import { InvoiceFormComponent } from './invoices/invoice-form/invoice-form.component';
import { PaymentDialogComponent } from './invoices/payment-dialog/payment-dialog.component';

@NgModule({
    declarations: [
        AppComponent,
        NavbarComponent,
        HomeComponent,
        WorkerListComponent,
        WorkerFormComponent,
        VehicleListComponent,
        VehicleFormComponent,
        JobListComponent,
        JobFormComponent,
        AdvanceDialogComponent,
        AdvanceListComponent,
        AdvanceListDialogComponent,
        VacationListComponent,
        VacationFormComponent,
        InvoiceListComponent,
        InvoiceFormComponent,
        PaymentDialogComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        AppRoutingModule,
        // Material modules
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatSidenavModule,
        MatListModule,
        MatCardModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatInputModule,
        MatFormFieldModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatDialogModule,
        MatSnackBarModule,
        MatProgressSpinnerModule,
        MatChipsModule,
        MatDividerModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
