import { Router, Request, Response } from 'express';
import { JobRepository } from '../repositories/job.repository';
import { AdvanceRepository } from '../repositories/advance.repository';

const router = Router();
const jobRepo = new JobRepository();
const advanceRepo = new AdvanceRepository();

// GET /api/jobs
router.get('/', async (req: Request, res: Response) => {
    try {
        const jobs = await jobRepo.findAll();
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch jobs' });
    }
});

// GET /api/jobs/:id
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const job = await jobRepo.findById(parseInt(req.params.id));
        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }
        res.json(job);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch job' });
    }
});

// GET /api/jobs/:id/advances
router.get('/:id/advances', async (req: Request, res: Response) => {
    try {
        const advances = await advanceRepo.findByJob(parseInt(req.params.id));
        res.json(advances);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch advances' });
    }
});

// POST /api/jobs
router.post('/', async (req: Request, res: Response) => {
    try {
        const job = await jobRepo.create(req.body);
        res.status(201).json(job);
    } catch (error) {
        console.error('Error creating job:', error);
        res.status(500).json({
            error: 'Failed to create job',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

// POST /api/jobs/:id/advances
router.post('/:id/advances', async (req: Request, res: Response) => {
    try {
        const advance = await advanceRepo.create({
            ...req.body,
            jobId: parseInt(req.params.id),
        });
        res.status(201).json(advance);
    } catch (error) {
        console.error('Error creating advance:', error);
        res.status(500).json({
            error: 'Failed to create advance',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

// PUT /api/jobs/:id
router.put('/:id', async (req: Request, res: Response) => {
    try {
        const job = await jobRepo.update(parseInt(req.params.id), req.body);
        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }
        res.json(job);
    } catch (error) {
        console.error('Error updating job:', error);
        res.status(500).json({
            error: 'Failed to update job',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

// DELETE /api/jobs/:id
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const deleted = await jobRepo.delete(parseInt(req.params.id));
        if (!deleted) {
            return res.status(404).json({ error: 'Job not found' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete job' });
    }
});

export default router;
