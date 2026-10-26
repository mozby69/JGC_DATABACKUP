import type {
  CreateBranchInput,
  UpdateBranchInput,
  BranchQueryInput,
} from "@repo/shared";

import * as branchRepository from './branch.repository';

export class BranchError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number
  ) {
    super(message);
    this.name = "BranchError";
  }
}

export async function createBranchService(data: CreateBranchInput) {
  const existing = await branchRepository.findBranchByCodeRepo(data.branchCode);

  if (existing) {
    throw new BranchError("Branch code already exists", 409);
  }

  return branchRepository.createBranchRepo(data);
}

export async function getBranchesService(params: BranchQueryInput) {
  return branchRepository.getBranchesRepo(params);
}

export async function getBranchByIdService(id: number) {
  const branch = await branchRepository.findBranchByIdRepo(id);

  if (!branch) {
    throw new BranchError("Branch not found", 404);
  }

  return branch;
}

export async function updateBranchService(
  id: number,
  data: UpdateBranchInput
) {
  await getBranchByIdService(id);

  if (data.branchCode !== undefined) {
    const existing = await branchRepository.findBranchByCodeRepo(data.branchCode);

    if (existing && existing.id !== id) {
      throw new BranchError("Branch code already exists", 409);
    }
  }

  return branchRepository.updateBranchRepo(id, data);
}

export async function updateBranchStatusService(
  id: number,
  isActive: boolean
) {
  await getBranchByIdService(id);

  return branchRepository.updateBranchStatusRepo(id, isActive);
}