import prisma from '../config/prisma';
import { Vacation } from '@prisma/client';

export interface CreateVacationDto {
    workerId: number;
    startDate: Date;
    endDate: Date;
    totalDays: number;
    notes?: string;
}

export interface UpdateVacationDto {
    startDate?: Date;
    endDate?: Date;
    totalDays?: number;
    status?: string;
    notes?: string;
}

export class VacationRepository {
    async findAll(): Promise<Vacation[]> {
        return await prisma.vacation.findMany({
            include: {
                worker: true
            },
            orderBy: {
                startDate: 'desc'
            }
        });
    }

    async findById(id: number): Promise<Vacation | null> {
        return await prisma.vacation.findUnique({
            where: { id },
            include: {
                worker: true
            }
        });
    }

    async findByWorker(workerId: number): Promise<Vacation[]> {
        return await prisma.vacation.findMany({
            where: { workerId },
            include: {
                worker: true
            },
            orderBy: {
                startDate: 'desc'
            }
        });
    }

    async create(data: CreateVacationDto): Promise<Vacation> {
        return await prisma.vacation.create({
            data: {
                ...data,
                status: 'requested'
            },
            include: {
                worker: true
            }
        });
    }

    async update(id: number, data: UpdateVacationDto): Promise<Vacation | null> {
        return await prisma.vacation.update({
            where: { id },
            data,
            include: {
                worker: true
            }
        });
    }

    async delete(id: number): Promise<boolean> {
        try {
            await prisma.vacation.delete({
                where: { id }
            });
            return true;
        } catch {
            return false;
        }
    }
}
