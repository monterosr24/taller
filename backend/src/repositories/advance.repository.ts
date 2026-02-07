import prisma from '../config/prisma';
import { Advance, Prisma } from '@prisma/client';

export interface CreateAdvanceDto {
    jobId: number;
    amount: number;
    description?: string;
    advanceDate: Date;
}

export class AdvanceRepository {
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
                job: true
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
            // Create advance
            const advance = await tx.advance.create({
                data,
                include: {
                    job: true
                }
            });

            // Update job's advance amount
            await tx.job.update({
                where: { id: data.jobId },
                data: {
                    advanceAmount: {
                        increment: data.amount
                    }
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
