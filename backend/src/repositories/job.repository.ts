import { getPool, sql } from '../config/database';
import { Job, CreateJobDto, UpdateJobDto } from '../models/job.model';
import { toSnakeCase, toCamelCase } from '../utils/case-converter';

export class JobRepository {
    async findAll(): Promise<Job[]> {
        const pool = await getPool();
        const result = await pool.request().query(`
      SELECT j.*, 
             w.first_name + ' ' + w.last_name as worker_name,
             v.license_plate, v.brand, v.model
      FROM Jobs j
      LEFT JOIN Workers w ON j.worker_id = w.id
      LEFT JOIN Vehicles v ON j.vehicle_id = v.id
      ORDER BY j.created_at DESC
    `);
        return result.recordset.map(job => toCamelCase(job));
    }

    async findById(id: number): Promise<Job | null> {
        const pool = await getPool();
        const result = await pool
            .request()
            .input('id', sql.Int, id)
            .query(`
        SELECT j.*, 
               w.first_name + ' ' + w.last_name as worker_name,
               v.license_plate, v.brand, v.model
        FROM Jobs j
        LEFT JOIN Workers w ON j.worker_id = w.id
        LEFT JOIN Vehicles v ON j.vehicle_id = v.id
        WHERE j.id = @id
      `);
        return result.recordset[0] ? toCamelCase(result.recordset[0]) : null;
    }

    async findByWorker(workerId: number): Promise<Job[]> {
        const pool = await getPool();
        const result = await pool
            .request()
            .input('worker_id', sql.Int, workerId)
            .query('SELECT * FROM Jobs WHERE worker_id = @worker_id ORDER BY created_at DESC');
        return result.recordset.map(job => toCamelCase(job));
    }

    async create(data: CreateJobDto): Promise<Job> {
        const pool = await getPool();
        const snakeData = toSnakeCase(data);

        const result = await pool
            .request()
            .input('vehicle_id', sql.Int, snakeData.vehicle_id)
            .input('worker_id', sql.Int, snakeData.worker_id)
            .input('description', sql.NVarChar(500), snakeData.description)
            .input('total_amount', sql.Decimal(18, 2), snakeData.total_amount)
            .input('start_date', sql.Date, snakeData.start_date)
            .input('end_date', sql.Date, snakeData.end_date)
            .query(`
        INSERT INTO Jobs (vehicle_id, worker_id, description, total_amount, start_date, end_date, status)
        OUTPUT INSERTED.*
        VALUES (@vehicle_id, @worker_id, @description, @total_amount, @start_date, @end_date, 'pending')
      `);
        return toCamelCase(result.recordset[0]);
    }

    async update(id: number, data: UpdateJobDto): Promise<Job | null> {
        const pool = await getPool();
        const snakeData = toSnakeCase(data);
        const fields: string[] = [];
        const request = pool.request().input('id', sql.Int, id);

        if (snakeData.vehicle_id !== undefined) {
            fields.push('vehicle_id = @vehicle_id');
            request.input('vehicle_id', sql.Int, snakeData.vehicle_id);
        }
        if (snakeData.worker_id !== undefined) {
            fields.push('worker_id = @worker_id');
            request.input('worker_id', sql.Int, snakeData.worker_id);
        }
        if (snakeData.description !== undefined) {
            fields.push('description = @description');
            request.input('description', sql.NVarChar(500), snakeData.description);
        }
        if (snakeData.total_amount !== undefined) {
            fields.push('total_amount = @total_amount');
            request.input('total_amount', sql.Decimal(18, 2), snakeData.total_amount);
        }
        if (snakeData.status !== undefined) {
            fields.push('status = @status');
            request.input('status', sql.NVarChar(20), snakeData.status);
        }
        if (snakeData.start_date !== undefined) {
            fields.push('start_date = @start_date');
            request.input('start_date', sql.Date, snakeData.start_date);
        }
        if (snakeData.end_date !== undefined) {
            fields.push('end_date = @end_date');
            request.input('end_date', sql.Date, snakeData.end_date);
        }

        if (fields.length === 0) {
            return this.findById(id);
        }

        fields.push('updated_at = GETDATE()');

        const result = await request.query(`
      UPDATE Jobs
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
            .query('DELETE FROM Jobs WHERE id = @id');
        return result.rowsAffected[0] > 0;
    }
}
