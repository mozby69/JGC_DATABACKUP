import api from "@/lib/api/api-client";
import { Branch, CreateBranchInput, UpdateBranchInput } from "@repo/shared";

export interface GetBranchesParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface BranchPagination {
  page: number;
  limit: number;
  totalRecords: number;
  totalPages: number;
}

export interface GetBranchesResponse {
  success: boolean;
  message: string;
  data: Branch[];
  pagination: BranchPagination;
}

interface BranchResponse {
  success: boolean;
  message: string;
  data: Branch;
}

export const branchService = {
  async getBranches(params: GetBranchesParams) {
    const { data } = await api.get<GetBranchesResponse>(
      "/superadmin/branches",
      { params }
    );

    return data;
  },

  async getBranchById(id: number) {
    const { data } = await api.get<BranchResponse>(
      `/superadmin/branches/${id}`
    );

    return data.data;
  },

  async createBranch(payload: CreateBranchInput) {
    const { data } = await api.post<BranchResponse>(
      "/superadmin/branches/add-branch",
      payload
    );

    return data.data;
  },

  async updateBranch(id: number, payload: UpdateBranchInput) {
    const { data } = await api.patch<BranchResponse>(
      `/superadmin/branches/${id}`,
      payload
    );

    return data.data;
  },

  async updateBranchStatus(id: number, isActive: boolean) {
    const { data } = await api.patch<BranchResponse>(
      `/superadmin/branches/${id}/status`,
      { isActive }
    );

    return data.data;
  },
};