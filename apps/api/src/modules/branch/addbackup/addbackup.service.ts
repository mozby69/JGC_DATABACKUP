import * as backupRepo from './addbackup.repository';
import type { CreateBackupInput } from "@repo/shared";




export class BackupError extends Error {
  constructor(
    message: string,
    public statusCode: number = 400
  ) {
    super(message);
    this.name = "BackupError";
  }
}

export async function createBackupService(
  input: CreateBackupInput,
  userId: number,
  branchId: number
) {
  return backupRepo.createBackupRepo({
    userId,
    branchId,

    backupDate: new Date(
      `${input.backupDate}T00:00:00.000Z`
    ),

    subject: input.subject.trim(),
    fileName: input.fileName.trim(),
    remotePath: input.remotePath.trim(),
  });
}
export async function getBranchBackupsService(branchId: number) {
  return backupRepo.getBranchBackupsRepo(branchId);
}

export async function getBackupByIdService(id: number,branchId: number) {
  const backup = await backupRepo.getBackupByIdRepo(id, branchId);

  if (!backup) {
    throw new BackupError("Backup not found", 404);
  }

  return backup;
}

export async function getMyBranchService(userId: number) {
  const user = await backupRepo.getBranchByUserIdRepo(userId);

  if (!user?.branch || !user.branch.isActive) {
    throw new BackupError(
      "No active branch assigned to this user",
      404
    );
  }

  const { isActive, ...branch } = user.branch;

  return branch;
}
