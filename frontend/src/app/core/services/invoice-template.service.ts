import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface InvoiceTemplate {
    id: number;
    supplierId: number;
    name: string;
    filePath: string;
    zones: string; // JSON string
    isActive: boolean;
    createdAt: Date;
}

@Injectable({
    providedIn: 'root'
})
export class InvoiceTemplateService {
    private apiUrl = `${environment.apiUrl}/invoice-automation/templates`;

    constructor(private http: HttpClient) { }

    getTemplates(supplierId: number): Observable<InvoiceTemplate[]> {
        return this.http.get<InvoiceTemplate[]>(`${this.apiUrl}/supplier/${supplierId}`);
    }

    createTemplate(supplierId: number, file: File, name: string): Observable<any> {
        const formData = new FormData();
        formData.append('supplierId', supplierId.toString());
        formData.append('file', file);
        formData.append('name', name);
        return this.http.post(this.apiUrl, formData);
    }

    getFile(id: number): Observable<Blob> {
        return this.http.get(`${this.apiUrl}/${id}/file`, { responseType: 'blob' });
    }

    saveZones(id: number, zones: any[]): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}/zones`, { zones });
    }

    deleteTemplate(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
