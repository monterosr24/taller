-- Create Workers table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Workers]') AND type in (N'U'))
BEGIN
    CREATE TABLE Workers (
        id INT IDENTITY(1,1) PRIMARY KEY,
        first_name NVARCHAR(100) NOT NULL,
        last_name NVARCHAR(100) NOT NULL,
        document_number NVARCHAR(50) UNIQUE,
        phone NVARCHAR(20),
        email NVARCHAR(100),
        hire_date DATE,
        base_salary DECIMAL(18,2),
        is_active BIT DEFAULT 1,
        created_at DATETIME2 DEFAULT GETDATE(),
        updated_at DATETIME2
    );
    PRINT '✅ Workers table created';
END

-- Create Vehicles table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Vehicles]') AND type in (N'U'))
BEGIN
    CREATE TABLE Vehicles (
        id INT IDENTITY(1,1) PRIMARY KEY,
        license_plate NVARCHAR(20) UNIQUE NOT NULL,
        brand NVARCHAR(50),
        model NVARCHAR(50),
        year INT,
        owner_name NVARCHAR(200),
        owner_phone NVARCHAR(20),
        created_at DATETIME2 DEFAULT GETDATE()
    );
    PRINT '✅ Vehicles table created';
END

-- Create Jobs table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Jobs]') AND type in (N'U'))
BEGIN
    CREATE TABLE Jobs (
        id INT IDENTITY(1,1) PRIMARY KEY,
        vehicle_id INT NOT NULL,
        worker_id INT NOT NULL,
        description NVARCHAR(500) NOT NULL,
        total_amount DECIMAL(18,2) NOT NULL,
        advance_amount DECIMAL(18,2) DEFAULT 0,
        status NVARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
        start_date DATE,
        end_date DATE,
        created_at DATETIME2 DEFAULT GETDATE(),
        updated_at DATETIME2,
        FOREIGN KEY (vehicle_id) REFERENCES Vehicles(id),
        FOREIGN KEY (worker_id) REFERENCES Workers(id)
    );
    PRINT '✅ Jobs table created';
END

-- Create Advances table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Advances]') AND type in (N'U'))
BEGIN
    CREATE TABLE Advances (
        id INT IDENTITY(1,1) PRIMARY KEY,
        job_id INT NOT NULL,
        amount DECIMAL(18,2) NOT NULL,
        description NVARCHAR(200),
        advance_date DATE NOT NULL,
        created_at DATETIME2 DEFAULT GETDATE(),
        FOREIGN KEY (job_id) REFERENCES Jobs(id) ON DELETE CASCADE
    );
    PRINT '✅ Advances table created';
END

-- Create Vacations table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Vacations]') AND type in (N'U'))
BEGIN
    CREATE TABLE Vacations (
        id INT IDENTITY(1,1) PRIMARY KEY,
        worker_id INT NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        total_days INT NOT NULL,
        status NVARCHAR(20) DEFAULT 'requested' CHECK (status IN ('requested', 'approved', 'rejected', 'completed')),
        notes NVARCHAR(500),
        created_at DATETIME2 DEFAULT GETDATE(),
        updated_at DATETIME2,
        FOREIGN KEY (worker_id) REFERENCES Workers(id)
    );
    PRINT '✅ Vacations table created';
END

-- Create Invoices table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Invoices]') AND type in (N'U'))
BEGIN
    CREATE TABLE Invoices (
        id INT IDENTITY(1,1) PRIMARY KEY,
        invoice_number NVARCHAR(50) UNIQUE NOT NULL,
        supplier NVARCHAR(200) NOT NULL,
        description NVARCHAR(500),
        total_amount DECIMAL(18,2) NOT NULL,
        paid_amount DECIMAL(18,2) DEFAULT 0,
        payment_status NVARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'partial', 'paid')),
        invoice_date DATE NOT NULL,
        due_date DATE,
        created_at DATETIME2 DEFAULT GETDATE(),
        updated_at DATETIME2
    );
    PRINT '✅ Invoices table created';
END

-- Create Invoice_Payments table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Invoice_Payments]') AND type in (N'U'))
BEGIN
    CREATE TABLE Invoice_Payments (
        id INT IDENTITY(1,1) PRIMARY KEY,
        invoice_id INT NOT NULL,
        payment_amount DECIMAL(18,2) NOT NULL,
        payment_date DATE NOT NULL,
        payment_method NVARCHAR(50),
        reference NVARCHAR(100),
        notes NVARCHAR(200),
        created_at DATETIME2 DEFAULT GETDATE(),
        FOREIGN KEY (invoice_id) REFERENCES Invoices(id) ON DELETE CASCADE
    );
    PRINT '✅ Invoice_Payments table created';
END

-- Create indexes for better performance
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Jobs_WorkerId')
BEGIN
    CREATE INDEX IX_Jobs_WorkerId ON Jobs(worker_id);
    PRINT '✅ Index created: IX_Jobs_WorkerId';
END

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Jobs_VehicleId')
BEGIN
    CREATE INDEX IX_Jobs_VehicleId ON Jobs(vehicle_id);
    PRINT '✅ Index created: IX_Jobs_VehicleId';
END

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Advances_JobId')
BEGIN
    CREATE INDEX IX_Advances_JobId ON Advances(job_id);
    PRINT '✅ Index created: IX_Advances_JobId';
END

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Vacations_WorkerId')
BEGIN
    CREATE INDEX IX_Vacations_WorkerId ON Vacations(worker_id);
    PRINT '✅ Index created: IX_Vacations_WorkerId';
END

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_InvoicePayments_InvoiceId')
BEGIN
    CREATE INDEX IX_InvoicePayments_InvoiceId ON Invoice_Payments(invoice_id);
    PRINT '✅ Index created: IX_InvoicePayments_InvoiceId';
END

PRINT '✅ Initial schema migration completed';
