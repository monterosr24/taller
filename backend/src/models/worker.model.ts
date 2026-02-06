export interface Worker {
    id?: number;
    first_name: string;
    last_name: string;
    document_number?: string;
    phone?: string;
    email?: string;
    hire_date?: Date;
    base_salary?: number;
    is_active?: boolean;
    created_at?: Date;
    updated_at?: Date;
}

export interface CreateWorkerDto {
    first_name: string;
    last_name: string;
    document_number?: string;
    phone?: string;
    email?: string;
    hire_date?: Date;
    base_salary?: number;
}

export interface UpdateWorkerDto {
    first_name?: string;
    last_name?: string;
    document_number?: string;
    phone?: string;
    email?: string;
    hire_date?: Date;
    base_salary?: number;
    is_active?: boolean;
}
