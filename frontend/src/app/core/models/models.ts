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

export interface Vehicle {
    id?: number;
    license_plate: string;
    brand?: string;
    model?: string;
    year?: number;
    owner_name?: string;
    owner_phone?: string;
    created_at?: Date;
}

export interface Job {
    id?: number;
    vehicle_id: number;
    worker_id: number;
    description: string;
    total_amount: number;
    advance_amount?: number;
    status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
    start_date?: Date;
    end_date?: Date;
    created_at?: Date;
    updated_at?: Date;
    worker_name?: string;
    license_plate?: string;
    brand?: string;
    model?: string;
}

export interface Advance {
    id?: number;
    job_id: number;
    amount: number;
    description?: string;
    advance_date: Date;
    created_at?: Date;
}

export interface Vacation {
    id?: number;
    worker_id: number;
    start_date: Date;
    end_date: Date;
    total_days: number;
    status?: 'requested' | 'approved' | 'rejected' | 'completed';
    notes?: string;
    created_at?: Date;
    updated_at?: Date;
    worker_name?: string;
}

export interface Invoice {
    id?: number;
    invoice_number: string;
    supplier: string;
    description?: string;
    total_amount: number;
    paid_amount?: number;
    pending_amount?: number;
    payment_status?: 'pending' | 'partial' | 'paid';
    invoice_date: Date;
    due_date?: Date;
    created_at?: Date;
    updated_at?: Date;
}

export interface InvoicePayment {
    id?: number;
    invoice_id: number;
    payment_amount: number;
    payment_date: Date;
    payment_method?: string;
    reference?: string;
    notes?: string;
    created_at?: Date;
}
