import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Invoice, InvoicePayment } from '../models/models';

@Injectable({
    providedIn: 'root'
})
export class InvoiceService {
    private endpoint = 'invoices';

    constructor(private api: ApiService) { }

    getAll(): Observable<Invoice[]> {
        return this.api.get<Invoice[]>(this.endpoint);
    }

    getById(id: number): Observable<Invoice> {
        return this.api.get<Invoice>(`${this.endpoint}/${id}`);
    }

    create(invoice: Invoice): Observable<Invoice> {
        return this.api.post<Invoice>(this.endpoint, invoice);
    }

    update(id: number, invoice: Partial<Invoice>): Observable<Invoice> {
        return this.api.put<Invoice>(`${this.endpoint}/${id}`, invoice);
    }

    delete(id: number): Observable<void> {
        return this.api.delete<void>(`${this.endpoint}/${id}`);
    }

    getPayments(invoiceId: number): Observable<InvoicePayment[]> {
        return this.api.get<InvoicePayment[]>(`${this.endpoint}/${invoiceId}/payments`);
    }

    addPayment(invoiceId: number, payment: InvoicePayment): Observable<InvoicePayment> {
        return this.api.post<InvoicePayment>(`${this.endpoint}/${invoiceId}/payments`, payment);
    }
}
