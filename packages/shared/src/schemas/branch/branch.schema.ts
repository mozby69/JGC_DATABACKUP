import z from "zod";


export const createBackupSchema = z.object({
  backupDate: z.date(),

  subject: z.string()
    .trim()
    .min(1, "Subject is required"),

  fileName: z.string()
    .trim()
    .min(1, "Attachment is required")
    .max(255),

  remotePath: z.string()
    .trim()
    .min(1, "Remote path is required")
    .max(1000),
});

export const backupIdSchema = z.coerce.number()
  .int()
  .positive();

export type CreateBackupInput = z.infer<
  typeof createBackupSchema
>;