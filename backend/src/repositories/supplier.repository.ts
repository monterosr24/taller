import prisma from '../config/prisma';
import { Supplier } from '@prisma/client';

export interface CreateSupplierDto {
    name: string;
    contactName?: string;
    phone?: string;
    email?: string;
    address?: string;
    notes?: string;
}

export interface UpdateSupplierDto {
    name?: string;
    contactName?: string;
    phone?: string;
    email?: string;
    address?: string;
    notes?: string;
    isActive?: boolean;
}

export class SupplierRepository {
    async findAll(): Promise<Supplier[]> {
        return await prisma.supplier.findMany({
            where: {
                isActive: true
            },
            orderBy: {
                name: 'asc'
            }
        });
    }

    async findById(id: number): Promise<Supplier | null> {
        return await prisma.supplier.findUnique({
            where: { id }
        });
    }

    async create(data: CreateSupplierDto): Promise<Supplier> {
        return await prisma.supplier.create({
            data: {
                ...data,
                isActive: true
            }
        });
    }

    async update(id: number, data: UpdateSupplierDto): Promise<Supplier | null> {
        return await prisma.supplier.update({
            where: { id },
            data
        });
    }

    async delete(id: number): Promise<boolean> {
        const supplier = await prisma.supplier.update({
            where: { id },
            data: { isActive: false }
        });
        return !!supplier;
    }
}
