import { Router, Request, Response } from 'express';
import { SupplierRepository } from '../repositories/supplier.repository';

const router = Router();
const supplierRepo = new SupplierRepository();

// GET /api/suppliers
router.get('/', async (req: Request, res: Response) => {
    try {
        const suppliers = await supplierRepo.findAll();
        res.json(suppliers);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch suppliers' });
    }
});

// GET /api/suppliers/:id
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const supplier = await supplierRepo.findById(parseInt(req.params.id));
        if (!supplier) {
            return res.status(404).json({ error: 'Supplier not found' });
        }
        res.json(supplier);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch supplier' });
    }
});

// POST /api/suppliers
router.post('/', async (req: Request, res: Response) => {
    try {
        const supplier = await supplierRepo.create(req.body);
        res.status(201).json(supplier);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create supplier' });
    }
});

// PUT /api/suppliers/:id
router.put('/:id', async (req: Request, res: Response) => {
    try {
        const supplier = await supplierRepo.update(parseInt(req.params.id), req.body);
        if (!supplier) {
            return res.status(404).json({ error: 'Supplier not found' });
        }
        res.json(supplier);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update supplier' });
    }
});

// DELETE /api/suppliers/:id
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const deleted = await supplierRepo.delete(parseInt(req.params.id));
        if (!deleted) {
            return res.status(404).json({ error: 'Supplier not found' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete supplier' });
    }
});

export default router;
