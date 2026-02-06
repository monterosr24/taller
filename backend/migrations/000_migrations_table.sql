-- Create migration tracking table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Migrations]') AND type in (N'U'))
BEGIN
    CREATE TABLE Migrations (
        id INT IDENTITY(1,1) PRIMARY KEY,
        migration_name NVARCHAR(255) NOT NULL UNIQUE,
        executed_at DATETIME2 DEFAULT GETDATE()
    );
    PRINT '✅ Migrations table created';
END
ELSE
BEGIN
    PRINT 'ℹ️  Migrations table already exists';
END
