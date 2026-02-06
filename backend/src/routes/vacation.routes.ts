import { Router, Request, Response } from 'express';
import { VacationRepository } from '../repositories/vacation.repository';

const router = Router();
const vacationRepo = new VacationRepository();

// GET /api/vacations
router.get('/', async (req: Request, res: Response) => {
    try {
        const vacations = await vacationRepo.findAll();
        res.json(vacations);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch vacations' });
    }
});

// GET /api/vacations/:id
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const vacation = await vacationRepo.findById(parseInt(req.params.id));
        if (!vacation) {
            return res.status(404).json({ error: 'Vacation not found' });
        }
        res.json(vacation);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch vacation' });
    }
});

// POST /api/vacations
router.post('/', async (req: Request, res: Response) => {
    try {
        const vacation = await vacationRepo.create(req.body);
        res.status(201).json(vacation);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create vacation' });
    }
});

// PUT /api/vacations/:id
router.put('/:id', async (req: Request, res: Response) => {
    try {
        const vacation = await vacationRepo.update(parseInt(req.params.id), req.body);
        if (!vacation) {
            return res.status(404).json({ error: 'Vacation not found' });
        }
        res.json(vacation);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update vacation' });
    }
});

// DELETE /api/vacations/:id
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const deleted = await vacationRepo.delete(parseInt(req.params.id));
        if (!deleted) {
            return res.status(404).json({ error: 'Vacation not found' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete vacation' });
    }
});

export default router;
