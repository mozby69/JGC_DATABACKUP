import { z } from "zod";

export const BACKUP_MAX_FILES = 10;
export const BACKUP_MAX_FILE_BYTES = 1024 * 1024 * 1024;
export const backupInputSchema = z.object({
  backupDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a date")
    .refine((value) => {
      const date = new Date(`${value}T00:00:00.000Z`);
      return (
        !Number.isNaN(date.getTime()) &&
        date.toISOString().slice(0, 10) === value
      );
    }, "Invalid date"),
  subject: z.string().trim().min(1, "Subject is required").max(500),
});
export const backupQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().trim().max(150).default(""),
  branchId: z.coerce.number().int().positive().optional(),
});
export const branchAssignmentSchema = z.object({
  branchId: z.number().int().positive().nullable(),
});
export type BackupInput = z.infer<typeof backupInputSchema>;
export interface BackupBranch {
  id: number;
  branchCode: string;
  branchName: string;
  isActive: boolean;
}
export interface BackupRecord {
  id: string;
  backupNo: string;
  backupDate: string;
  subject: string;
  status: "UPLOADING" | "COMPLETE" | "FAILED";
  createdAt: string;
  branch: BackupBranch;
  uploadedBy: { id: number; name: string };
  files: { id: string; originalName: string; size: string }[];
}
export interface BackupList {
  backups: BackupRecord[];
  pagination: {
    page: number;
    limit: number;
    totalRecords: number;
    totalPages: number;
  };
}
export interface BackupAssignmentUser {
  id: number;
  name: string;
  username: string;
  branchId: number | null;
}
