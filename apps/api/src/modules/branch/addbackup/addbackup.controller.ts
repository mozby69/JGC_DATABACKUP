


import type { Request, Response } from "express";
import { z } from "zod";
import * as backupService from "./addbackup.service";
import { backupIdSchema, createBackupSchema } from "@repo/shared";


function handleBackupError(
  error: unknown,
  res: Response
) {
  if (error instanceof z.ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: error.issues,
    });
  }

  if (error instanceof backupService.BackupError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  }

  console.error("Backup API error:", error);

  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
}

export async function createBackupController(
  req: Request,
  res: Response
) {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // Assumes authenticated user has a verified branchId.
    const branchId = user.branchId;

    if (!branchId) {
      return res.status(403).json({
        success: false,
        message: "No branch assigned to this user",
      });
    }

    const input = createBackupSchema.parse(req.body);

    const result = await backupService.createBackupService(
      input,
      user.id,
      branchId
    );

    return res.status(201).json({
      success: true,
      message: "Backup request created successfully",
      data: result,
    });
  } catch (error) {
    return handleBackupError(error, res);
  }
}

export async function getBranchBackupsController(
  req: Request,
  res: Response
) {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const branchId = user.branchId;

    if (!branchId) {
      return res.status(403).json({
        success: false,
        message: "No branch assigned to this user",
      });
    }

    const result = await backupService.getBranchBackupsService(branchId);

    return res.status(200).json({
      success: true,
      message: "Backup history retrieved successfully",
      data: result,
    });
  } catch (error) {
    return handleBackupError(error, res);
  }
}

export async function getBackupByIdController(
  req: Request,
  res: Response
) {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const branchId = user.branchId;

    if (!branchId) {
      return res.status(403).json({
        success: false,
        message: "No branch assigned to this user",
      });
    }

    const id = backupIdSchema.parse(req.params.id);

    const result = await backupService.getBackupByIdService(
      id,
      branchId
    );

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return handleBackupError(error, res);
  }
}



export async function getMyBranchController(
  req: Request,
  res: Response
) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const branch = await backupService.getMyBranchService(
      req.user.id
    );

    return res.status(200).json({
      success: true,
      data: branch,
    });
  } catch (error) {
    return handleBackupError(error, res);
  }
}