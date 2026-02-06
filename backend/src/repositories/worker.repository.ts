import { getPool, sql } from '../config/database';
import { Worker, CreateWorkerDto, UpdateWorkerDto } from '../models/worker.model';
import { toSnakeCase, toCamelCase } from '../utils/case-converter';

export class WorkerRepository {
    async findAll(): Promise<Worker[]> {
        const pool = await getPool();
        const result = await pool.request().query('SELECT * FROM Workers WHERE is_active = 1');
        return result.recordset.map(worker => toCamelCase(worker));
    }

    async findById(id: number): Promise<Worker | null> {
        const pool = await getPool();
        const result = await pool
            .request()
            .input('id', sql.Int, id)
            .query('SELECT * FROM Workers WHERE id = @id');
        return result.recordset[0] ? toCamelCase(result.recordset[0]) : null;
    }

    async create(data: CreateWorkerDto): Promise<Worker> {
        const pool = await getPool();
        const snakeData = toSnakeCase(data);

        const result = await pool
            .request()
            .input('first_name', sql.NVarChar(100), snakeData.first_name)
            .input('last_name', sql.NVarChar(100), snakeData.last_name)
            .input('document_number', sql.NVarChar(50), snakeData.document_number)
            .input('phone', sql.NVarChar(20), snakeData.phone)
            .input('email', sql.NVarChar(100), snakeData.email)
            .input('hire_date', sql.Date, snakeData.hire_date)
            .input('base_salary', sql.Decimal(18, 2), snakeData.base_salary)
            .query(`
        INSERT INTO Workers (first_name, last_name, document_number, phone, email, hire_date, base_salary)
        OUTPUT INSERTED.*
        VALUES (@first_name, @last_name, @document_number, @phone, @email, @hire_date, @base_salary)
      `);
        return toCamelCase(result.recordset[0]);
    }

    async update(id: number, data: UpdateWorkerDto): Promise<Worker | null> {
        const pool = await getPool();
        const snakeData = toSnakeCase(data);
        const fields: string[] = [];
        const request = pool.request().input('id', sql.Int, id);

        if (snakeData.first_name !== undefined) {
            fields.push('first_name = @first_name');
            request.input('first_name', sql.NVarChar(100), snakeData.first_name);
        }
        if (snakeData.last_name !== undefined) {
            fields.push('last_name = @last_name');
            request.input('last_name', sql.NVarChar(100), snakeData.last_name);
        }
        if (snakeData.document_number !== undefined) {
            fields.push('document_number = @document_number');
            request.input('document_number', sql.NVarChar(50), snakeData.document_number);
        }
        if (snakeData.phone !== undefined) {
            fields.push('phone = @phone');
            request.input('phone', sql.NVarChar(20), snakeData.phone);
        }
        if (snakeData.email !== undefined) {
            fields.push('email = @email');
            request.input('email', sql.NVarChar(100), snakeData.email);
        }
        if (snakeData.hire_date !== undefined) {
            fields.push('hire_date = @hire_date');
            request.input('hire_date', sql.Date, snakeData.hire_date);
        }
        if (snakeData.base_salary !== undefined) {
            fields.push('base_salary = @base_salary');
            request.input('base_salary', sql.Decimal(18, 2), snakeData.base_salary);
        }
        if (snakeData.is_active !== undefined) {
            fields.push('is_active = @is_active');
            request.input('is_active', sql.Bit, snakeData.is_active);
        }

        if (fields.length === 0) {
            return this.findById(id);
        }

        fields.push('updated_at = GETDATE()');

        const result = await request.query(`
      UPDATE Workers
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
            .query('UPDATE Workers SET is_active = 0 WHERE id = @id');
        return result.rowsAffected[0] > 0;
    }
}
