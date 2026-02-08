import { Router, Request, Response } from 'express';
import { SalaryAdvanceRepository } from '../repositories/salary-advance.repository';

const router = Router();
const salaryAdvanceRepo = new SalaryAdvanceRepository();

// Get salary advances for a worker
router.get('/worker/:workerId', async (req: Request, res: Response) => {
    try {
        const workerId = parseInt(req.params.workerId);
        const advances = await salaryAdvanceRepo.findByWorkerId(workerId);
        res.json(advances);
    } catch (error) {
        console.error('Error fetching salary advances:', error);
        res.status(500).json({ error: 'Failed to fetch salary advances' });
    }
});

// Get available advance amount for a worker
router.get('/worker/:workerId/available', async (req: Request, res: Response) => {
    try {
        const workerId = parseInt(req.params.workerId);
        const availableInfo = await salaryAdvanceRepo.getAvailableAdvance(workerId);

        if (!availableInfo) {
            return res.status(400).json({
                error: 'Worker is not eligible for salary advances'
            });
        }

        res.json(availableInfo);
    } catch (error) {
        console.error('Error calculating available advance:', error);
        res.status(500).json({ error: 'Failed to calculate available advance' });
    }
});

// Create a new salary advance
router.post('/', async (req: Request, res: Response) => {
    try {
        const advance = await salaryAdvanceRepo.create({
            workerId: req.body.workerId,
            amount: req.body.amount,
            advanceDate: new Date(req.body.advanceDate),
            paymentPeriodStart: new Date(req.body.paymentPeriodStart),
            paymentPeriodEnd: new Date(req.body.paymentPeriodEnd),
            notes: req.body.notes
        });
        res.status(201).json(advance);
    } catch (error: any) {
        console.error('Error creating salary advance:', error);
        res.status(400).json({
            error: error.message || 'Failed to create salary advance'
        });
    }
});

// Delete a salary advance
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const success = await salaryAdvanceRepo.delete(id);

        if (success) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Salary advance not found' });
        }
    } catch (error) {
        console.error('Error deleting salary advance:', error);
        res.status(500).json({ error: 'Failed to delete salary advance' });
    }
});

export default router;
