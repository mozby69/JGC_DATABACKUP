

import { prisma } from "@/lib/database/prisma";
import { BackupStatus } from "../../../../generated/prisma/client";

export interface CreateBackupRecord {
  branchId: number;
  userId: number;
  backupDate: Date;
  subject: string;
  fileName: string;
  remotePath: string;
}

export async function createBackupRepo(
  data: CreateBackupRecord
) {
  return prisma.$transaction(async (tx) => {
    const backup = await tx.backup.create({
      data: {
        branchId: data.branchId,
        userId: data.userId,
        backupDate: data.backupDate,
        subject: data.subject,
        fileName: data.fileName,
        remotePath: data.remotePath,
        status: "PENDING",
      },
    });

    return tx.backup.update({
      where: {
        id: backup.id,
      },
      data: {
        backupNo: `B${backup.id}`,
      },
    });
  });
}



export async function getBranchBackupsRepo(
  branchId: number
) {
  return prisma.backup.findMany({
    where: {
      branchId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getBackupByIdRepo(
  id: number,
  branchId: number
) {
  return prisma.backup.findFirst({
    where: {
      id,
      branchId,
    },
  });
}

export async function updateBackupStatusRepo(
  id: number,
  status: BackupStatus,
  data?: {
    localPath?: string;
    fileSize?: bigint;
    errorMessage?: string;
    startedAt?: Date;
    completedAt?: Date;
  }
) {
  return prisma.backup.update({
    where: { id },
    data: {
      status,
      ...data,
    },
  });
}





export async function getBranchByIdRepo(branchId: number) {
  return prisma.branch.findFirst({
    where: {
      id: branchId,
      isActive: true,
    },
    select: {
      id: true,
      branchCode: true,
      branchName: true,
      backupFolder: true,
    },
  });
}

export async function getBranchByUserIdRepo(userId: number) {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      branch: {
        select: {
          id: true,
          branchCode: true,
          branchName: true,
          backupFolder: true,
          isActive: true,
        },
      },
    },
  });
}