import { Component, Inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InvoiceTemplateService } from '../../core/services/invoice-template.service';
import * as pdfjsLib from 'pdfjs-dist';

@Component({
    selector: 'app-template-editor',
    templateUrl: './template-editor.component.html',
    styleUrls: ['./template-editor.component.css']
})
export class TemplateEditorComponent implements OnInit {
    @ViewChild('previewCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
    @ViewChild('overlayCanvas') overlayRef!: ElementRef<HTMLCanvasElement>;

    form: FormGroup;
    isEditMode = false;
    selectedFile: File | null = null;
    filePreview: string | ArrayBuffer | null = null;
    isLoading = false;

    // Canvas & Zone State
    pdfDoc: any = null;
    pageNum = 1;
    scale = 1;
    zones: any[] = [];
    isDrawing = false;
    startPoint = { x: 0, y: 0 };

    fieldTypes = [
        { value: 'invoiceNumber', label: 'Invoice Number' },
        { value: 'invoiceDate', label: 'Date' },
        { value: 'totalAmount', label: 'Total Amount' },
        { value: 'supplierName', label: 'Supplier Name' }
    ];

    constructor(
        private fb: FormBuilder,
        private templateService: InvoiceTemplateService,
        private dialogRef: MatDialogRef<TemplateEditorComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { supplierId: number, template?: any }
    ) {
        this.isEditMode = !!data.template;
        this.form = this.fb.group({
            name: [data.template?.name || '', Validators.required],
            file: [null, this.isEditMode ? [] : Validators.required]
        });

        if (this.isEditMode && data.template.zones) {
            try {
                this.zones = JSON.parse(data.template.zones);
            } catch (e) {
                this.zones = [];
            }
        }

        // Configure PDF worker
        (pdfjsLib as any).GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
    }

    ngOnInit() {
        if (this.isEditMode) {
            this.loadExistingFile();
        }
    }

    loadExistingFile() {
        this.isLoading = true;
        this.templateService.getFile(this.data.template.id).subscribe({
            next: async (blob) => {
                const buffer = await blob.arrayBuffer();
                this.renderFile(buffer);
            },
            error: () => this.isLoading = false
        });
    }

    onFileSelected(event: any) {
        const file = event.target.files[0];
        if (file) {
            this.selectedFile = file;
            this.form.patchValue({
                name: file.name.split('.')[0],
                file: file
            }); // Auto-fill name and valid file

            const reader = new FileReader();
            reader.onload = (e: any) => {
                this.renderFile(e.target.result);
            };
            reader.readAsArrayBuffer(file);
        }
    }

    async renderFile(data: ArrayBuffer) {
        this.isLoading = true;
        // Try PDF first
        try {
            const loadingTask = pdfjsLib.getDocument(data);
            this.pdfDoc = await loadingTask.promise;
            await this.renderPdfPage(1);
        } catch (e) {
            // Fallback to Image (TODO: Implement Image rendering if needed, for now assume PDF or handle text)
            console.error('Not a PDF or Error', e);
            this.isLoading = false;
        }
    }

    async renderPdfPage(num: number) {
        const page = await this.pdfDoc.getPage(num);
        const viewport = page.getViewport({ scale: 1 });

        // Scale to fit container width (e.g., 800px)
        const desiredWidth = 800;
        this.scale = desiredWidth / viewport.width;
        const scaledViewport = page.getViewport({ scale: this.scale });

        const canvas = this.canvasRef.nativeElement;
        const ctx = canvas.getContext('2d');
        canvas.height = scaledViewport.height;
        canvas.width = scaledViewport.width;

        const overlay = this.overlayRef.nativeElement;
        overlay.height = scaledViewport.height;
        overlay.width = scaledViewport.width;

        await page.render({ canvasContext: ctx!, viewport: scaledViewport }).promise;

        this.isLoading = false;
        this.drawZones();
    }

    // --- Drawing Logic ---
    getMousePos(evt: MouseEvent) {
        const rect = this.overlayRef.nativeElement.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }

    onMouseDown(e: MouseEvent) {
        this.isDrawing = true;
        this.startPoint = this.getMousePos(e);
    }

    onMouseMove(e: MouseEvent) {
        if (!this.isDrawing) return;
        const current = this.getMousePos(e);

        this.drawZones(); // Redraw existing

        const ctx = this.overlayRef.nativeElement.getContext('2d')!;
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.startPoint.x, this.startPoint.y, current.x - this.startPoint.x, current.y - this.startPoint.y);
    }

    onMouseUp(e: MouseEvent) {
        if (!this.isDrawing) return;
        this.isDrawing = false;
        const end = this.getMousePos(e);

        const w = end.x - this.startPoint.x;
        const h = end.y - this.startPoint.y;

        if (Math.abs(w) > 5 && Math.abs(h) > 5) {
            // Add new zone
            this.zones.push({
                x: Math.min(this.startPoint.x, end.x),
                y: Math.min(this.startPoint.y, end.y),
                w: Math.abs(w),
                h: Math.abs(h),
                label: '', // User needs to select
                page: this.pageNum
            });
        }
        this.drawZones();
    }

    drawZones() {
        const ctx = this.overlayRef.nativeElement.getContext('2d')!;
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        this.zones.forEach((z, i) => {
            ctx.strokeStyle = z.label ? 'green' : 'red';
            ctx.lineWidth = 2;
            ctx.strokeRect(z.x, z.y, z.w, z.h);

            ctx.fillStyle = z.label ? 'rgba(0, 255, 0, 0.2)' : 'rgba(255, 0, 0, 0.2)';
            ctx.fillRect(z.x, z.y, z.w, z.h);

            if (z.label) {
                ctx.fillStyle = 'black';
                ctx.font = '12px Arial';
                ctx.fillText(this.getFieldLabel(z.label), z.x, z.y - 5);
            }
        });
    }

    getFieldLabel(val: string) {
        return this.fieldTypes.find(f => f.value === val)?.label || val;
    }

    removeZone(index: number) {
        this.zones.splice(index, 1);
        this.drawZones();
    }

    // --- Saving ---

    save() {
        if (this.form.invalid) return;
        this.isLoading = true;

        // Filter valid zones (must have label)
        const validZones = this.zones.filter(z => z.label);

        if (this.isEditMode) {
            // Just save zones
            this.templateService.saveZones(this.data.template.id, validZones).subscribe({
                next: () => this.dialogRef.close(true),
                error: (e) => {
                    console.error(e);
                    this.isLoading = false;
                }
            });
        } else {
            // Create then save zones
            this.templateService.createTemplate(this.data.supplierId, this.selectedFile!, this.form.value.name)
                .subscribe({
                    next: (template) => {
                        this.templateService.saveZones(template.id, validZones).subscribe({
                            next: () => this.dialogRef.close(true),
                            error: () => this.dialogRef.close(true) // Close anyway if zones fail, template created
                        });
                    },
                    error: (e) => {
                        console.error(e);
                        this.isLoading = false;
                    }
                });
        }
    }

    cancel() {
        this.dialogRef.close();
    }
}
