import prisma from '../config/prisma';
import { Invoice } from '@prisma/client';

export interface CreateInvoiceDto {
    invoiceNumber: string;
    supplier: string;
    description?: string;
    totalAmount: number;
    invoiceDate: Date;
    dueDate?: Date;
}

export interface UpdateInvoiceDto {
    invoiceNumber?: string;
    supplier?: string;
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
}
