/*
  Warnings:

  - A unique constraint covering the columns `[backupNo]` on the table `backups` will be added. If there are existing duplicate values, this will fail.
  - Made the column `remotePath` on table `backups` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `backups` ADD COLUMN `backupDate` DATE NULL,
    ADD COLUMN `backupNo` VARCHAR(30) NULL,
    ADD COLUMN `subject` TEXT NULL,
    MODIFY `remotePath` VARCHAR(1000) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `backups_backupNo_key` ON `backups`(`backupNo`);
