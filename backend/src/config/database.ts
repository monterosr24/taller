import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

const config: sql.config = {
    server: process.env.DB_SERVER || 'localhost',
    database: process.env.DB_NAME || 'WorkshopDB',
    options: {
        encrypt: false, // Set to true for Azure
        trustServerCertificate: true, // Required for local development
        enableArithAbort: true,
        instanceName: undefined // Will be parsed from server string
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

// Handle Windows Authentication vs SQL Server Authentication
if (process.env.DB_TRUSTED_CONNECTION === 'true') {
    // Windows Authentication
    config.authentication = {
        type: 'ntlm',
        options: {
            domain: '',
            userName: '',
            password: ''
        }
    };
} else {
    // SQL Server Authentication
    config.user = process.env.DB_USER;
    config.password = process.env.DB_PASSWORD;
}

let pool: sql.ConnectionPool | null = null;

export const getPool = async (): Promise<sql.ConnectionPool> => {
    if (!pool) {
        pool = await new sql.ConnectionPool(config).connect();
        console.log('✅ Connected to SQL Server');
    }
    return pool;
};

export const closePool = async (): Promise<void> => {
    if (pool) {
        await pool.close();
        pool = null;
        console.log('❌ SQL Server connection closed');
    }
};

export { sql };
