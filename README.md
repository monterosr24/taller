# Workshop Management System

A complete workshop management system built with Node.js, TypeScript, Express, Angular, and SQL Server.

## Features

- ✅ **Worker Management** - Track employee information, salaries, and status
- ✅ **Vehicle Registration** - Manage vehicles and owner information  
- ✅ **Job Tracking** - Assign jobs to workers with progress tracking
- ✅ **Payment Advances** - Track advances against jobs
- ✅ **Vacation Management** - Request and approve vacation time
- ✅ **Invoice Tracking** - Purchase invoices with payment history

## Project Structure

```
taller/
├── backend/           # Node.js + Express API
│   ├── src/
│   │   ├── config/    # Database & migrations
│   │   ├── models/    # TypeScript interfaces
│   │   ├── repositories/  # Data access layer
│   │   ├── routes/    # API endpoints
│   │   └── index.ts   # Main app
│   ├── migrations/    # SQL migration files
│   └── package.json
│
└── frontend/          # Angular application
    ├── src/
    │   ├── app/       # Angular components
    │   ├── environments/  # Config files
    │   └── styles.css # Global styles
    └── package.json
```

## Backend Setup

### Prerequisites
- Node.js 18+
- SQL Server (local instance)
- Windows Authentication or SQL credentials

### Installation

1. **Navigate to backend:**
   ```bash
   cd backend
   npm install
   ```

2. **Configure database:**
   - Edit `.env` file with your SQL Server settings
   - Default uses Windows Authentication on `localhost`

3. **Run migrations:**
   ```bash
   npm run migrate
   ```

4. **Start server:**
   ```bash
   npm run dev
   ```

Server runs on `http://localhost:3000`

### API Endpoints

#### Workers
- `GET /api/workers` - List all active workers
- `POST /api/workers` - Create new worker
- `PUT /api/workers/:id` - Update worker
- `DELETE /api/workers/:id` - Deactivate worker

#### Vehicles
- `GET /api/vehicles` - List all vehicles
- `POST /api/vehicles` - Register new vehicle

#### Jobs
- `GET /api/jobs` - List all jobs with worker/vehicle details
- `POST /api/jobs` - Create new job
- `POST /api/jobs/:id/advances` - Add payment advance
- `GET /api/jobs/:id/advances` - List job advances

#### Vacations
- `GET /api/vacations` - List all vacation requests
- `POST /api/vacations` - Submit vacation request
- `PUT /api/vacations/:id` - Update status (approve/reject)

#### Invoices
- `GET /api/invoices` - List all invoices
- `POST /api/invoices` - Create new invoice
- `POST /api/invoices/:id/payments` - Add payment
- `GET /api/invoices/:id/payments` - List invoice payments

## Frontend Setup

### Prerequisites
- Node.js 18+
- Angular CLI: `npm install -g @angular/cli`

### Installation

1. **Navigate to frontend:**
   ```bash
   cd frontend
   npm install
   ```

2. **Start development server:**
   ```bash
   npm start
   ```

Application runs on `http://localhost:4200`

## Database Schema

### Tables

- **Workers** - Employee information and status
- **Vehicles** - Vehicle registry with owner details
- **Jobs** - Work orders with worker/vehicle assignment
- **Advances** - Payment advances linked to jobs
- **Vacations** - Vacation requests with approval workflow
- **Invoices** - Purchase invoices with payment tracking
- **Invoice_Payments** - Individual payments against invoices
- **Migrations** - Database version tracking

### Key Features

- **Automatic calculations:** 
  - Job advance totals
  - Invoice payment status (pending → partial → paid)
- **Referential integrity:** Foreign keys with cascade deletes
- **Soft deletes:** Workers marked inactive instead of deleted
- **Indexes:** Optimized queries on foreign keys

## Technology Stack

### Backend
- **Node.js** + **TypeScript** - Type-safe server-side development
- **Express** - RESTful API framework
- **mssql** - SQL Server driver with connection pooling
- **dotenv** - Environment configuration

### Frontend
- **Angular 17** - Modern reactive framework
- **Angular Material** - UI component library
- **RxJS** - Reactive programming
- **TypeScript** - Type-safe client development

### Database
- **SQL Server** - Enterprise-grade relational database
- **Custom migrations** - Version-controlled schema changes
- **Transactions** - ACID compliance for critical operations

## Development Workflow

1. **Make schema changes:**
   - Create new migration SQL file in `backend/migrations/`
   - Name it with incremental number: `002_add_feature.sql`
   - Run: `npm run migrate`

2. **Add new feature:**
   - Create model in `backend/src/models/`
   - Create repository in `backend/src/repositories/`
   - Create routes in `backend/src/routes/`
   - Add router to `backend/src/index.ts`

3. **Frontend integration:**
   - Create Angular service to call API
   - Build components for CRUD operations
   - Add routes to Angular router

## Production Deployment

### Backend
```bash
cd backend
npm run build
npm start
```

### Frontend
```bash
cd frontend
ng build --configuration production
```

Serve the `dist/` folder with any web server (nginx, IIS, etc.)

## Environment Variables

### Backend (.env)
```
DB_SERVER=localhost
DB_NAME=WorkshopDB
DB_TRUSTED_CONNECTION=true
PORT=3000
NODE_ENV=production
```

### Frontend (environment.ts)
```typescript
apiUrl: 'http://your-server.com/api'
```

## Testing

### API Testing
Use tools like Postman or curl:

```bash
# Create worker
curl -X POST http://localhost:3000/api/workers \
  -H "Content-Type: application/json" \
  -d '{"first_name":"John","last_name":"Doe"}'

# Get all workers
curl http://localhost:3000/api/workers
```

### Frontend Testing
Navigate to `http://localhost:4200` and test UI interactions.

## Next Steps (Frontend Implementation)

The backend is fully implemented. To complete the Angular frontend:

1. **Install frontend dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Create core services:**
   - API service for HTTP calls
   - Model interfaces matching backend

3. **Build feature modules:**
   - Workers module (list, form components)
   - Jobs module (list, form, advance dialog)
   - Vacations module (list, form)
   - Invoices module (list, form, payment dialog)

4. **Add routing:**
   - Configure app routing module
   - Add navigation bar component

5. **Implement CRUD operations:**
   - Use Angular Material table for lists
   - Use Material forms for create/edit
   - Use Material dialogs for advances/payments

## Support

For issues or questions, refer to:
- Backend README: `backend/README.md`
- API documentation above
- SQL migration files for schema details

## License

MIT
