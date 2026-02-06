import { getPool } from './database';
import fs from 'fs';
import path from 'path';

const MIGRATIONS_DIR = path.join(__dirname, '../../migrations');

interface Migration {
    name: string;
    path: string;
}

async function getMigrationFiles(): Promise<Migration[]> {
    const files = fs.readdirSync(MIGRATIONS_DIR);
    return files
        .filter((file) => file.endsWith('.sql'))
        .sort()
        .map((file) => ({
            name: file.replace('.sql', ''),
            path: path.join(MIGRATIONS_DIR, file),
        }));
}

async function getExecutedMigrations(): Promise<string[]> {
    const pool = await getPool();
    try {
        const result = await pool.request().query('SELECT migration_name FROM Migrations');
        return result.recordset.map((row: any) => row.migration_name);
    } catch (error) {
        // Migrations table doesn't exist yet
        return [];
    }
}

async function executeMigration(migration: Migration): Promise<void> {
    const pool = await getPool();
    const sql = fs.readFileSync(migration.path, 'utf-8');

    console.log(`\n🔄 Running migration: ${migration.name}`);

    try {
        // Execute the migration SQL
        await pool.request().query(sql);

        // Record the migration (skip for migration table creation itself)
        if (!migration.name.startsWith('000_')) {
            await pool
                .request()
                .input('migration_name', migration.name)
                .query('INSERT INTO Migrations (migration_name) VALUES (@migration_name)');
        }

        console.log(`✅ Migration completed: ${migration.name}`);
    } catch (error) {
        console.error(`❌ Migration failed: ${migration.name}`);
        throw error;
    }
}

async function runMigrations(): Promise<void> {
    try {
        console.log('🚀 Starting database migrations...\n');

        const migrationFiles = await getMigrationFiles();
        const executedMigrations = await getExecutedMigrations();

        const pendingMigrations = migrationFiles.filter(
            (migration) => !executedMigrations.includes(migration.name)
        );

        if (pendingMigrations.length === 0) {
            console.log('✅ No pending migrations. Database is up to date!');
            return;
        }

        console.log(`📋 Found ${pendingMigrations.length} pending migration(s)\n`);

        for (const migration of pendingMigrations) {
            await executeMigration(migration);
        }

        console.log('\n✅ All migrations completed successfully!');
    } catch (error) {
        console.error('\n❌ Migration failed:', error);
        process.exit(1);
    } finally {
        process.exit(0);
    }
}

// Run migrations when this file is executed directly
if (require.main === module) {
    runMigrations();
}

export { runMigrations };
