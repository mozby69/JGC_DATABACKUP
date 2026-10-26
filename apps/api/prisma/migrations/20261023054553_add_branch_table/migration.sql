-- CreateTable
CREATE TABLE `branches` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `branchCode` VARCHAR(30) NOT NULL,
    `branchName` VARCHAR(150) NOT NULL,
    `ipAddress` VARCHAR(255) NOT NULL,
    `sshPort` INTEGER NOT NULL DEFAULT 22,
    `sshUsername` VARCHAR(100) NOT NULL,
    `backupFolder` VARCHAR(500) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `branches_branchCode_key`(`branchCode`),
    INDEX `branches_isActive_idx`(`isActive`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
