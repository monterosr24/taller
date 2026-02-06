import { Router, Request, Response } from 'express';
import { WorkerRepository } from '../repositories/worker.repository';

const router = Router();
const workerRepo = new WorkerRepository();

// GET /api/workers
router.get('/', async (req: Request, res: Response) => {
    try {
        const workers = await workerRepo.findAll();
        res.json(workers);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch workers' });
    }
});

// GET /api/workers/:id
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const worker = await workerRepo.findById(parseInt(req.params.id));
        if (!worker) {
            return res.status(404).json({ error: 'Worker not found' });
        }
        res.json(worker);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch worker' });
    }
});

// POST /api/workers
router.post('/', async (req: Request, res: Response) => {
    try {
        const worker = await workerRepo.create(req.body);
        res.status(201).json(worker);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create worker' });
    }
});

// PUT /api/workers/:id
router.put('/:id', async (req: Request, res: Response) => {
    try {
        const worker = await workerRepo.update(parseInt(req.params.id), req.body);
        if (!worker) {
            return res.status(404).json({ error: 'Worker not found' });
        }
        res.json(worker);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update worker' });
    }
});

// DELETE /api/workers/:id
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const deleted = await workerRepo.delete(parseInt(req.params.id));
        if (!deleted) {
            return res.status(404).json({ error: 'Worker not found' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete worker' });
    }
});

export default router;
