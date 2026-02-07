import { Router, Request, Response } from 'express';
import { AdvanceRepository } from '../repositories/advance.repository';

const router = Router();
const advanceRepo = new AdvanceRepository();

// GET /api/advances - Get all advances
router.get('/', async (req: Request, res: Response) => {
    try {
        const advances = await advanceRepo.findAll();
        res.json(advances);
    } catch (error) {
        console.error('Error fetching advances:', error);
        res.status(500).json({ error: 'Failed to fetch advances' });
    }
});

// GET /api/advances/:id - Get advance by ID
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const advance = await advanceRepo.findById(parseInt(req.params.id));
        if (!advance) {
            return res.status(404).json({ error: 'Advance not found' });
        }
        res.json(advance);
    } catch (error) {
        console.error('Error fetching advance:', error);
        res.status(500).json({ error: 'Failed to fetch advance' });
    }
});

// DELETE /api/advances/:id - Delete advance
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const deleted = await advanceRepo.delete(parseInt(req.params.id));
        if (!deleted) {
            return res.status(404).json({ error: 'Advance not found' });
        }
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting advance:', error);
        res.status(500).json({ error: 'Failed to delete advance' });
    }
});

export default router;
