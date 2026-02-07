/**
 * Vacation Balance Service
 * Calculates vacation days accrued and used for workers
 * Rule: 1 vacation day per month worked
 */

export interface VacationBalance {
    workerId: number;
    hireDate: Date;
    monthsWorked: number;
    accruedDays: number;
    usedDays: number;
    pendingDays: number;
    availableDays: number;
}

export class VacationBalanceService {
    /**
     * Calculates complete months worked since hire date
     */
    calculateMonthsWorked(hireDate: Date): number {
        const now = new Date();
        const hire = new Date(hireDate);

        const yearsDiff = now.getFullYear() - hire.getFullYear();
        const monthsDiff = now.getMonth() - hire.getMonth();
        const daysDiff = now.getDate() - hire.getDate();

        let totalMonths = (yearsDiff * 12) + monthsDiff;

        // Only count complete months
        if (daysDiff < 0) {
            totalMonths--;
        }

        return Math.max(0, totalMonths);
    }

    /**
     * Calculates total vacation days accrued
     * Rule: 1 day per month
     */
    calculateAccruedDays(monthsWorked: number): number {
        return monthsWorked;
    }

    /**
     * Calculates vacation days used from approved vacations
     */
    calculateUsedDays(approvedVacations: Array<{ totalDays: number }>): number {
        return approvedVacations.reduce((total, vacation) => total + vacation.totalDays, 0);
    }

    /**
     * Calculates vacation days pending approval
     */
    calculatePendingDays(requestedVacations: Array<{ totalDays: number }>): number {
        return requestedVacations.reduce((total, vacation) => total + vacation.totalDays, 0);
    }

    /**
     * Gets complete vacation balance for a worker
     */
    async getVacationBalance(
        workerId: number,
        hireDate: Date,
        approvedVacations: Array<{ totalDays: number }>,
        requestedVacations: Array<{ totalDays: number }>
    ): Promise<VacationBalance> {
        const monthsWorked = this.calculateMonthsWorked(hireDate);
        const accruedDays = this.calculateAccruedDays(monthsWorked);
        const usedDays = this.calculateUsedDays(approvedVacations);
        const pendingDays = this.calculatePendingDays(requestedVacations);
        const availableDays = accruedDays - usedDays - pendingDays;

        return {
            workerId,
            hireDate,
            monthsWorked,
            accruedDays,
            usedDays,
            pendingDays,
            availableDays
        };
    }

    /**
     * Validates if worker has enough vacation balance
     */
    canRequestVacation(availableDays: number, requestedDays: number): boolean {
        return requestedDays <= availableDays;
    }
}

export const vacationBalanceService = new VacationBalanceService();
