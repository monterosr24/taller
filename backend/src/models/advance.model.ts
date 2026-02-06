export interface Advance {
    id?: number;
    job_id: number;
    amount: number;
    description?: string;
    advance_date: Date;
    created_at?: Date;
}

export interface CreateAdvanceDto {
    job_id: number;
    amount: number;
    description?: string;
    advance_date: Date;
}
