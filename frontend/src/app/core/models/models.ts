export interface Worker {
    id?: number;
    firstName: string;
    lastName: string;
    documentNumber?: string;
    phone?: string;
    email?: string;
    hireDate?: Date;
    baseSalary?: number;
    paymentFrequency?: 'weekly' | 'biweekly' | 'monthly';
    workerType?: 'contract' | 'direct';
    isActive?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface VacationBalance {
    workerId: number;
    hireDate: Date;
    monthsWorked: number;
    accruedDays: number;
    usedDays: number;
    pendingDays: number;
    availableDays: number;
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
    workerName?: string;
    totalDays: number;
    type?: string;
    notes?: string;
    status: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface Invoice {
    id?: number;
    invoiceNumber: string;
    supplierId: number;
    supplierName?: string; // For display purposes
    description?: string;
    totalAmount: number;
    paidAmount?: number;
    pendingAmount?: number;
    paymentStatus?: 'pending' | 'partial' | 'paid' | 'cancelled';
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

export interface Supplier {
    id?: number;
    name: string;
    contactName?: string;
    phone?: string;
    email?: string;
    address?: string;
    notes?: string;
    isActive?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface SalaryAdvance {
    id?: number;
    workerId: number;
    amount: number;
    advanceDate: Date;
    paymentPeriodStart: Date;
    paymentPeriodEnd: Date;
    notes?: string;
    createdAt?: Date;
}

export interface AvailableAdvanceInfo {
    baseSalary: number;
    paymentFrequency: string;
    totalAdvances: number;
    availableAmount: number;
    currentPeriodStart: Date;
    currentPeriodEnd: Date;
}
