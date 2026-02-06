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

export interface CreateVehicleDto {
    license_plate: string;
    brand?: string;
    model?: string;
    year?: number;
    owner_name?: string;
    owner_phone?: string;
}

export interface UpdateVehicleDto {
    license_plate?: string;
    brand?: string;
    model?: string;
    year?: number;
    owner_name?: string;
    owner_phone?: string;
}
