import prisma from '../config/prisma';
import { Invoice } from '@prisma/client';

export interface CreateInvoiceDto {
    invoiceNumber: string;
    supplierId: number;
    description?: string;
    totalAmount: number;
    invoiceDate: Date;
    dueDate?: Date;
}

export interface UpdateInvoiceDto {
    invoiceNumber?: string;
    supplierId?: number;
    description?: string;
    totalAmount?: number;
    paymentStatus?: string;
    invoiceDate?: Date;
    dueDate?: Date;
}

export class InvoiceRepository {
    async findAll(): Promise<Invoice[]> {
        return await prisma.invoice.findMany({
            include: {
                supplier: true,
                payments: {
                    orderBy: {
                        paymentDate: 'desc'
                    }
                }
            },
            orderBy: {
                invoiceDate: 'desc'
            }
        });
    }

    async findById(id: number): Promise<Invoice | null> {
        return await prisma.invoice.findUnique({
            where: { id },
            include: {
                supplier: true,
                payments: {
                    orderBy: {
                        paymentDate: 'desc'
                    }
                }
            }
        });
    }

    async findByInvoiceNumber(invoiceNumber: string): Promise<Invoice | null> {
        return await prisma.invoice.findUnique({
            where: { invoiceNumber },
            include: {
                supplier: true,
                payments: true
            }
        });
    }

    async create(data: CreateInvoiceDto): Promise<Invoice> {
        return await prisma.invoice.create({
            data: {
                ...data,
                paymentStatus: 'pending',
                paidAmount: 0
            },
            include: {
                payments: true
            }
        });
    }

    async update(id: number, data: UpdateInvoiceDto): Promise<Invoice | null> {
        return await prisma.invoice.update({
            where: { id },
            data,
            include: {
                supplier: true,
                payments: true
            }
        });
    }

    async delete(id: number): Promise<boolean> {
        try {
            await prisma.invoice.delete({
                where: { id }
            });
            return true;
        } catch {
            return false;
        }
    }

    async findByInvoiceNumbers(numbers: string[], supplierId?: number): Promise<Invoice[]> {
        return await prisma.invoice.findMany({
            where: {
                invoiceNumber: {
                    in: numbers
                },
                ...(supplierId ? { supplierId } : {})
            },
            include: {
                supplier: true
            }
        });
    }

    async batchPay(ids: number[]): Promise<void> {
        const invoices = await prisma.invoice.findMany({
            where: { id: { in: ids } },
            select: { id: true, totalAmount: true }
        });

        await prisma.$transaction(async (tx) => {
            for (const inv of invoices) {
                // Update Invoice
                await tx.invoice.update({
                    where: { id: inv.id },
                    data: {
                        paymentStatus: 'paid',
                        paidAmount: inv.totalAmount
                    }
                });

                // Create Payment Record
                await tx.invoicePayment.create({
                    data: {
                        invoiceId: inv.id,
                        paymentAmount: inv.totalAmount,
                        paymentDate: new Date(),
                        paymentMethod: 'Batch Reconciliation',
                        notes: 'Auto-created via Batch Payment'
                    }
                });
            }
        });
    }
}
