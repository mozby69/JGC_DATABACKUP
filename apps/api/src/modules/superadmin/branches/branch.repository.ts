import { prisma } from "@/lib/database/prisma";
import { BranchQueryInput, CreateBranchInput, UpdateBranchInput } from "@repo/shared";




export async function createBranchRepo(data: CreateBranchInput) {
  return prisma.branch.create({
    data: {
      branchCode: data.branchCode,
      branchName: data.branchName,
      ipAddress: data.ipAddress,
      sshPort: data.sshPort,
      sshUsername: data.sshUsername,
      backupFolder: data.backupFolder,
    },
  });
}

export async function findBranchByCodeRepo(branchCode: string) {
  return prisma.branch.findUnique({
    where: { branchCode },
  });
}

export async function findBranchByIdRepo(id: number) {
  return prisma.branch.findUnique({
    where: { id },
  });
}

export async function getBranchesRepo(params: BranchQueryInput) {
  const { page, limit, search } = params;

  const where = {
    ...(search && {
      OR: [
        { branchCode: { contains: search } },
        { branchName: { contains: search } },
        { ipAddress: { contains: search } },
      ],
    }),
  };

  const [branches, totalRecords] = await prisma.$transaction([
    prisma.branch.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.branch.count({ where }),
  ]);

  return {
    branches,
    totalRecords,
    page,
    limit,
    totalPages: Math.ceil(totalRecords / limit),
  };
}

export async function updateBranchRepo(
  id: number,
  data: UpdateBranchInput
) {
  return prisma.branch.update({
    where: { id },
    data,
  });
}

export async function updateBranchStatusRepo(
  id: number,
  isActive: boolean
) {
  return prisma.branch.update({
    where: { id },
    data: { isActive },
  });
}