import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Advance } from '../models/models';

@Injectable({
    providedIn: 'root'
})
export class AdvanceService {
    private endpoint = 'advances';

    constructor(private api: ApiService) { }

    getAll(): Observable<Advance[]> {
        return this.api.get<Advance[]>(this.endpoint);
    }

    getById(id: number): Observable<Advance> {
        return this.api.get<Advance>(`${this.endpoint}/${id}`);
    }

    delete(id: number): Observable<void> {
        return this.api.delete<void>(`${this.endpoint}/${id}`);
    }
}
