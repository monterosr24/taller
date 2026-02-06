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

export interface CreateInvoicePaymentDto {
    invoice_id: number;
    payment_amount: number;
    payment_date: Date;
    payment_method?: string;
    reference?: string;
    notes?: string;
}
