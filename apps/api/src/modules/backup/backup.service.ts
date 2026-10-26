import { randomUUID } from "node:crypto";
import { posix } from "node:path";
import { createSftpConnection } from "@/lib/sftp/sftp.client";
import { AppError } from "@/errors/app-error";
import { ErrorCodes } from "@/errors/error-codes";
import type { AuthUser } from "@/modules/auth/auth.types";
import type { BackupInput } from "@repo/shared";
import * as repo from "./backup.repository";

export function fail(message: string, status = 400): never {
  throw new AppError(
    message,
    status,
    status === 403
      ? ErrorCodes.FORBIDDEN
      : status === 404
        ? ErrorCodes.NOT_FOUND
        : ErrorCodes.VALIDATION_ERROR,
  );
}
export const isSuperadmin = (user: AuthUser) =>
  user.roles.includes("SUPER_ADMIN");
export async function uploadBranch(userId: number) {
  const user = await repo.findUploadUser(userId);
  if (!user?.branch)
    fail("Ask superadmin to assign your account to a branch.", 403);
  if (!user.branch.isActive) fail("Your branch is inactive.", 403);
  return user.branch;
}
export function branchKeyName(branchCode: string) {
  if (!/^[a-zA-Z0-9_-]+$/.test(branchCode))
    fail(
      "Branch code must contain only letters, numbers, hyphens, and underscores for SSH key lookup.",
    );
  return branchCode;
}
export async function uploadBackup(
  userId: number,
  input: BackupInput,
  files: Express.Multer.File[],
) {
  const branch = await uploadBranch(userId);
  if (!files.length) fail("Choose at least one attachment.");
  const keyName = branchKeyName(branch.branchCode);
  const id = randomUUID();
  const backupNo = `BU-${id.toUpperCase()}`;
  const remoteDirectory = posix.join(
    branch.backupFolder.replace(/\\/g, "/"),
    input.backupDate,
    id,
  );
  const attachments = files.map((file) => ({
    id: randomUUID(),
    originalName: file.originalname
      .replace(/\\/g, "/")
      .split("/")
      .pop()!
      .slice(0, 255),
    storedName: randomUUID(),
    size: BigInt(file.size),
  }));
  await repo.createBackup({
    id,
    backupNo,
    branchId: branch.id,
    uploadedById: userId,
    backupDate: new Date(`${input.backupDate}T00:00:00.000Z`),
    subject: input.subject,
    storageHost: branch.ipAddress,
    storagePort: branch.sshPort,
    storageUsername: branch.sshUsername,
    storageKeyName: keyName,
    remoteDirectory,
    files: { create: attachments },
  });
  let client: Awaited<ReturnType<typeof createSftpConnection>> | undefined;
  try {
    client = await createSftpConnection({
      host: branch.ipAddress,
      port: branch.sshPort,
      username: branch.sshUsername,
      keyName,
    });
    if ((await client.exists(branch.backupFolder)) !== "d")
      fail("Branch backup folder is not accessible.");
    await client.mkdir(remoteDirectory, true);
    for (const [index, file] of files.entries()) {
      const remotePath = posix.join(
        remoteDirectory,
        attachments[index].storedName,
      );
      await client.put(file.path, remotePath);
      const stat = await client.stat(remotePath);
      if (stat.size !== file.size)
        throw new Error("Transferred file size mismatch");
    }
    return repo.publicBackup(await repo.updateBackupStatus(id, "COMPLETE"));
  } catch (error) {
    if (client)
      await client.rmdir(remoteDirectory, true).catch(() => undefined);
    await repo.updateBackupStatus(id, "FAILED");
    throw error;
  } finally {
    await client?.end().catch(() => undefined);
  }
}
export async function accessibleBackup(id: string, user: AuthUser) {
  const backup = await repo.findBackup(id);
  if (!backup || (!isSuperadmin(user) && backup.uploadedById !== user.id))
    fail("Backup not found.", 404);
  return backup;
}
export async function downloadFile(
  backupId: string,
  fileId: string,
  user: AuthUser,
  localPath: string,
) {
  const backup = await accessibleBackup(backupId, user);
  if (backup.status !== "COMPLETE") fail("This backup is not complete.", 409);
  const file = backup.files.find((file) => file.id === fileId);
  if (!file) fail("Attachment not found.", 404);
  const client = await createSftpConnection({
    host: backup.storageHost,
    port: backup.storagePort,
    username: backup.storageUsername,
    keyName: backup.storageKeyName,
  });
  try {
    await client.get(
      posix.join(backup.remoteDirectory, file.storedName),
      localPath,
    );
    return file.originalName;
  } finally {
    await client.end().catch(() => undefined);
  }
}
