import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import prisma from './config/prisma';

// Routes
import jobRoutes from './routes/job.routes';
import workerRoutes from './routes/worker.routes';
import vehicleRoutes from './routes/vehicle.routes';
import vacationRoutes from './routes/vacation.routes';
import invoiceRoutes from './routes/invoice.routes';
import supplierRoutes from './routes/supplier.routes';
import advanceRoutes from './routes/advance.routes';
import salaryAdvanceRoutes from './routes/salary-advance.routes';
import invoiceAutomationRoutes from './invoice-automation/routes/invoice-automation.routes';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/jobs', jobRoutes);
app.use('/api/workers', workerRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/vacations', vacationRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/advances', advanceRoutes);
app.use('/api/salary-advances', salaryAdvanceRoutes);
app.use('/api/invoice-automation', invoiceAutomationRoutes); // Registered new routes

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Workshop API is running with Prisma' });
});

// Error handling
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// Start server
const startServer = async () => {
    try {
        // Test Prisma connection
        await prisma.$connect();
        console.log('✅ Connected to database via Prisma');

        app.listen(PORT, () => {
            console.log(`🚀 Server is running on http://localhost:${PORT}`);
            console.log(`📋 API endpoints available at http://localhost:${PORT}/api`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down gracefully...');
    await prisma.$disconnect();
    console.log('❌ Prisma disconnected');
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\n🛑 Shutting down gracefully...');
    await prisma.$disconnect();
    console.log('❌ Prisma disconnected');
    process.exit(0);
});

startServer();
