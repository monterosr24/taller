/*
  Warnings:

  - You are about to drop the column `supplier` on the `Invoices` table. All the data in the column will be lost.
  - Added the required column `supplier_id` to the `Invoices` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Invoices] DROP COLUMN [supplier];
ALTER TABLE [dbo].[Invoices] ADD [supplier_id] INT NOT NULL;

-- CreateTable
CREATE TABLE [dbo].[Suppliers] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(200) NOT NULL,
    [contact_name] NVARCHAR(100),
    [phone] NVARCHAR(20),
    [email] NVARCHAR(100),
    [address] NVARCHAR(300),
    [notes] NVARCHAR(500),
    [is_active] BIT CONSTRAINT [DF__Suppliers__is_ac__1234ABCD] DEFAULT 1,
    [created_at] DATETIME2 CONSTRAINT [DF__Suppliers__creat__2345BCDE] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2,
    CONSTRAINT [PK__Supplier__3213E83F8A9B2C3D] PRIMARY KEY CLUSTERED ([id])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [IX_Invoices_SupplierId] ON [dbo].[Invoices]([supplier_id]);

-- AddForeignKey
ALTER TABLE [dbo].[Invoices] ADD CONSTRAINT [FK__Invoices__suppli__6C190EBB] FOREIGN KEY ([supplier_id]) REFERENCES [dbo].[Suppliers]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
