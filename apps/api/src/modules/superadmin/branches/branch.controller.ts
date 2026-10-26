import * as branchService from './branch.service';
import type { Request, Response } from "express";
import { z } from "zod";
import { Prisma } from "../../../../generated/prisma/client";
import { createBranchSchema,updateBranchSchema,branchQuerySchema } from "@repo/shared";



const branchIdSchema = z.coerce.number().int().positive();
const branchStatusSchema = z.object({ isActive: z.boolean() });

function handleBranchError(error: unknown, res: Response) {
  if (error instanceof z.ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: error.issues,
    });
  }

  if (error instanceof branchService.BranchError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  }

  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  ) {
    return res.status(409).json({
      success: false,
      message: "Branch code already exists",
    });
  }

  console.error("Branch API error:", error);

  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
}

export async function createBranchController(
  req: Request,
  res: Response
) {
  try {
    const validated = createBranchSchema.parse(req.body);

    const result = await branchService.createBranchService(validated);

    return res.status(201).json({
      success: true,
      message: "Branch created successfully",
      data: result,
    });
  } catch (error) {
    return handleBranchError(error, res);
  }
}

export async function getBranchesController(
  req: Request,
  res: Response
) {
  try {
    const params = branchQuerySchema.parse(req.query);

    const result = await branchService.getBranchesService(params);

    return res.status(200).json({
      success: true,
      message: "Branches retrieved successfully",
      data: result.branches,
      pagination: {
        page: result.page,
        limit: result.limit,
        totalRecords: result.totalRecords,
        totalPages: result.totalPages,
      },
    });
  } catch (error) {
    return handleBranchError(error, res);
  }
}

export async function getBranchByIdController(
  req: Request,
  res: Response
) {
  try {
    const id = branchIdSchema.parse(req.params.id);

    const result = await branchService.getBranchByIdService(id);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return handleBranchError(error, res);
  }
}

export async function updateBranchController(
  req: Request,
  res: Response
) {
  try {
    const id = branchIdSchema.parse(req.params.id);
    const validated = updateBranchSchema.parse(req.body);

    const result = await branchService.updateBranchService(id, validated);

    return res.status(200).json({
      success: true,
      message: "Branch updated successfully",
      data: result,
    });
  } catch (error) {
    return handleBranchError(error, res);
  }
}

export async function updateBranchStatusController(req: Request,res: Response) {
  try {
    const id = branchIdSchema.parse(req.params.id);
    const { isActive } = branchStatusSchema.parse(req.body);

    const result = await branchService.updateBranchStatusService(id, isActive);

    return res.status(200).json({
      success: true,
      message: "Branch status updated successfully",
      data: result,
    });
  } catch (error) {
    return handleBranchError(error, res);
  }
}