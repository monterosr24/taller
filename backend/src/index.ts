import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { getPool, closePool } from './config/database';

// Routes
import workerRoutes from './routes/worker.routes';
import vehicleRoutes from './routes/vehicle.routes';
import jobRoutes from './routes/job.routes';
import vacationRoutes from './routes/vacation.routes';
import invoiceRoutes from './routes/invoice.routes';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/workers', workerRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/vacations', vacationRoutes);
app.use('/api/invoices', invoiceRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Workshop API is running' });
});

// Error handling
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// Start server
const startServer = async () => {
    try {
        // Test database connection
        await getPool();
        console.log('✅ Database connection established');

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
    await closePool();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\n🛑 Shutting down gracefully...');
    await closePool();
    process.exit(0);
});

startServer();
