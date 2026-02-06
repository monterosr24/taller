import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Worker } from '../models/models';

@Injectable({
    providedIn: 'root'
})
export class WorkerService {
    private endpoint = 'workers';

    constructor(private api: ApiService) { }

    getAll(): Observable<Worker[]> {
        return this.api.get<Worker[]>(this.endpoint);
    }

    getById(id: number): Observable<Worker> {
        return this.api.get<Worker>(`${this.endpoint}/${id}`);
    }

    create(worker: Worker): Observable<Worker> {
        return this.api.post<Worker>(this.endpoint, worker);
    }

    update(id: number, worker: Partial<Worker>): Observable<Worker> {
        return this.api.put<Worker>(`${this.endpoint}/${id}`, worker);
    }

    delete(id: number): Observable<void> {
        return this.api.delete<void>(`${this.endpoint}/${id}`);
    }
}
