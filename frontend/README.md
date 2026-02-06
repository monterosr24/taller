# Workshop Frontend - Angular Application

Angular 17 application for the Workshop Management System.

## Current Status

### ✅ Fully Implemented
- **App Module** - Complete with Material Design
- **Routing** - All routes configured
- **Home Page** - Dashboard with feature cards
- **Navigation** - Toolbar with menu
- **Services** - API services for all entities (Workers, Vehicles, Jobs, Vacations, Invoices)
- **Models** - TypeScript interfaces matching backend
- **Workers Module** - Complete CRUD with list and form components
- **Vehicles Module** - Complete CRUD with list and form components

### ⚠️ Stub Components (Need Implementation)
The following components are created as stubs and need full implementation:
- `job-list.component.ts` - Jobs table with advances
- `job-form.component.ts` - Create/edit job form
- `advance-dialog.component.ts` - Add advance dialog
- `vacation-list.component.ts` - Vacation requests table
- `vacation-form.component.ts` - Vacation request form  
- `invoice-list.component.ts` - Invoices with payment status
- `invoice-form.component.ts` - Invoice create/edit form
- `payment-dialog.component.ts` - Add payment dialog

## How to Expand Stub Components

Each stub component can be expanded by following the pattern used in Workers components:

### For List Components:
1. Import the service (e.g., `JobService`)
2. Create `displayedColumns` array
3. Load data in `ngOnInit()`
4. Add edit/delete methods
5. Create the HTML template with `mat-table`

**Example:** Copy `worker-list.component.ts` structure and replace Worker with Job/Vacation/Invoice.

### For Form Components:
1. Use `FormBuilder` to create reactive form
2. Load data if editing (check route params)
3. Implement `onSubmit()` method
4. Create HTML template with `mat-form-field`

**Example:** Copy `worker-form.component.ts` structure.

### For Dialog Components:
1. Inject `MAT_DIALOG_DATA` and `MatDialogRef`
2. Create form for the dialog data
3. Implement submit/cancel methods
4. Return data via `dialogRef.close(data)`

## Installation

```bash
npm install
```

## Development

Start the dev server:
```bash
npm start
```

Navigate to `http://localhost:4200`

## Project Structure

```
src/app/
├── core/
│   ├── models/
│   │   └── models.ts           # All TypeScript interfaces
│   └── services/
│       ├── api.service.ts      # HTTP client wrapper
│       ├── worker.service.ts   # Worker CRUD
│       ├── vehicle.service.ts  # Vehicle CRUD
│       ├── job.service.ts      # Job CRUD + advances
│       ├── vacation.service.ts # Vacation CRUD
│       └── invoice.service.ts  # Invoice CRUD + payments
├── shared/
│   └── navbar/                 # Navigation component
├── home/                       # Home page
├── workers/                    # ✅ Complete
│   ├── worker-list/
│   └── worker-form/
├── vehicles/                   # ✅ Complete
│   ├── vehicle-list/
│   └── vehicle-form/
├── jobs/                       # ⚠️ Stubs
│   ├── job-list/
│   ├── job-form/
│   └── advance-dialog/
├── vacations/                  # ⚠️ Stubs
│   ├── vacation-list/
│   └── vacation-form/
└── invoices/                   # ⚠️ Stubs
    ├── invoice-list/
    ├── invoice-form/
    └── payment-dialog/
```

## Features

### Workers Management ✅
- List all workers with pagination
- Create new worker with form validation
- Edit worker details
- Soft delete (deactivate) workers
- Display salary, contact info

### Vehicles Management ✅  
- List all vehicles
- Register new vehicles
- Edit vehicle information
- Delete vehicles
- Show owner details

### Jobs Management (Stub)
To implement:
- List jobs with worker and vehicle info
- Create jobs with worker/vehicle selection
- Update job status
- Track payment advances
- Calculate remaining balance

### Vacations Management (Stub)
To implement:
- Request vacation with date selection
- Display worker's vacation history
- Approve/reject requests
- Status tracking with badges

### Invoices Management (Stub)
To implement:
- Create purchase invoices
- Track payment history
- Display payment status (pending/partial/paid)
- Add individual payments
- Calculate balances automatically

## Connected to Backend

All services are configured to connect to:
```
http://localhost:3000/api
```

Make sure the backend is running before starting the frontend.

## Material Design

The application uses Angular Material 17 with the Indigo-Pink theme. All Material modules are imported in `app.module.ts`.

## Next Steps

1. **Expand stub components** - Use Workers/Vehicles as templates
2. **Add loading states** - Spinners while data loads
3. **Add error handling** - Display user-friendly error messages
4. **Add confirmation dialogs** - Before delete operations
5. **Add filtering/sorting** - On list tables
6. **Add pagination** - For large datasets

## Tips for Development

- **Auto-reload**: Angular CLI watches for file changes
- **TypeScript errors**: Check terminal for compilation errors
- **Material docs**: https://material.angular.io/
- **Backend API**: Test endpoints with Postman first
- **Browser console**: Check for runtime errors

## Building for Production

```bash
ng build --configuration production
```

Output will be in `dist/` folder ready to deploy.
