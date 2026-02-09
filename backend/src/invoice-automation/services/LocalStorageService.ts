import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export class LocalStorageService {
    private uploadDir: string;

    constructor(uploadDir: string = 'uploads') {
        this.uploadDir = path.resolve(uploadDir);
        if (!fs.existsSync(this.uploadDir)) {
            fs.mkdirSync(this.uploadDir, { recursive: true });
        }
    }

    async save(buffer: Buffer, options: { folder?: string; filename?: string }): Promise<string> {
        const folder = options.folder ? path.join(this.uploadDir, options.folder) : this.uploadDir;

        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder, { recursive: true });
        }

        const filename = options.filename || `${uuidv4()}.dat`;
        const filepath = path.join(folder, filename);

        await fs.promises.writeFile(filepath, buffer);
        return filepath;
    }

    async delete(filepath: string): Promise<void> {
        if (fs.existsSync(filepath)) {
            await fs.promises.unlink(filepath);
        }
    }
}
