import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { InvoiceTemplateService } from '../services/InvoiceTemplateService';
import { LocalStorageService } from '../services/LocalStorageService';
import path from 'path';

// Setup dependencies manually (clean & simple)
const prisma = new PrismaClient();
const storage = new LocalStorageService('./uploads');
const service = new InvoiceTemplateService(prisma, storage);

// Helper for async errors
const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

export const InvoiceTemplateController = {
    create: async (req: Request, res: Response) => {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        const supplierId = parseInt(req.body.supplierId);
        const name = req.body.name;

        if (isNaN(supplierId)) {
            return res.status(400).json({ error: 'Invalid supplier ID' });
        }

        const template = await service.createTemplate(supplierId, req.file, name);
        res.status(201).json(template);
    },

    getBySupplier: async (req: Request, res: Response) => {
        const supplierId = parseInt(req.params.supplierId);
        if (isNaN(supplierId)) return res.status(400).json({ error: 'Invalid supplier ID' });

        const templates = await service.getTemplates(supplierId);
        res.json(templates);
    },

    getFile: async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        const template = await service.getTemplate(id); // Returns Prisma raw object

        // In this simplified service, getTemplate returns the object directly
        // service.getTemplate is: return await this.prisma.invoiceTemplate.findUnique({ where: { id } });

        if (!template) return res.status(404).json({ error: 'Template not found' });

        res.sendFile(path.resolve(template.filePath));
    },

    saveZones: async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        const zones = req.body.zones; // Expects JSON array

        if (!Array.isArray(zones)) {
            return res.status(400).json({ error: 'Zones must be an array' });
        }

        const updated = await service.updateZones(id, zones);
        res.json(updated);
    },

    delete: async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        await service.deleteTemplate(id);
        res.status(204).send();
    }
};

export { asyncHandler };
