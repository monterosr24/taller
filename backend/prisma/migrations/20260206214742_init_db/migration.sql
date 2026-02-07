BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Advances] (
    [id] INT NOT NULL IDENTITY(1,1),
    [job_id] INT NOT NULL,
    [amount] DECIMAL(18,2) NOT NULL,
    [description] NVARCHAR(200),
    [advance_date] DATE NOT NULL,
    [created_at] DATETIME2 CONSTRAINT [DF__Advances__create__5DCAEF64] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__Advances__3213E83FF9B5C259] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Invoice_Payments] (
    [id] INT NOT NULL IDENTITY(1,1),
    [invoice_id] INT NOT NULL,
    [payment_amount] DECIMAL(18,2) NOT NULL,
    [payment_date] DATE NOT NULL,
    [payment_method] NVARCHAR(50),
    [reference] NVARCHAR(100),
    [notes] NVARCHAR(200),
    [created_at] DATETIME2 CONSTRAINT [DF__Invoice_P__creat__6E01572D] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__Invoice___3213E83F74C9C2AC] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Invoices] (
    [id] INT NOT NULL IDENTITY(1,1),
    [invoice_number] NVARCHAR(50) NOT NULL,
    [supplier] NVARCHAR(200) NOT NULL,
    [description] NVARCHAR(500),
    [total_amount] DECIMAL(18,2) NOT NULL,
    [paid_amount] DECIMAL(18,2) CONSTRAINT [DF__Invoices__paid_a__68487DD7] DEFAULT 0,
    [payment_status] NVARCHAR(20) CONSTRAINT [DF__Invoices__paymen__693CA210] DEFAULT 'pending',
    [invoice_date] DATE NOT NULL,
    [due_date] DATE,
    [created_at] DATETIME2 CONSTRAINT [DF__Invoices__create__6B24EA82] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2,
    CONSTRAINT [PK__Invoices__3213E83FA01D73DB] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [UQ__Invoices__8081A63AA3C9B95F] UNIQUE NONCLUSTERED ([invoice_number])
);

-- CreateTable
CREATE TABLE [dbo].[Jobs] (
    [id] INT NOT NULL IDENTITY(1,1),
    [vehicle_id] INT NOT NULL,
    [worker_id] INT NOT NULL,
    [description] NVARCHAR(500) NOT NULL,
    [total_amount] DECIMAL(18,2) NOT NULL,
    [advance_amount] DECIMAL(18,2) CONSTRAINT [DF__Jobs__advance_am__5629CD9C] DEFAULT 0,
    [status] NVARCHAR(20) CONSTRAINT [DF__Jobs__status__571DF1D5] DEFAULT 'pending',
    [start_date] DATE,
    [end_date] DATE,
    [created_at] DATETIME2 CONSTRAINT [DF__Jobs__created_at__59063A47] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2,
    CONSTRAINT [PK__Jobs__3213E83FBB3978DB] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Migrations] (
    [id] INT NOT NULL IDENTITY(1,1),
    [migration_name] NVARCHAR(255) NOT NULL,
    [executed_at] DATETIME2 CONSTRAINT [DF__Migration__execu__4AB81AF0] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__Migratio__3213E83F892EF628] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [UQ__Migratio__29AC81C2B4744562] UNIQUE NONCLUSTERED ([migration_name])
);

-- CreateTable
CREATE TABLE [dbo].[Vacations] (
    [id] INT NOT NULL IDENTITY(1,1),
    [worker_id] INT NOT NULL,
    [start_date] DATE NOT NULL,
    [end_date] DATE NOT NULL,
    [total_days] INT NOT NULL,
    [status] NVARCHAR(20) CONSTRAINT [DF__Vacations__statu__619B8048] DEFAULT 'requested',
    [notes] NVARCHAR(500),
    [created_at] DATETIME2 CONSTRAINT [DF__Vacations__creat__6383C8BA] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2,
    CONSTRAINT [PK__Vacation__3213E83F405134C4] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Vehicles] (
    [id] INT NOT NULL IDENTITY(1,1),
    [license_plate] NVARCHAR(20) NOT NULL,
    [brand] NVARCHAR(50),
    [model] NVARCHAR(50),
    [year] INT,
    [owner_name] NVARCHAR(200),
    [owner_phone] NVARCHAR(20),
    [created_at] DATETIME2 CONSTRAINT [DF__Vehicles__create__534D60F1] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__Vehicles__3213E83F639FA8A2] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [UQ__Vehicles__F72CD56E9B06B6CB] UNIQUE NONCLUSTERED ([license_plate])
);

-- CreateTable
CREATE TABLE [dbo].[Workers] (
    [id] INT NOT NULL IDENTITY(1,1),
    [first_name] NVARCHAR(100) NOT NULL,
    [last_name] NVARCHAR(100) NOT NULL,
    [document_number] NVARCHAR(50),
    [phone] NVARCHAR(20),
    [email] NVARCHAR(100),
    [hire_date] DATE,
    [base_salary] DECIMAL(18,2),
    [is_active] BIT CONSTRAINT [DF__Workers__is_acti__4E88ABD4] DEFAULT 1,
    [created_at] DATETIME2 CONSTRAINT [DF__Workers__created__4F7CD00D] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2,
    CONSTRAINT [PK__Workers__3213E83F78A44101] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [UQ__Workers__C8FE0D8CD61B47EA] UNIQUE NONCLUSTERED ([document_number])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [IX_Advances_JobId] ON [dbo].[Advances]([job_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [IX_InvoicePayments_InvoiceId] ON [dbo].[Invoice_Payments]([invoice_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [IX_Jobs_VehicleId] ON [dbo].[Jobs]([vehicle_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [IX_Jobs_WorkerId] ON [dbo].[Jobs]([worker_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [IX_Vacations_WorkerId] ON [dbo].[Vacations]([worker_id]);

-- AddForeignKey
ALTER TABLE [dbo].[Advances] ADD CONSTRAINT [FK__Advances__job_id__5EBF139D] FOREIGN KEY ([job_id]) REFERENCES [dbo].[Jobs]([id]) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Invoice_Payments] ADD CONSTRAINT [FK__Invoice_P__invoi__6EF57B66] FOREIGN KEY ([invoice_id]) REFERENCES [dbo].[Invoices]([id]) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Jobs] ADD CONSTRAINT [FK__Jobs__vehicle_id__59FA5E80] FOREIGN KEY ([vehicle_id]) REFERENCES [dbo].[Vehicles]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Jobs] ADD CONSTRAINT [FK__Jobs__worker_id__5AEE82B9] FOREIGN KEY ([worker_id]) REFERENCES [dbo].[Workers]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Vacations] ADD CONSTRAINT [FK__Vacations__worke__6477ECF3] FOREIGN KEY ([worker_id]) REFERENCES [dbo].[Workers]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
