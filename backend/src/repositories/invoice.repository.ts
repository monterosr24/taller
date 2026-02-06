import { getPool, sql } from '../config/database';
import { Invoice, CreateInvoiceDto, UpdateInvoiceDto } from '../models/invoice.model';

export class InvoiceRepository {
    async findAll(): Promise<Invoice[]> {
        const pool = await getPool();
        const result = await pool.request().query(`
      SELECT *,
             (total_amount - ISNULL(paid_amount, 0)) as pending_amount
      FROM Invoices
      ORDER BY invoice_date DESC
    `);
        return result.recordset;
    }

    async findById(id: number): Promise<Invoice | null> {
        const pool = await getPool();
        const result = await pool
            .request()
            .input('id', sql.Int, id)
            .query(`
        SELECT *,
               (total_amount - ISNULL(paid_amount, 0)) as pending_amount
        FROM Invoices
        WHERE id = @id
      `);
        return result.recordset[0] || null;
    }

    async findByInvoiceNumber(invoiceNumber: string): Promise<Invoice | null> {
        const pool = await getPool();
        const result = await pool
            .request()
            .input('invoice_number', sql.NVarChar(50), invoiceNumber)
            .query('SELECT * FROM Invoices WHERE invoice_number = @invoice_number');
        return result.recordset[0] || null;
    }

    async create(data: CreateInvoiceDto): Promise<Invoice> {
        const pool = await getPool();
        const result = await pool
            .request()
            .input('invoice_number', sql.NVarChar(50), data.invoice_number)
            .input('supplier', sql.NVarChar(200), data.supplier)
            .input('description', sql.NVarChar(500), data.description)
            .input('total_amount', sql.Decimal(18, 2), data.total_amount)
            .input('invoice_date', sql.Date, data.invoice_date)
            .input('due_date', sql.Date, data.due_date)
            .query(`
        INSERT INTO Invoices (invoice_number, supplier, description, total_amount, invoice_date, due_date, payment_status)
        OUTPUT INSERTED.*
        VALUES (@invoice_number, @supplier, @description, @total_amount, @invoice_date, @due_date, 'pending')
      `);
        return result.recordset[0];
    }

    async update(id: number, data: UpdateInvoiceDto): Promise<Invoice | null> {
        const pool = await getPool();
        const fields: string[] = [];
        const request = pool.request().input('id', sql.Int, id);

        if (data.invoice_number !== undefined) {
            fields.push('invoice_number = @invoice_number');
            request.input('invoice_number', sql.NVarChar(50), data.invoice_number);
        }
        if (data.supplier !== undefined) {
            fields.push('supplier = @supplier');
            request.input('supplier', sql.NVarChar(200), data.supplier);
        }
        if (data.description !== undefined) {
            fields.push('description = @description');
            request.input('description', sql.NVarChar(500), data.description);
        }
        if (data.total_amount !== undefined) {
            fields.push('total_amount = @total_amount');
            request.input('total_amount', sql.Decimal(18, 2), data.total_amount);
        }
        if (data.invoice_date !== undefined) {
            fields.push('invoice_date = @invoice_date');
            request.input('invoice_date', sql.Date, data.invoice_date);
        }
        if (data.due_date !== undefined) {
            fields.push('due_date = @due_date');
            request.input('due_date', sql.Date, data.due_date);
        }

        if (fields.length === 0) {
            return this.findById(id);
        }

        fields.push('updated_at = GETDATE()');

        const result = await request.query(`
      UPDATE Invoices
      SET ${fields.join(', ')}
      OUTPUT INSERTED.*
      WHERE id = @id
    `);
        return result.recordset[0] || null;
    }

    async updatePaymentStatus(id: number): Promise<void> {
        const pool = await getPool();
        await pool
            .request()
            .input('id', sql.Int, id)
            .query(`
        UPDATE Invoices
        SET payment_status = CASE
          WHEN ISNULL(paid_amount, 0) = 0 THEN 'pending'
          WHEN ISNULL(paid_amount, 0) >= total_amount THEN 'paid'
          ELSE 'partial'
        END,
        updated_at = GETDATE()
        WHERE id = @id
      `);
    }

    async delete(id: number): Promise<boolean> {
        const pool = await getPool();
        const result = await pool
            .request()
            .input('id', sql.Int, id)
            .query('DELETE FROM Invoices WHERE id = @id');
        return result.rowsAffected[0] > 0;
    }
}
