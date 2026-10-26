import type { Request, Response } from "express";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { z } from "zod";
import {
  backupInputSchema,
  backupQuerySchema,
  branchAssignmentSchema,
} from "@repo/shared";
import * as repo from "./backup.repository";
import * as service from "./backup.service";

export async function context(req: Request, res: Response) {
  const user = await repo.findUploadUser(req.user!.id);
  const branch = user?.branch;
  res.json({
    success: true,
    data: {
      branch: branch
        ? {
            id: branch.id,
            branchCode: branch.branchCode,
            branchName: branch.branchName,
            isActive: branch.isActive,
          }
        : null,
    },
  });
}
export async function list(req: Request, res: Response) {
  const { page, limit, search, branchId } = backupQuerySchema.parse(req.query);
  const result = await repo.listBackups(
    {
      ...(!service.isSuperadmin(req.user!) && { uploadedById: req.user!.id }),
      ...(branchId && { branchId }),
      ...(search && {
        OR: [
          { backupNo: { contains: search } },
          { subject: { contains: search } },
          { branch: { branchName: { contains: search } } },
        ],
      }),
    },
    page,
    limit,
  );
  res.json({ success: true, data: result });
}
export async function upload(req: Request, res: Response) {
  const data = await service.uploadBackup(
    req.user!.id,
    backupInputSchema.parse(req.body),
    (req.files ?? []) as Express.Multer.File[],
  );
  res
    .status(201)
    .json({ success: true, message: "Backup uploaded successfully", data });
}
export async function download(req: Request, res: Response) {
  const directory = await mkdtemp(join(tmpdir(), "backup-download-"));
  try {
    const path = join(directory, "attachment");
    const name = await service.downloadFile(
      z.string().uuid().parse(req.params.id),
      z.string().uuid().parse(req.params.fileId),
      req.user!,
      path,
    );
    res.setHeader("Cache-Control", "private, no-store");
    await new Promise<void>((resolve, reject) =>
      res.download(path, name, (error) => (error ? reject(error) : resolve())),
    );
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}
export async function options(_req: Request, res: Response) {
  res.json({ success: true, data: await repo.assignmentOptions() });
}
export async function assignment(req: Request, res: Response) {
  const id = z.coerce.number().int().positive().parse(req.params.userId);
  const { branchId } = branchAssignmentSchema.parse(req.body);
  if (!(await repo.findUploadUser(id))) service.fail("User not found.", 404);
  if (branchId !== null) {
    const branch = await repo.findBranch(branchId);
    if (!branch?.isActive) service.fail("Choose an active branch.");
  }
  res.json({ success: true, data: await repo.assignBranch(id, branchId) });
}
