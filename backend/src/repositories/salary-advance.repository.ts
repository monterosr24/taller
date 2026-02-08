import prisma from '../config/prisma';
import { SalaryAdvance } from '@prisma/client';
import { CreateSalaryAdvanceDto, AvailableAdvanceInfo } from '../models/salary-advance.model';

export class SalaryAdvanceRepository {
    /**
     * Get all salary advances for a worker, optionally filtered by period
     */
    async findByWorkerId(
        workerId: number,
        periodStart?: Date,
        periodEnd?: Date
    ): Promise<SalaryAdvance[]> {
        const where: any = { workerId };

        if (periodStart && periodEnd) {
            where.AND = [
                { paymentPeriodStart: { lte: periodEnd } },
                { paymentPeriodEnd: { gte: periodStart } }
            ];
        }

        return await prisma.salaryAdvance.findMany({
            where,
            orderBy: {
                advanceDate: 'desc'
            }
        });
    }

    /**
     * Calculate total advances for a specific period
     */
    async getTotalAdvancesForPeriod(
        workerId: number,
        periodStart: Date,
        periodEnd: Date
    ): Promise<number> {
        const advances = await this.findByWorkerId(workerId, periodStart, periodEnd);
        return advances.reduce((sum, advance) => sum + Number(advance.amount), 0);
    }

    /**
     * Get available advance amount for a worker
     */
    async getAvailableAdvance(workerId: number): Promise<AvailableAdvanceInfo | null> {
        const worker = await prisma.worker.findUnique({
            where: { id: workerId }
        });

        if (!worker || !worker.baseSalary || worker.workerType !== 'direct') {
            return null;
        }

        const period = this.getCurrentPaymentPeriod(
            worker.paymentFrequency || 'monthly'
        );

        const totalAdvances = await this.getTotalAdvancesForPeriod(
            workerId,
            period.start,
            period.end
        );

        return {
            baseSalary: Number(worker.baseSalary),
            paymentFrequency: worker.paymentFrequency || 'monthly',
            totalAdvances,
            availableAmount: Number(worker.baseSalary) - totalAdvances,
            currentPeriodStart: period.start,
            currentPeriodEnd: period.end
        };
    }

    /**
     * Create a new salary advance with validation
     */
    async create(data: CreateSalaryAdvanceDto): Promise<SalaryAdvance> {
        // Validate worker type
        const worker = await prisma.worker.findUnique({
            where: { id: data.workerId }
        });

        if (!worker) {
            throw new Error('Worker not found');
        }

        if (worker.workerType !== 'direct') {
            throw new Error('Salary advances are only allowed for direct employees');
        }

        if (!worker.baseSalary) {
            throw new Error('Worker does not have a base salary defined');
        }

        // Check available advance amount
        const availableInfo = await this.getAvailableAdvance(data.workerId);

        if (!availableInfo) {
            throw new Error('Unable to calculate available advance');
        }

        if (data.amount > availableInfo.availableAmount) {
            throw new Error(
                `Advance amount ($${data.amount}) exceeds available amount ($${availableInfo.availableAmount})`
            );
        }

        return await prisma.salaryAdvance.create({
            data: {
                workerId: data.workerId,
                amount: data.amount,
                advanceDate: data.advanceDate,
                paymentPeriodStart: data.paymentPeriodStart,
                paymentPeriodEnd: data.paymentPeriodEnd,
                notes: data.notes
            }
        });
    }

    /**
     * Delete a salary advance
     */
    async delete(id: number): Promise<boolean> {
        try {
            await prisma.salaryAdvance.delete({
                where: { id }
            });
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Get current payment period based on frequency
     */
    private getCurrentPaymentPeriod(frequency: string): { start: Date; end: Date } {
        const now = new Date();
        const start = new Date();
        const end = new Date();

        switch (frequency) {
            case 'weekly':
                // Monday to Sunday
                const day = now.getDay();
                const diff = now.getDate() - day + (day === 0 ? -6 : 1);
                start.setDate(diff);
                end.setDate(diff + 6);
                break;

            case 'biweekly':
                // 1-15 and 16-end of month
                if (now.getDate() <= 15) {
                    start.setDate(1);
                    end.setDate(15);
                } else {
                    start.setDate(16);
                    end.setDate(new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate());
                }
                break;

            case 'monthly':
            default:
                // First to last day of month
                start.setDate(1);
                end.setDate(new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate());
                break;
        }

        // Reset time to start of day
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);

        return { start, end };
    }
}
