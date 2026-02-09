import { PrismaClient } from '@prisma/client';
import { LocalStorageService } from './LocalStorageService';

export class InvoiceTemplateService {
    constructor(
        private prisma: PrismaClient,
        private storage: LocalStorageService
    ) { }

    async createTemplate(supplierId: number, file: Express.Multer.File, name: string) {
        // Save file
        const filename = `${supplierId}_${Date.now()}_${file.originalname}`;
        const filePath = await this.storage.save(file.buffer, {
            folder: 'templates',
            filename: filename
        });

        // Create DB record
        return await this.prisma.invoiceTemplate.create({
            data: {
                supplierId,
                name: name || file.originalname,
                filePath: filePath,
                zones: JSON.stringify([]), // Initialize empty zones
                isActive: true
            }
        });
    }

    async getTemplates(supplierId: number) {
        return await this.prisma.invoiceTemplate.findMany({
            where: { supplierId },
            orderBy: { createdAt: 'desc' }
        });
    }

    async getTemplate(id: number) {
        return await this.prisma.invoiceTemplate.findUnique({ where: { id } });
    }

    async updateZones(id: number, zones: any[]) {
        return await this.prisma.invoiceTemplate.update({
            where: { id },
            data: { zones: JSON.stringify(zones) }
        });
    }

    async deleteTemplate(id: number) {
        const template = await this.prisma.invoiceTemplate.findUnique({ where: { id } });
        if (template) {
            await this.storage.delete(template.filePath);
            await this.prisma.invoiceTemplate.delete({ where: { id } });
        }
    }
}
