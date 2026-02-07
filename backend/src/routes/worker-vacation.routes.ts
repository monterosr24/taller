import { Router, Request, Response } from 'express';
import { WorkerRepository } from '../repositories/worker.repository';
import { vacationBalanceService } from '../services/vacation-balance.service';

const router = Router();
const workerRepo = new WorkerRepository();

// GET /api/workers/:id/vacation-balance
router.get('/:id/vacation-balance', async (req: Request, res: Response) => {
    try {
        const workerId = parseInt(req.params.id);

        const worker = await workerRepo.findByIdWithVacationBalance(workerId);

        if (!worker) {
            return res.status(404).json({ error: 'Worker not found' });
        }

        if (!worker.hireDate) {
            return res.status(400).json({ error: 'Worker does not have a hire date' });
        }

        // Separate vacations by status
        const approvedVacations = worker.vacations.filter(
            v => v.status === 'approved' || v.status === 'completed'
        );
        const requestedVacations = worker.vacations.filter(
            v => v.status === 'requested'
        );

        // Calculate balance
        const balance = await vacationBalanceService.getVacationBalance(
            workerId,
            worker.hireDate,
            approvedVacations,
            requestedVacations
        );

        res.json(balance);
    } catch (error) {
        console.error('Error fetching vacation balance:', error);
        res.status(500).json({
            error: 'Failed to fetch vacation balance',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

export default router;
