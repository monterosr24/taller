import prisma from '../config/prisma';
import { Worker } from '@prisma/client';

export interface CreateWorkerDto {
    firstName: string;
    lastName: string;
    documentNumber?: string;
    phone?: string;
    email?: string;
    hireDate?: Date;
    baseSalary?: number;
}

export interface UpdateWorkerDto {
    firstName?: string;
    lastName?: string;
    documentNumber?: string;
    phone?: string;
    email?: string;
    hireDate?: Date;
    baseSalary?: number;
    isActive?: boolean;
}

export class WorkerRepository {
    async findAll(): Promise<Worker[]> {
        return await prisma.worker.findMany({
            where: {
                isActive: true
            },
            include: {
                jobs: {
                    include: {
                        vehicle: true
                    }
                },
                vacations: true
            },
            orderBy: {
                firstName: 'asc'
            }
        });
    }

    async findById(id: number): Promise<Worker | null> {
        return await prisma.worker.findUnique({
            where: { id },
            include: {
                jobs: {
                    include: {
                        vehicle: true
                    }
                },
                vacations: true
            }
        });
    }

    async findByIdWithVacationBalance(id: number) {
        const worker = await prisma.worker.findUnique({
            where: { id },
            include: {
                vacations: {
                    select: {
                        id: true,
                        totalDays: true,
                        status: true,
                        startDate: true,
                        endDate: true
                    }
                }
            }
        });

        return worker;
    }

    async create(data: CreateWorkerDto): Promise<Worker> {
        return await prisma.worker.create({
            data: {
                ...data,
                isActive: true
            }
        });
    }

    async update(id: number, data: UpdateWorkerDto): Promise<Worker | null> {
        return await prisma.worker.update({
            where: { id },
            data
        });
    }

    async delete(id: number): Promise<boolean> {
        const worker = await prisma.worker.update({
            where: { id },
            data: { isActive: false }
        });
        return !!worker;
    }
}
