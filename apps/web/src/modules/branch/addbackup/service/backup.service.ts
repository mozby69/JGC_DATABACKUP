import api from "@/lib/api/api-client";
import { ApiResponse, Backup, CreateBackupInput, MyBranch } from "@repo/shared";





export async function createBackup(
  input: CreateBackupInput
): Promise<Backup> {
  const response = await api.post<ApiResponse<Backup>>(
    "/branch/backups",
    input
  );

  return response.data.data;
}

export async function getBranchBackups(): Promise<Backup[]> {
  const response = await api.get<ApiResponse<Backup[]>>(
    "/branch/backups"
  );

  return response.data.data;
}

export async function getBackupById(
  id: number
): Promise<Backup> {
  const response = await api.get<ApiResponse<Backup>>(
    `/branch/backups/${id}`
  );

  return response.data.data;
}





export async function getMyBranch(): Promise<MyBranch> {
  const response = await api.get<ApiResponse<MyBranch>>(
    "/branch/backups/current-branch"
  );

  return response.data.data;
}