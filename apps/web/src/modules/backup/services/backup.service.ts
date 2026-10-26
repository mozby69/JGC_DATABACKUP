import api from "@/lib/api/api-client";
import type {
  BackupAssignmentUser,
  BackupBranch,
  BackupInput,
  BackupList,
  BackupRecord,
} from "@repo/shared";

type Envelope<T> = { success: boolean; data: T };
export async function getBackups(params: {
  page: number;
  limit: number;
  search: string;
  branchId?: number;
}) {
  return (await api.get<Envelope<BackupList>>("/backups", { params })).data
    .data;
}
export async function getBackupContext() {
  return (
    await api.get<Envelope<{ branch: BackupBranch | null }>>("/backups/context")
  ).data.data;
}
export async function uploadBackup(
  input: BackupInput,
  files: File[],
  onProgress: (percent: number) => void,
) {
  const form = new FormData();
  form.append("backupDate", input.backupDate);
  form.append("subject", input.subject);
  files.forEach((file) => form.append("attachments", file));
  return (
    await api.post<Envelope<BackupRecord>>("/backups", form, {
      onUploadProgress: (event) =>
        onProgress(
          event.total ? Math.round((event.loaded * 100) / event.total) : 0,
        ),
    })
  ).data.data;
}
export const backupDownloadUrl = (backupId: string, fileId: string) =>
  `${api.defaults.baseURL}/backups/${backupId}/files/${fileId}`;
export async function getAssignments() {
  return (
    await api.get<
      Envelope<{ users: BackupAssignmentUser[]; branches: BackupBranch[] }>
    >("/backups/assignments")
  ).data.data;
}
export async function assignBranch(userId: number, branchId: number | null) {
  await api.patch(`/backups/assignments/${userId}`, { branchId });
}
