import prisma from '../config/prisma';
import { Job } from '@prisma/client';

export interface CreateJobDto {
    vehicleId: number;
    workerId: number;
    description: string;
    totalAmount: number;
    startDate?: Date;
    endDate?: Date;
}

export interface UpdateJobDto {
    vehicleId?: number;
    workerId?: number;
    description?: string;
    totalAmount?: number;
    status?: string;
    startDate?: Date;
    endDate?: Date;
}

export class JobRepository {
    async findAll(): Promise<Job[]> {
        return await prisma.job.findMany({
            include: {
                vehicle: true,
                worker: true,
                advances: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    }

    async findById(id: number): Promise<Job | null> {
        return await prisma.job.findUnique({
            where: { id },
            include: {
                vehicle: true,
                worker: true,
                advances: true
            }
        });
    }

    async findByWorker(workerId: number): Promise<Job[]> {
        return await prisma.job.findMany({
            where: { workerId },
            include: {
                vehicle: true,
                worker: true,
                advances: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    }

    async create(data: CreateJobDto): Promise<Job> {
        return await prisma.job.create({
            data: {
                ...data,
                status: 'pending'
            },
            include: {
                vehicle: true,
                worker: true
            }
        });
    }

    async update(id: number, data: UpdateJobDto): Promise<Job | null> {
        return await prisma.job.update({
            where: { id },
            data,
            include: {
                vehicle: true,
                worker: true
            }
        });
    }

    async delete(id: number): Promise<boolean> {
        try {
            await prisma.job.delete({
                where: { id }
            });
            return true;
        } catch {
            return false;
        }
    }
}
