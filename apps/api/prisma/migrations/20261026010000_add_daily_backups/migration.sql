-- AlterTable
ALTER TABLE `users` ADD COLUMN `branchId` INTEGER NULL;

-- CreateTable
CREATE TABLE `backups` (
    `id` VARCHAR(36) NOT NULL,
    `backupNo` VARCHAR(50) NOT NULL,
    `branchId` INTEGER NOT NULL,
    `uploadedById` INTEGER NOT NULL,
    `backupDate` DATE NOT NULL,
    `subject` VARCHAR(500) NOT NULL,
    `status` ENUM('UPLOADING', 'COMPLETE', 'FAILED') NOT NULL DEFAULT 'UPLOADING',
    `storageHost` VARCHAR(255) NOT NULL,
    `storagePort` INTEGER NOT NULL,
    `storageUsername` VARCHAR(100) NOT NULL,
    `storageKeyName` VARCHAR(100) NOT NULL,
    `remoteDirectory` VARCHAR(1000) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `backups_backupNo_key`(`backupNo`),
    INDEX `backups_branchId_backupDate_idx`(`branchId`, `backupDate`),
    INDEX `backups_uploadedById_createdAt_idx`(`uploadedById`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `backup_files` (
    `id` VARCHAR(36) NOT NULL,
    `backupId` VARCHAR(36) NOT NULL,
    `originalName` VARCHAR(255) NOT NULL,
    `storedName` VARCHAR(100) NOT NULL,
    `size` BIGINT NOT NULL,

    INDEX `backup_files_backupId_idx`(`backupId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_branchId_fkey` FOREIGN KEY (`branchId`) REFERENCES `branches`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `backups` ADD CONSTRAINT `backups_branchId_fkey` FOREIGN KEY (`branchId`) REFERENCES `branches`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `backups` ADD CONSTRAINT `backups_uploadedById_fkey` FOREIGN KEY (`uploadedById`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `backup_files` ADD CONSTRAINT `backup_files_backupId_fkey` FOREIGN KEY (`backupId`) REFERENCES `backups`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

