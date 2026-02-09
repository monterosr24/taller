import express from 'express';
import multer from 'multer';
import { InvoiceTemplateController, asyncHandler } from '../controllers/InvoiceTemplateController';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); // Buffer handling

// Templates
router.post('/templates', upload.single('file'), asyncHandler(InvoiceTemplateController.create));
router.get('/templates/supplier/:supplierId', asyncHandler(InvoiceTemplateController.getBySupplier));
router.get('/templates/:id/file', asyncHandler(InvoiceTemplateController.getFile));
router.put('/templates/:id/zones', asyncHandler(InvoiceTemplateController.saveZones));
router.delete('/templates/:id', asyncHandler(InvoiceTemplateController.delete));

export default router;
