BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Workers] ADD [payment_frequency] NVARCHAR(20) CONSTRAINT [DF__Workers__payment__freq] DEFAULT 'monthly',
[worker_type] NVARCHAR(20) CONSTRAINT [DF__Workers__worker__type] DEFAULT 'direct';

-- CreateTable
CREATE TABLE [dbo].[Salary_Advances] (
    [id] INT NOT NULL IDENTITY(1,1),
    [worker_id] INT NOT NULL,
    [amount] DECIMAL(18,2) NOT NULL,
    [advance_date] DATE NOT NULL,
    [payment_period_start] DATE NOT NULL,
    [payment_period_end] DATE NOT NULL,
    [notes] NVARCHAR(500),
    [created_at] DATETIME2 CONSTRAINT [DF__SalaryAdv__creat__7A1A2C3D] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__SalaryAd__3213E83F9A1B2C3D] PRIMARY KEY CLUSTERED ([id])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [IX_SalaryAdvances_WorkerId] ON [dbo].[Salary_Advances]([worker_id]);

-- AddForeignKey
ALTER TABLE [dbo].[Salary_Advances] ADD CONSTRAINT [FK__SalaryAdv__worke__7B2E50E6] FOREIGN KEY ([worker_id]) REFERENCES [dbo].[Workers]([id]) ON DELETE CASCADE ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
