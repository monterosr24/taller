export enum VacationStatus {
    REQUESTED = 'requested',
    APPROVED = 'approved',
    REJECTED = 'rejected',
    COMPLETED = 'completed',
}

export interface Vacation {
    id?: number;
    worker_id: number;
    start_date: Date;
    end_date: Date;
    total_days: number;
    status?: VacationStatus;
    notes?: string;
    created_at?: Date;
    updated_at?: Date;
}

export interface CreateVacationDto {
    worker_id: number;
    start_date: Date;
    end_date: Date;
    total_days: number;
    notes?: string;
}

export interface UpdateVacationDto {
    start_date?: Date;
    end_date?: Date;
    total_days?: number;
    status?: VacationStatus;
    notes?: string;
}
