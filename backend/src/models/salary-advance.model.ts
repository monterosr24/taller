export interface SalaryAdvance {
    id?: number;
    worker_id: number;
    amount: number;
    advance_date: Date;
    payment_period_start: Date;
    payment_period_end: Date;
    notes?: string;
    created_at?: Date;
}

export interface CreateSalaryAdvanceDto {
    workerId: number;
    amount: number;
    advanceDate: Date;
    paymentPeriodStart: Date;
    paymentPeriodEnd: Date;
    notes?: string;
}

export interface AvailableAdvanceInfo {
    baseSalary: number;
    paymentFrequency: string;
    totalAdvances: number;
    availableAmount: number;
    currentPeriodStart: Date;
    currentPeriodEnd: Date;
}
