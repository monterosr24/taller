import { Router, Request, Response } from 'express';
import { InvoiceRepository } from '../repositories/invoice.repository';
import { InvoicePaymentRepository } from '../repositories/invoice-payment.repository';

const router = Router();
const invoiceRepo = new InvoiceRepository();
const paymentRepo = new InvoicePaymentRepository();

// GET /api/invoices
router.get('/', async (req: Request, res: Response) => {
    try {
        const invoices = await invoiceRepo.findAll();
        res.json(invoices);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch invoices' });
    }
});

// GET /api/invoices/:id
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const invoice = await invoiceRepo.findById(parseInt(req.params.id));
        if (!invoice) {
            return res.status(404).json({ error: 'Invoice not found' });
        }
        res.json(invoice);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch invoice' });
    }
});

// GET /api/invoices/:id/payments
router.get('/:id/payments', async (req: Request, res: Response) => {
    try {
        const payments = await paymentRepo.findByInvoice(parseInt(req.params.id));
        res.json(payments);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch payments' });
    }
});

// POST /api/invoices
router.post('/', async (req: Request, res: Response) => {
    try {
        const invoice = await invoiceRepo.create(req.body);
        res.status(201).json(invoice);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create invoice' });
    }
});

// POST /api/invoices/:id/payments
router.post('/:id/payments', async (req: Request, res: Response) => {
    try {
        const payment = await paymentRepo.create({
            ...req.body,
            invoice_id: parseInt(req.params.id),
        });
        res.status(201).json(payment);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create payment' });
    }
});

// PUT /api/invoices/:id
router.put('/:id', async (req: Request, res: Response) => {
    try {
        const invoice = await invoiceRepo.update(parseInt(req.params.id), req.body);
        if (!invoice) {
            return res.status(404).json({ error: 'Invoice not found' });
        }
        res.json(invoice);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update invoice' });
    }
});

// DELETE /api/invoices/:id
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const deleted = await invoiceRepo.delete(parseInt(req.params.id));
        if (!deleted) {
            return res.status(404).json({ error: 'Invoice not found' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete invoice' });
    }
});

export default router;
