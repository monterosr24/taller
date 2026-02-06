import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Vehicle } from '../models/models';

@Injectable({
    providedIn: 'root'
})
export class VehicleService {
    private endpoint = 'vehicles';

    constructor(private api: ApiService) { }

    getAll(): Observable<Vehicle[]> {
        return this.api.get<Vehicle[]>(this.endpoint);
    }

    getById(id: number): Observable<Vehicle> {
        return this.api.get<Vehicle>(`${this.endpoint}/${id}`);
    }

    create(vehicle: Vehicle): Observable<Vehicle> {
        return this.api.post<Vehicle>(this.endpoint, vehicle);
    }

    update(id: number, vehicle: Partial<Vehicle>): Observable<Vehicle> {
        return this.api.put<Vehicle>(`${this.endpoint}/${id}`, vehicle);
    }

    delete(id: number): Observable<void> {
        return this.api.delete<void>(`${this.endpoint}/${id}`);
    }
}
