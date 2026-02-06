import { Router, Request, Response } from 'express';
import { VehicleRepository } from '../repositories/vehicle.repository';

const router = Router();
const vehicleRepo = new VehicleRepository();

// GET /api/vehicles
router.get('/', async (req: Request, res: Response) => {
    try {
        const vehicles = await vehicleRepo.findAll();
        res.json(vehicles);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch vehicles' });
    }
});

// GET /api/vehicles/:id
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const vehicle = await vehicleRepo.findById(parseInt(req.params.id));
        if (!vehicle) {
            return res.status(404).json({ error: 'Vehicle not found' });
        }
        res.json(vehicle);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch vehicle' });
    }
});

// POST /api/vehicles
router.post('/', async (req: Request, res: Response) => {
    try {
        const vehicle = await vehicleRepo.create(req.body);
        res.status(201).json(vehicle);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create vehicle' });
    }
});

// PUT /api/vehicles/:id
router.put('/:id', async (req: Request, res: Response) => {
    try {
        const vehicle = await vehicleRepo.update(parseInt(req.params.id), req.body);
        if (!vehicle) {
            return res.status(404).json({ error: 'Vehicle not found' });
        }
        res.json(vehicle);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update vehicle' });
    }
});

// DELETE /api/vehicles/:id
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const deleted = await vehicleRepo.delete(parseInt(req.params.id));
        if (!deleted) {
            return res.status(404).json({ error: 'Vehicle not found' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete vehicle' });
    }
});

export default router;
