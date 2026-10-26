import { prisma } from "@/lib/database/prisma";
import type { Prisma } from "../../../generated/prisma/client";

export const backupInclude = {
  branch: {
    select: { id: true, branchCode: true, branchName: true, isActive: true },
  },
  uploadedBy: { select: { id: true, name: true } },
  files: true,
} as const;

export function publicBackup(
  backup: Prisma.BackupGetPayload<{ include: typeof backupInclude }>,
) {
  return {
    id: backup.id,
    backupNo: backup.backupNo,
    backupDate: backup.backupDate.toISOString(),
    subject: backup.subject,
    status: backup.status,
    createdAt: backup.createdAt.toISOString(),
    branch: backup.branch,
    uploadedBy: backup.uploadedBy,
    files: backup.files.map((file) => ({
      id: file.id,
      originalName: file.originalName,
      size: file.size.toString(),
    })),
  };
}
export const findUploadUser = (id: number) =>
  prisma.user.findUnique({ where: { id }, include: { branch: true } });
export const findBackup = (id: string) =>
  prisma.backup.findUnique({ where: { id }, include: backupInclude });
export const updateBackupStatus = (id: string, status: "COMPLETE" | "FAILED") =>
  prisma.backup.update({
    where: { id },
    data: { status },
    include: backupInclude,
  });
export const createBackup = (data: Prisma.BackupUncheckedCreateInput) =>
  prisma.backup.create({ data, include: backupInclude });
export async function listBackups(
  where: Prisma.BackupWhereInput,
  page: number,
  limit: number,
) {
  const [records, totalRecords] = await prisma.$transaction([
    prisma.backup.findMany({
      where,
      include: backupInclude,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.backup.count({ where }),
  ]);
  return {
    backups: records.map(publicBackup),
    pagination: {
      page,
      limit,
      totalRecords,
      totalPages: Math.ceil(totalRecords / limit),
    },
  };
}
export async function assignmentOptions() {
  const [users, branches] = await Promise.all([
    prisma.user.findMany({
      where: { isActive: true },
      select: { id: true, name: true, username: true, branchId: true },
      orderBy: { name: "asc" },
    }),
    prisma.branch.findMany({
      select: { id: true, branchCode: true, branchName: true, isActive: true },
      orderBy: { branchName: "asc" },
    }),
  ]);
  return { users, branches };
}
export const findBranch = (id: number) =>
  prisma.branch.findUnique({ where: { id } });
export const assignBranch = (userId: number, branchId: number | null) =>
  prisma.user.update({
    where: { id: userId },
    data: { branchId },
    select: { id: true, branchId: true },
  });
