import { Component, Input, OnInit } from '@angular/core';
import { InvoiceTemplateService, InvoiceTemplate } from '../../core/services/invoice-template.service';
import { MatDialog } from '@angular/material/dialog';
import { TemplateEditorComponent } from '../template-editor/template-editor.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-template-manager',
    templateUrl: './template-manager.component.html',
    styleUrls: ['./template-manager.component.css']
})
export class TemplateManagerComponent implements OnInit {
    @Input() supplierId!: number;
    templates: InvoiceTemplate[] = [];
    isLoading = false;

    constructor(
        private templateService: InvoiceTemplateService,
        private dialog: MatDialog,
        private snackBar: MatSnackBar
    ) { }

    ngOnInit() {
        this.loadTemplates();
    }

    loadTemplates() {
        this.isLoading = true;
        this.templateService.getTemplates(this.supplierId).subscribe({
            next: (data) => {
                this.templates = data;
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Error loading templates', err);
                this.isLoading = false;
            }
        });
    }

    openEditor(template?: InvoiceTemplate) {
        const dialogRef = this.dialog.open(TemplateEditorComponent, {
            width: '98vw',
            height: '95vh',
            maxWidth: '100vw',
            data: {
                supplierId: this.supplierId,
                template: template // If passed, edit zones. If null, create new.
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.loadTemplates();
            }
        });
    }

    deleteTemplate(id: number) {
        if (confirm('Are you sure you want to delete this template?')) {
            this.templateService.deleteTemplate(id).subscribe({
                next: () => {
                    this.snackBar.open('Template deleted', 'Close', { duration: 3000 });
                    this.loadTemplates();
                },
                error: () => this.snackBar.open('Error deleting template', 'Close', { duration: 3000 })
            });
        }
    }
}
