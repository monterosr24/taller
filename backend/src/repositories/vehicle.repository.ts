import { getPool, sql } from '../config/database';
import { Vehicle, CreateVehicleDto, UpdateVehicleDto } from '../models/vehicle.model';
import { toSnakeCase, toCamelCase } from '../utils/case-converter';

export class VehicleRepository {
    async findAll(): Promise<Vehicle[]> {
        const pool = await getPool();
        const result = await pool.request().query('SELECT * FROM Vehicles ORDER BY created_at DESC');
        return result.recordset.map(vehicle => toCamelCase(vehicle));
    }

    async findById(id: number): Promise<Vehicle | null> {
        const pool = await getPool();
        const result = await pool
            .request()
            .input('id', sql.Int, id)
            .query('SELECT * FROM Vehicles WHERE id = @id');
        return result.recordset[0] ? toCamelCase(result.recordset[0]) : null;
    }

    async findByLicensePlate(licensePlate: string): Promise<Vehicle | null> {
        const pool = await getPool();
        const result = await pool
            .request()
            .input('license_plate', sql.NVarChar(20), licensePlate)
            .query('SELECT * FROM Vehicles WHERE license_plate = @license_plate');
        return result.recordset[0] ? toCamelCase(result.recordset[0]) : null;
    }

    async create(data: CreateVehicleDto): Promise<Vehicle> {
        const pool = await getPool();
        const snakeData = toSnakeCase(data);

        const result = await pool
            .request()
            .input('license_plate', sql.NVarChar(20), snakeData.license_plate)
            .input('brand', sql.NVarChar(50), snakeData.brand)
            .input('model', sql.NVarChar(50), snakeData.model)
            .input('year', sql.Int, snakeData.year)
            .input('owner_name', sql.NVarChar(200), snakeData.owner_name)
            .input('owner_phone', sql.NVarChar(20), snakeData.owner_phone)
            .query(`
        INSERT INTO Vehicles (license_plate, brand, model, year, owner_name, owner_phone)
        OUTPUT INSERTED.*
        VALUES (@license_plate, @brand, @model, @year, @owner_name, @owner_phone)
      `);
        return toCamelCase(result.recordset[0]);
    }

    async update(id: number, data: UpdateVehicleDto): Promise<Vehicle | null> {
        const pool = await getPool();
        const snakeData = toSnakeCase(data);
        const fields: string[] = [];
        const request = pool.request().input('id', sql.Int, id);

        if (snakeData.license_plate !== undefined) {
            fields.push('license_plate = @license_plate');
            request.input('license_plate', sql.NVarChar(20), snakeData.license_plate);
        }
        if (snakeData.brand !== undefined) {
            fields.push('brand = @brand');
            request.input('brand', sql.NVarChar(50), snakeData.brand);
        }
        if (snakeData.model !== undefined) {
            fields.push('model = @model');
            request.input('model', sql.NVarChar(50), snakeData.model);
        }
        if (snakeData.year !== undefined) {
            fields.push('year = @year');
            request.input('year', sql.Int, snakeData.year);
        }
        if (snakeData.owner_name !== undefined) {
            fields.push('owner_name = @owner_name');
            request.input('owner_name', sql.NVarChar(200), snakeData.owner_name);
        }
        if (snakeData.owner_phone !== undefined) {
            fields.push('owner_phone = @owner_phone');
            request.input('owner_phone', sql.NVarChar(20), snakeData.owner_phone);
        }

        if (fields.length === 0) {
            return this.findById(id);
        }

        const result = await request.query(`
      UPDATE Vehicles
      SET ${fields.join(', ')}
      OUTPUT INSERTED.*
      WHERE id = @id
    `);
        return result.recordset[0] ? toCamelCase(result.recordset[0]) : null;
    }

    async delete(id: number): Promise<boolean> {
        const pool = await getPool();
        const result = await pool
            .request()
            .input('id', sql.Int, id)
            .query('DELETE FROM Vehicles WHERE id = @id');
        return result.rowsAffected[0] > 0;
    }
}
