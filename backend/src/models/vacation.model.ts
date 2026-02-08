export enum VacationStatus {
    REQUESTED = 'requested',
    APPROVED = 'approved',
    REJECTED = 'rejected',
    COMPLETED = 'completed',
}

export interface Vacation {
    id?: number;
    worker_id: number;
    total_days: number;
    status?: VacationStatus;
    type?: string;
    notes?: string;
    created_at?: Date;
    updated_at?: Date;
}

export interface CreateVacationDto {
    worker_id: number;
    total_days: number;
    status?: string;
    type?: string;
    notes?: string;
}

export interface UpdateVacationDto {
    total_days?: number;
    status?: VacationStatus;
    type?: string;
    notes?: string;
}
