import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Job, Advance } from '../models/models';

@Injectable({
    providedIn: 'root'
})
export class JobService {
    private endpoint = 'jobs';

    constructor(private api: ApiService) { }

    getAll(): Observable<Job[]> {
        return this.api.get<Job[]>(this.endpoint);
    }

    getById(id: number): Observable<Job> {
        return this.api.get<Job>(`${this.endpoint}/${id}`);
    }

    create(job: Job): Observable<Job> {
        return this.api.post<Job>(this.endpoint, job);
    }

    update(id: number, job: Partial<Job>): Observable<Job> {
        return this.api.put<Job>(`${this.endpoint}/${id}`, job);
    }

    delete(id: number): Observable<void> {
        return this.api.delete<void>(`${this.endpoint}/${id}`);
    }

    getAdvances(jobId: number): Observable<Advance[]> {
        return this.api.get<Advance[]>(`${this.endpoint}/${jobId}/advances`);
    }

    addAdvance(jobId: number, advance: Advance): Observable<Advance> {
        return this.api.post<Advance>(`${this.endpoint}/${jobId}/advances`, advance);
    }
}
