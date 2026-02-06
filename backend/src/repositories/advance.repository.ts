import { getPool, sql } from '../config/database';
import { Advance, CreateAdvanceDto } from '../models/advance.model';
import { toSnakeCase, toCamelCase } from '../utils/case-converter';

export class AdvanceRepository {
    async findAll(): Promise<Advance[]> {
        const pool = await getPool();
        const result = await pool.request().query('SELECT * FROM Advances ORDER BY advance_date DESC');
        return result.recordset.map(advance => toCamelCase(advance));
    }

    async findById(id: number): Promise<Advance | null> {
        const pool = await getPool();
        const result = await pool
            .request()
            .input('id', sql.Int, id)
            .query('SELECT * FROM Advances WHERE id = @id');
        return result.recordset[0] ? toCamelCase(result.recordset[0]) : null;
    }

    async findByJob(jobId: number): Promise<Advance[]> {
        const pool = await getPool();
        const result = await pool
            .request()
            .input('job_id', sql.Int, jobId)
            .query('SELECT * FROM Advances WHERE job_id = @job_id ORDER BY advance_date DESC');
        return result.recordset.map(advance => toCamelCase(advance));
    }

    async create(data: CreateAdvanceDto): Promise<Advance> {
        const pool = await getPool();
        const transaction = pool.transaction();
        const snakeData = toSnakeCase(data);

        try {
            await transaction.begin();

            // Insert advance
            const advanceResult = await transaction
                .request()
                .input('job_id', sql.Int, snakeData.job_id)
                .input('amount', sql.Decimal(18, 2), snakeData.amount)
                .input('description', sql.NVarChar(200), snakeData.description)
                .input('advance_date', sql.Date, snakeData.advance_date)
                .query(`
          INSERT INTO Advances (job_id, amount, description, advance_date)
          OUTPUT INSERTED.*
          VALUES (@job_id, @amount, @description, @advance_date)
        `);

            const advance = advanceResult.recordset[0];

            // Update job's advance_amount
            await transaction
                .request()
                .input('job_id', sql.Int, snakeData.job_id)
                .input('amount', sql.Decimal(18, 2), snakeData.amount)
                .query(`
          UPDATE Jobs
          SET advance_amount = ISNULL(advance_amount, 0) + @amount,
              updated_at = GETDATE()
          WHERE id = @job_id
        `);

            await transaction.commit();
            return toCamelCase(advance);
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async delete(id: number): Promise<boolean> {
        const pool = await getPool();
        const transaction = pool.transaction();

        try {
            await transaction.begin();

            // Get advance details
            const advanceResult = await transaction
                .request()
                .input('id', sql.Int, id)
                .query('SELECT * FROM Advances WHERE id = @id');

            if (advanceResult.recordset.length === 0) {
                await transaction.rollback();
                return false;
            }

            const advance = advanceResult.recordset[0];

            // Delete advance
            await transaction
                .request()
                .input('id', sql.Int, id)
                .query('DELETE FROM Advances WHERE id = @id');

            // Update job's advance_amount
            await transaction
                .request()
                .input('job_id', sql.Int, advance.job_id)
                .input('amount', sql.Decimal(18, 2), advance.amount)
                .query(`
          UPDATE Jobs
          SET advance_amount = ISNULL(advance_amount, 0) - @amount,
              updated_at = GETDATE()
          WHERE id = @job_id
        `);

            await transaction.commit();
            return true;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
}
