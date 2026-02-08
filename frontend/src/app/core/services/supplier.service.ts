import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Supplier } from '../models/models';

@Injectable({
    providedIn: 'root'
})
export class SupplierService {
    private endpoint = 'suppliers';

    constructor(private api: ApiService) { }

    getAll(): Observable<Supplier[]> {
        return this.api.get<Supplier[]>(this.endpoint);
    }

    getById(id: number): Observable<Supplier> {
        return this.api.get<Supplier>(`${this.endpoint}/${id}`);
    }

    create(supplier: Supplier): Observable<Supplier> {
        return this.api.post<Supplier>(this.endpoint, supplier);
    }

    update(id: number, supplier: Partial<Supplier>): Observable<Supplier> {
        return this.api.put<Supplier>(`${this.endpoint}/${id}`, supplier);
    }

    delete(id: number): Observable<void> {
        return this.api.delete<void>(`${this.endpoint}/${id}`);
    }
}
