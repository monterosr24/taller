import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Vacation } from '../models/models';

@Injectable({
    providedIn: 'root'
})
export class VacationService {
    private endpoint = 'vacations';

    constructor(private api: ApiService) { }

    getAll(): Observable<Vacation[]> {
        return this.api.get<Vacation[]>(this.endpoint);
    }

    getById(id: number): Observable<Vacation> {
        return this.api.get<Vacation>(`${this.endpoint}/${id}`);
    }

    create(vacation: Vacation): Observable<Vacation> {
        return this.api.post<Vacation>(this.endpoint, vacation);
    }

    update(id: number, vacation: Partial<Vacation>): Observable<Vacation> {
        return this.api.put<Vacation>(`${this.endpoint}/${id}`, vacation);
    }

    delete(id: number): Observable<void> {
        return this.api.delete<void>(`${this.endpoint}/${id}`);
    }
}
