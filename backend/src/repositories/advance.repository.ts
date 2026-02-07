import prisma from '../config/prisma';
import { Advance, Prisma } from '@prisma/client';

export interface CreateAdvanceDto {
    jobId: number;
    amount: number;
    description?: string;
    advanceDate: Date;
}

export class AdvanceRepository {
    /**
     * Converts Prisma Decimal type to number for arithmetic operations
     */
    private toNumber(value: number | Prisma.Decimal): number {
        return typeof value === 'number' ? value : Number(value);
    }

    /**
     * Validates if job is fully paid based on advances
     */
    private isJobFullyPaid(totalAmount: number, advanceAmount: number): boolean {
        return advanceAmount >= totalAmount;
    }

    async findAll(): Promise<Advance[]> {
        return await prisma.advance.findMany({
            include: {
                job: {
                    include: {
                        vehicle: true,
                        worker: true
                    }
                }
            },
            orderBy: {
                advanceDate: 'desc'
            }
        });
    }

    async findById(id: number): Promise<Advance | null> {
        return await prisma.advance.findUnique({
            where: { id },
            include: {
                job: {
                    include: {
                        vehicle: true,
                        worker: true
                    }
                }
            }
        });
    }

    async findByJob(jobId: number): Promise<Advance[]> {
        return await prisma.advance.findMany({
            where: { jobId },
            orderBy: {
                advanceDate: 'desc'
            }
        });
    }

    async create(data: CreateAdvanceDto): Promise<Advance> {
        return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            // Fetch job details
            const job = await tx.job.findUnique({
                where: { id: data.jobId },
                select: { totalAmount: true, advanceAmount: true, status: true }
            });

            if (!job) {
                throw new Error(`Job with ID ${data.jobId} not found`);
            }

            // Convert Prisma Decimals to numbers
            const totalAmount = this.toNumber(job.totalAmount);
            const currentAdvanceAmount = job.advanceAmount ? this.toNumber(job.advanceAmount) : 0;
            const newAdvanceAmount = currentAdvanceAmount + data.amount;

            // Validate advance doesn't exceed total
            if (newAdvanceAmount > totalAmount) {
                console.warn(`Advance amount ($${newAdvanceAmount}) exceeds job total ($${totalAmount}) for Job #${data.jobId}`);
            }

            // Create the advance record
            const advance = await tx.advance.create({
                data,
                include: { job: true }
            });

            // Determine new job status
            const shouldComplete = this.isJobFullyPaid(totalAmount, newAdvanceAmount);

            // Update job with new advance amount and possibly status
            await tx.job.update({
                where: { id: data.jobId },
                data: {
                    advanceAmount: newAdvanceAmount,
                    ...(shouldComplete && { status: 'completed' })
                }
            });

            return advance;
        });
    }

    async delete(id: number): Promise<boolean> {
        try {
            return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
                // Get advance details
                const advance = await tx.advance.findUnique({
                    where: { id }
                });

                if (!advance) {
                    return false;
                }

                // Delete advance
                await tx.advance.delete({
                    where: { id }
                });

                // Update job's advance amount
                await tx.job.update({
                    where: { id: advance.jobId },
                    data: {
                        advanceAmount: {
                            decrement: Number(advance.amount)
                        }
                    }
                });

                return true;
            });
        } catch {
            return false;
        }
    }
}
