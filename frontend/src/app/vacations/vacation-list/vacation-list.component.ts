import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VacationService } from '../../core/services/vacation.service';
import { Vacation } from '../../core/models/models';

@Component({
    selector: 'app-vacation-list',
    templateUrl: './vacation-list.component.html',
    styleUrls: ['./vacation-list.component.css']
})
export class VacationListComponent implements OnInit {
    vacations: Vacation[] = [];
    displayedColumns: string[] = ['id', 'worker', 'startDate', 'endDate', 'totalDays', 'status', 'actions'];
    loading = false;

    constructor(
        private vacationService: VacationService,
        private router: Router,
        private snackBar: MatSnackBar
    ) { }

    ngOnInit(): void {
        this.loadVacations();
    }

    loadVacations(): void {
        this.loading = true;
        this.vacationService.getAll().subscribe({
            next: (data: any[]) => {
                this.vacations = data.map(v => ({
                    ...v,
                    workerName: v.worker ? `${v.worker.firstName} ${v.worker.lastName}` : 'N/A'
                }));
                this.loading = false;
            },
            error: (error) => {
                console.error('Error loading vacations:', error);
                this.loading = false;
            }
        });
    }

    createVacation(): void {
        this.router.navigate(['/vacations/new']);
    }

    editVacation(id: number): void {
        this.router.navigate(['/vacations/edit', id]);
    }

    getStatusLabel(status: string): string {
        const labels: { [key: string]: string } = {
            'requested': 'Solicitado',
            'approved': 'Aprobado',
            'rejected': 'Rechazado',
            'completed': 'Completado'
        };
        return labels[status] || status;
    }

    getStatusColor(status: string): string {
        const colors: { [key: string]: string } = {
            'requested': 'warn',
            'approved': 'accent',
            'rejected': 'default',
            'completed': 'primary'
        };
        return colors[status] || 'default';
    }

    approveVacation(id: number): void {
        if (confirm('¿Aprobar esta solicitud de vacaciones?')) {
            this.vacationService.update(id, { status: 'approved' }).subscribe({
                next: () => {
                    this.snackBar.open('Vacación aprobada exitosamente', 'Cerrar', { duration: 3000 });
                    this.loadVacations();
                },
                error: (error) => {
                    const errorMsg = error.error?.details || error.error?.error || 'Error al aprobar vacación';
                    this.snackBar.open(errorMsg, 'Cerrar', {
                        duration: 5000,
                        panelClass: ['error-snackbar']
                    });
                }
            });
        }
    }

    rejectVacation(id: number): void {
        if (confirm('¿Rechazar esta solicitud de vacaciones?')) {
            this.vacationService.update(id, { status: 'rejected' }).subscribe({
                next: () => {
                    this.snackBar.open('Vacación rechazada', 'Cerrar', { duration: 3000 });
                    this.loadVacations();
                },
                error: (error) => {
                    console.error('Error rejecting vacation:', error);
                    this.snackBar.open('Error al rechazar vacación', 'Cerrar', { duration: 3000 });
                }
            });
        }
    }

    deleteVacation(id: number): void {
        if (confirm('¿Estás seguro de eliminar esta vacación?')) {
            this.vacationService.delete(id).subscribe({
                next: () => {
                    this.snackBar.open('Vacación eliminada exitosamente', 'Cerrar', { duration: 3000 });
                    this.loadVacations();
                },
                error: (error) => {
                    console.error('Error deleting vacation:', error);
                    this.snackBar.open('Error al eliminar vacación', 'Cerrar', { duration: 3000 });
                }
            });
        }
    }
}
