import type { Request, Response } from "express";
import { z } from "zod";

import {
  testBranchConnectionService,
  getBranchFilesService,
} from "./connection.service";

const branchIdSchema = z.coerce.number().int().positive();

export async function testBranchConnectionController(
  req: Request,
  res: Response
) {
  try {
    const branchId = branchIdSchema.parse(req.params.id);

    const result = await testBranchConnectionService(branchId);

    return res.status(200).json({
      success: true,
      message: "SFTP connection successful",
      data: result,
    });
  } catch (error) {
    console.error("SFTP connection error:", error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Invalid branch ID",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to connect to branch",
    });
  }
}

export async function getBranchFilesController(
  req: Request,
  res: Response
) {
  try {
    const branchId = branchIdSchema.parse(req.params.id);

    const result = await getBranchFilesService(branchId);

    return res.status(200).json({
      success: true,
      message: "Branch files retrieved successfully",
      data: result,
    });
  } catch (error) {
    console.error("SFTP file listing error:", error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Invalid branch ID",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve branch files",
    });
  }
}