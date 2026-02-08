/*
  Warnings:

  - You are about to drop the column `end_date` on the `Vacations` table. All the data in the column will be lost.
  - You are about to drop the column `start_date` on the `Vacations` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Vacations] DROP COLUMN [end_date],
[start_date];
ALTER TABLE [dbo].[Vacations] ADD [type] NVARCHAR(50);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
