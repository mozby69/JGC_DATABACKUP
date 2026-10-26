export type BackupStatus =
  | "PENDING"
  | "RUNNING"
  | "COMPLETED"
  | "FAILED";

export interface Backup {
  id: number;
  branchId: number;
  userId: number;

  fileName: string;
  remotePath: string;
  localPath: string | null;

  fileSize: string | null;

  status: BackupStatus;
  errorMessage: string | null;

  createdAt: string;
  startedAt: string | null;
  completedAt: string | null;
}

export interface CreateBackupInput2 {
  fileName: string;
  remotePath: string;
}




export interface MyBranch {
  id: number;
  branchCode: string;
  branchName: string;
  backupFolder: string;
}