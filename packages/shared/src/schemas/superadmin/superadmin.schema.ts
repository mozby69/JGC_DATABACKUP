import { z } from "zod";

export const createBranchSchema = z.object({
  branchCode: z.string().trim().min(1, "Branch code is required").max(30),

  branchName: z.string().trim().min(1, "Branch name is required").max(150),

  ipAddress: z.string().trim().min(1, "PC IP address or hostname is required").max(255),

  sshPort: z.coerce.number().int().min(1).max(65535).default(22),

  sshUsername: z.string().trim().min(1, "SSH username is required").max(100),

  backupFolder: z.string().trim().min(1, "Backup folder is required").max(500),
});


export const branchSchema = createBranchSchema.extend({
  id: z.number(),
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});


export const updateBranchSchema = createBranchSchema.partial();

export const branchQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().trim().default(""),
});


export type CreateBranchInput = z.infer<typeof createBranchSchema>;
export type CreateBranchFormValues = z.input<typeof createBranchSchema>;
export type Branch = z.infer<typeof branchSchema>;
export type UpdateBranchInput = z.infer<typeof updateBranchSchema>;
export type BranchQueryInput = z.infer<typeof branchQuerySchema>;
