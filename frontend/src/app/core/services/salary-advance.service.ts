import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { SalaryAdvance, AvailableAdvanceInfo } from '../models/models';

@Injectable({
    providedIn: 'root'
})
export class SalaryAdvanceService {
    private endpoint = 'salary-advances';

    constructor(private api: ApiService) { }

    getByWorkerId(workerId: number): Observable<SalaryAdvance[]> {
        return this.api.get<SalaryAdvance[]>(`${this.endpoint}/worker/${workerId}`);
    }

    getAvailableAdvance(workerId: number): Observable<AvailableAdvanceInfo> {
        return this.api.get<AvailableAdvanceInfo>(`${this.endpoint}/worker/${workerId}/available`);
    }

    create(advance: SalaryAdvance): Observable<SalaryAdvance> {
        return this.api.post<SalaryAdvance>(this.endpoint, advance);
    }

    delete(id: number): Observable<void> {
        return this.api.delete<void>(`${this.endpoint}/${id}`);
    }
}
