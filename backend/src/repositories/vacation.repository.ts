import { getPool, sql } from '../config/database';
import { Vacation, CreateVacationDto, UpdateVacationDto } from '../models/vacation.model';

export class VacationRepository {
    async findAll(): Promise<Vacation[]> {
        const pool = await getPool();
        const result = await pool.request().query(`
      SELECT v.*, w.first_name + ' ' + w.last_name as worker_name
      FROM Vacations v
      LEFT JOIN Workers w ON v.worker_id = w.id
      ORDER BY v.created_at DESC
    `);
        return result.recordset;
    }

    async findById(id: number): Promise<Vacation | null> {
        const pool = await getPool();
        const result = await pool
            .request()
            .input('id', sql.Int, id)
            .query(`
        SELECT v.*, w.first_name + ' ' + w.last_name as worker_name
        FROM Vacations v
        LEFT JOIN Workers w ON v.worker_id = w.id
        WHERE v.id = @id
      `);
        return result.recordset[0] || null;
    }

    async findByWorker(workerId: number): Promise<Vacation[]> {
        const pool = await getPool();
        const result = await pool
            .request()
            .input('worker_id', sql.Int, workerId)
            .query('SELECT * FROM Vacations WHERE worker_id = @worker_id ORDER BY start_date DESC');
        return result.recordset;
    }

    async create(data: CreateVacationDto): Promise<Vacation> {
        const pool = await getPool();
        const result = await pool
            .request()
            .input('worker_id', sql.Int, data.worker_id)
            .input('start_date', sql.Date, data.start_date)
            .input('end_date', sql.Date, data.end_date)
            .input('total_days', sql.Int, data.total_days)
            .input('notes', sql.NVarChar(500), data.notes)
            .query(`
        INSERT INTO Vacations (worker_id, start_date, end_date, total_days, notes, status)
        OUTPUT INSERTED.*
        VALUES (@worker_id, @start_date, @end_date, @total_days, @notes, 'requested')
      `);
        return result.recordset[0];
    }

    async update(id: number, data: UpdateVacationDto): Promise<Vacation | null> {
        const pool = await getPool();
        const fields: string[] = [];
        const request = pool.request().input('id', sql.Int, id);

        if (data.start_date !== undefined) {
            fields.push('start_date = @start_date');
            request.input('start_date', sql.Date, data.start_date);
        }
        if (data.end_date !== undefined) {
            fields.push('end_date = @end_date');
            request.input('end_date', sql.Date, data.end_date);
        }
        if (data.total_days !== undefined) {
            fields.push('total_days = @total_days');
            request.input('total_days', sql.Int, data.total_days);
        }
        if (data.status !== undefined) {
            fields.push('status = @status');
            request.input('status', sql.NVarChar(20), data.status);
        }
        if (data.notes !== undefined) {
            fields.push('notes = @notes');
            request.input('notes', sql.NVarChar(500), data.notes);
        }

        if (fields.length === 0) {
            return this.findById(id);
        }

        fields.push('updated_at = GETDATE()');

        const result = await request.query(`
      UPDATE Vacations
      SET ${fields.join(', ')}
      OUTPUT INSERTED.*
      WHERE id = @id
    `);
        return result.recordset[0] || null;
    }

    async delete(id: number): Promise<boolean> {
        const pool = await getPool();
        const result = await pool
            .request()
            .input('id', sql.Int, id)
            .query('DELETE FROM Vacations WHERE id = @id');
        return result.rowsAffected[0] > 0;
    }
}
