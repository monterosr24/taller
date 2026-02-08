export enum PaymentStatus {
    PENDING = 'pending',
    PARTIAL = 'partial',
    PAID = 'paid',
}

export interface Invoice {
    id?: number;
    invoice_number: string;
    supplier_id: number;
    description?: string;
    total_amount: number;
    paid_amount?: number;
    pending_amount?: number;
    payment_status?: PaymentStatus;
    invoice_date: Date;
    due_date?: Date;
    created_at?: Date;
    updated_at?: Date;
}

export interface CreateInvoiceDto {
    invoice_number: string;
    supplier_id: number;
    description?: string;
    total_amount: number;
    invoice_date: Date;
    due_date?: Date;
}

export interface UpdateInvoiceDto {
    invoice_number?: string;
    supplier_id?: number;
    description?: string;
    total_amount?: number;
    invoice_date?: Date;
    due_date?: Date;
}
