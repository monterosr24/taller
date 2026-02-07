export interface Worker {
    id?: number;
    firstName: string;
    lastName: string;
    documentNumber?: string;
    phone?: string;
    email?: string;
    hireDate?: Date;
    baseSalary?: number;
    isActive?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface Vehicle {
    id?: number;
    licensePlate: string;
    brand?: string;
    model?: string;
    year?: number;
    ownerName?: string;
    ownerPhone?: string;
    createdAt?: Date;
}

export interface Job {
    id?: number;
    vehicleId: number;
    workerId: number;
    description: string;
    totalAmount: number;
    advanceAmount?: number;
    status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
    startDate?: Date;
    endDate?: Date;
    createdAt?: Date;
    updatedAt?: Date;
    workerName?: string;
    licensePlate?: string;
    brand?: string;
    model?: string;
}

export interface Advance {
    id?: number;
    jobId: number;
    amount: number;
    description?: string;
    advanceDate: Date;
    createdAt?: Date;
}

export interface Vacation {
    id?: number;
    workerId: number;
    startDate: Date;
    endDate: Date;
    totalDays: number;
    status?: 'requested' | 'approved' | 'rejected' | 'completed';
    notes?: string;
    createdAt?: Date;
    updatedAt?: Date;
    workerName?: string;
}

export interface Invoice {
    id?: number;
    invoiceNumber: string;
    supplier: string;
    description?: string;
    totalAmount: number;
    paidAmount?: number;
    pendingAmount?: number;
    paymentStatus?: 'pending' | 'partial' | 'paid';
    invoiceDate: Date;
    dueDate?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface InvoicePayment {
    id?: number;
    invoiceId: number;
    paymentAmount: number;
    paymentDate: Date;
    paymentMethod?: string;
    reference?: string;
    notes?: string;
    createdAt?: Date;
}
