import prisma from '../config/prisma';
import { Vehicle } from '@prisma/client';

export interface CreateVehicleDto {
    licensePlate: string;
    brand?: string;
    model?: string;
    year?: number;
    ownerName?: string;
    ownerPhone?: string;
}

export interface UpdateVehicleDto {
    licensePlate?: string;
    brand?: string;
    model?: string;
    year?: number;
    ownerName?: string;
    ownerPhone?: string;
}

export class VehicleRepository {
    async findAll(): Promise<Vehicle[]> {
        return await prisma.vehicle.findMany({
            include: {
                jobs: {
                    include: {
                        worker: true
                    },
                    orderBy: {
                        createdAt: 'desc'
                    },
                    take: 5
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    }

    async findById(id: number): Promise<Vehicle | null> {
        return await prisma.vehicle.findUnique({
            where: { id },
            include: {
                jobs: {
                    include: {
                        worker: true,
                        advances: true
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                }
            }
        });
    }

    async findByLicensePlate(licensePlate: string): Promise<Vehicle | null> {
        return await prisma.vehicle.findUnique({
            where: { licensePlate },
            include: {
                jobs: true
            }
        });
    }

    async create(data: CreateVehicleDto): Promise<Vehicle> {
        return await prisma.vehicle.create({
            data
        });
    }

    async update(id: number, data: UpdateVehicleDto): Promise<Vehicle | null> {
        return await prisma.vehicle.update({
            where: { id },
            data
        });
    }

    async delete(id: number): Promise<boolean> {
        try {
            await prisma.vehicle.delete({
                where: { id }
            });
            return true;
        } catch {
            return false;
        }
    }
}
