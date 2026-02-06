# Workshop Management System - Backend

RESTful API for workshop management built with Node.js, TypeScript, Express, and SQL Server.

## Features

- Worker management
- Vehicle registration
- Job tracking with advances
- Vacation management
- Invoice and payment tracking

## Prerequisites

- Node.js 18+ and npm
- SQL Server (local instance)
- Windows Authentication or SQL Server credentials

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   - Copy `.env.example` to `.env`
   - Update database connection settings:
     ```
     DB_SERVER=localhost
     DB_NAME=WorkshopDB
     DB_TRUSTED_CONNECTION=true
     PORT=3000
     ```

3. **Run database migrations:**
   ```bash
   npm run migrate
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

## API Endpoints

### Workers
- `GET /api/workers` - List all workers
- `GET /api/workers/:id` - Get worker by ID
- `POST /api/workers` - Create new worker
- `PUT /api/workers/:id` - Update worker
- `DELETE /api/workers/:id` - Soft delete worker

### Vehicles
- `GET /api/vehicles` - List all vehicles
- `GET /api/vehicles/:id` - Get vehicle by ID
- `POST /api/vehicles` - Create new vehicle
- `PUT /api/vehicles/:id` - Update vehicle
- `DELETE /api/vehicles/:id` - Delete vehicle

### Jobs
- `GET /api/jobs` - List all jobs
- `GET /api/jobs/:id` - Get job by ID
- `GET /api/jobs/:id/advances` - Get job advances
- `POST /api/jobs` - Create new job
- `POST /api/jobs/:id/advances` - Add advance to job
- `PUT /api/jobs/:id` - Update job
- `DELETE /api/jobs/:id` - Delete job

### Vacations
- `GET /api/vacations` - List all vacations
- `GET /api/vacations/:id` - Get vacation by ID
- `POST /api/vacations` - Create vacation request
- `PUT /api/vacations/:id` - Update vacation
- `DELETE /api/vacations/:id` - Delete vacation

### Invoices
- `GET /api/invoices` - List all invoices
- `GET /api/invoices/:id` - Get invoice by ID
- `GET /api/invoices/:id/payments` - Get invoice payments
- `POST /api/invoices` - Create new invoice
- `POST /api/invoices/:id/payments` - Add payment to invoice
- `PUT /api/invoices/:id` - Update invoice
- `DELETE /api/invoices/:id` - Delete invoice

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run production build
- `npm run migrate` - Run database migrations

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.ts      # SQL Server connection
│   │   └── migrations.ts    # Migration runner
│   ├── models/              # TypeScript interfaces
│   ├── repositories/        # Data access layer
│   ├── routes/              # API endpoints
│   └── index.ts             # Main application
├── migrations/              # SQL migration files
├── package.json
├── tsconfig.json
└── .env
```

## Database Schema

The system uses SQL Server with the following tables:
- Workers
- Vehicles
- Jobs
- Advances
- Vacations
- Invoices
- Invoice_Payments
- Migrations (tracking)

All tables include proper indexes, foreign keys, and constraints.
