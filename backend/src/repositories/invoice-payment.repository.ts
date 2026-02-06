import { getPool, sql } from '../config/database';
import { InvoicePayment, CreateInvoicePaymentDto } from '../models/invoice-payment.model';

export class InvoicePaymentRepository {
    async findAll(): Promise<InvoicePayment[]> {
        const pool = await getPool();
        const result = await pool.request().query('SELECT * FROM Invoice_Payments ORDER BY payment_date DESC');
        return result.recordset;
    }

    async findById(id: number): Promise<InvoicePayment | null> {
        const pool = await getPool();
        const result = await pool
            .request()
            .input('id', sql.Int, id)
            .query('SELECT * FROM Invoice_Payments WHERE id = @id');
        return result.recordset[0] || null;
    }

    async findByInvoice(invoiceId: number): Promise<InvoicePayment[]> {
        const pool = await getPool();
        const result = await pool
            .request()
            .input('invoice_id', sql.Int, invoiceId)
            .query('SELECT * FROM Invoice_Payments WHERE invoice_id = @invoice_id ORDER BY payment_date DESC');
        return result.recordset;
    }

    async create(data: CreateInvoicePaymentDto): Promise<InvoicePayment> {
        const pool = await getPool();
        const transaction = pool.transaction();

        try {
            await transaction.begin();

            // Insert payment
            const paymentResult = await transaction
                .request()
                .input('invoice_id', sql.Int, data.invoice_id)
                .input('payment_amount', sql.Decimal(18, 2), data.payment_amount)
                .input('payment_date', sql.Date, data.payment_date)
                .input('payment_method', sql.NVarChar(50), data.payment_method)
                .input('reference', sql.NVarChar(100), data.reference)
                .input('notes', sql.NVarChar(200), data.notes)
                .query(`
          INSERT INTO Invoice_Payments (invoice_id, payment_amount, payment_date, payment_method, reference, notes)
          OUTPUT INSERTED.*
          VALUES (@invoice_id, @payment_amount, @payment_date, @payment_method, @reference, @notes)
        `);

            const payment = paymentResult.recordset[0];

            // Update invoice's paid_amount
            await transaction
                .request()
                .input('invoice_id', sql.Int, data.invoice_id)
                .input('payment_amount', sql.Decimal(18, 2), data.payment_amount)
                .query(`
          UPDATE Invoices
          SET paid_amount = ISNULL(paid_amount, 0) + @payment_amount,
              updated_at = GETDATE()
          WHERE id = @invoice_id
        `);

            // Update payment status
            await transaction
                .request()
                .input('invoice_id', sql.Int, data.invoice_id)
                .query(`
          UPDATE Invoices
          SET payment_status = CASE
            WHEN ISNULL(paid_amount, 0) = 0 THEN 'pending'
            WHEN ISNULL(paid_amount, 0) >= total_amount THEN 'paid'
            ELSE 'partial'
          END,
          updated_at = GETDATE()
          WHERE id = @invoice_id
        `);

            await transaction.commit();
            return payment;
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

            // Get payment details
            const paymentResult = await transaction
                .request()
                .input('id', sql.Int, id)
                .query('SELECT * FROM Invoice_Payments WHERE id = @id');

            if (paymentResult.recordset.length === 0) {
                await transaction.rollback();
                return false;
            }

            const payment = paymentResult.recordset[0];

            // Delete payment
            await transaction
                .request()
                .input('id', sql.Int, id)
                .query('DELETE FROM Invoice_Payments WHERE id = @id');

            // Update invoice's paid_amount
            await transaction
                .request()
                .input('invoice_id', sql.Int, payment.invoice_id)
                .input('payment_amount', sql.Decimal(18, 2), payment.payment_amount)
                .query(`
          UPDATE Invoices
          SET paid_amount = ISNULL(paid_amount, 0) - @payment_amount,
              updated_at = GETDATE()
          WHERE id = @invoice_id
        `);

            // Update payment status
            await transaction
                .request()
                .input('invoice_id', sql.Int, payment.invoice_id)
                .query(`
          UPDATE Invoices
          SET payment_status = CASE
            WHEN ISNULL(paid_amount, 0) = 0 THEN 'pending'
            WHEN ISNULL(paid_amount, 0) >= total_amount THEN 'paid'
            ELSE 'partial'
          END,
          updated_at = GETDATE()
          WHERE id = @invoice_id
        `);

            await transaction.commit();
            return true;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
}
