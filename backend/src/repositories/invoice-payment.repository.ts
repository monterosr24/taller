import prisma from '../config/prisma';
import { InvoicePayment, Prisma } from '@prisma/client';

export interface CreateInvoicePaymentDto {
    invoiceId: number;
    paymentAmount: number;
    paymentDate: Date;
    paymentMethod?: string;
    reference?: string;
    notes?: string;
}

export class InvoicePaymentRepository {
    async findAll(): Promise<InvoicePayment[]> {
        return await prisma.invoicePayment.findMany({
            include: {
                invoice: true
            },
            orderBy: {
                paymentDate: 'desc'
            }
        });
    }

    async findById(id: number): Promise<InvoicePayment | null> {
        return await prisma.invoicePayment.findUnique({
            where: { id },
            include: {
                invoice: true
            }
        });
    }

    async findByInvoice(invoiceId: number): Promise<InvoicePayment[]> {
        return await prisma.invoicePayment.findMany({
            where: { invoiceId },
            orderBy: {
                paymentDate: 'desc'
            }
        });
    }

    async create(data: CreateInvoicePaymentDto): Promise<InvoicePayment> {
        return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            // Create payment
            const payment = await tx.invoicePayment.create({
                data,
                include: {
                    invoice: true
                }
            });

            // Update invoice paid amount
            const invoice = await tx.invoice.findUnique({
                where: { id: data.invoiceId }
            });

            if (invoice) {
                const newPaidAmount = Number(invoice.paidAmount || 0) + data.paymentAmount;
                const newStatus = newPaidAmount >= Number(invoice.totalAmount)
                    ? 'paid'
                    : newPaidAmount > 0
                        ? 'partial'
                        : 'pending';

                await tx.invoice.update({
                    where: { id: data.invoiceId },
                    data: {
                        paidAmount: newPaidAmount,
                        paymentStatus: newStatus
                    }
                });
            }

            return payment;
        });
    }

    async delete(id: number): Promise<boolean> {
        try {
            return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
                // Get payment details
                const payment = await tx.invoicePayment.findUnique({
                    where: { id }
                });

                if (!payment) {
                    return false;
                }

                // Delete payment
                await tx.invoicePayment.delete({
                    where: { id }
                });

                // Update invoice paid amount
                const invoice = await tx.invoice.findUnique({
                    where: { id: payment.invoiceId }
                });

                if (invoice) {
                    const newPaidAmount = Number(invoice.paidAmount || 0) - Number(payment.paymentAmount);
                    const newStatus = newPaidAmount >= Number(invoice.totalAmount)
                        ? 'paid'
                        : newPaidAmount > 0
                            ? 'partial'
                            : 'pending';

                    await tx.invoice.update({
                        where: { id: payment.invoiceId },
                        data: {
                            paidAmount: Math.max(0, newPaidAmount),
                            paymentStatus: newStatus
                        }
                    });
                }

                return true;
            });
        } catch {
            return false;
        }
    }
}
