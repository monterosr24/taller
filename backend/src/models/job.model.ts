export enum JobStatus {
    PENDING = 'pending',
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
}

export interface Job {
    id?: number;
    vehicle_id: number;
    worker_id: number;
    description: string;
    total_amount: number;
    advance_amount?: number;
    status?: JobStatus;
    start_date?: Date;
    end_date?: Date;
    created_at?: Date;
    updated_at?: Date;
}

export interface CreateJobDto {
    vehicle_id: number;
    worker_id: number;
    description: string;
    total_amount: number;
    start_date?: Date;
    end_date?: Date;
}

export interface UpdateJobDto {
    vehicle_id?: number;
    worker_id?: number;
    description?: string;
    total_amount?: number;
    status?: JobStatus;
    start_date?: Date;
    end_date?: Date;
}
