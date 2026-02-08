export interface Supplier {
    id?: number;
    name: string;
    contact_name?: string;
    phone?: string;
    email?: string;
    address?: string;
    notes?: string;
    is_active?: boolean;
    created_at?: Date;
    updated_at?: Date;
}

export interface CreateSupplierDto {
    name: string;
    contact_name?: string;
    phone?: string;
    email?: string;
    address?: string;
    notes?: string;
}

export interface UpdateSupplierDto {
    name?: string;
    contact_name?: string;
    phone?: string;
    email?: string;
    address?: string;
    notes?: string;
    is_active?: boolean;
}
