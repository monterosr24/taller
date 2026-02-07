import prisma from '../config/prisma';
import { Vacation } from '@prisma/client';
import { vacationBalanceService } from '../services/vacation-balance.service';

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
        // Get worker with vacation data
        const worker = await prisma.worker.findUnique({
            where: { id: data.workerId },
            include: {
                vacations: {
                    where: {
                        status: { in: ['approved', 'completed'] }
                    },
                    select: { totalDays: true }
                }
            }
        });

        if (!worker) {
            throw new Error(`Worker with ID ${data.workerId} not found`);
        }

        if (!worker.hireDate) {
            throw new Error('Worker does not have a hire date');
        }

        // Get pending/requested vacations
        const pendingVacations = await prisma.vacation.findMany({
            where: {
                workerId: data.workerId,
                status: 'requested'
            },
            select: { totalDays: true }
        });

        // Calculate vacation balance
        const balance = await vacationBalanceService.getVacationBalance(
            data.workerId,
            worker.hireDate,
            worker.vacations,
            pendingVacations
        );

        // Validate sufficient balance
        if (!vacationBalanceService.canRequestVacation(balance.availableDays, data.totalDays)) {
            throw new Error(
                `Insufficient vacation balance. Available: ${balance.availableDays} days, Requested: ${data.totalDays} days`
            );
        }

        // Create vacation request
        const vacation = await prisma.vacation.create({
            data: {
                ...data,
                status: 'approved' // Auto-approve if validation passed
            },
            include: {
                worker: true
            }
        });

        return vacation;
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
