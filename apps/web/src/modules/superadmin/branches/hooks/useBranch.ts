import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { branchService, GetBranchesParams } from "../services/branchService";
import { CreateBranchInput, UpdateBranchInput } from "@repo/shared";



export const branchQueryKeys = {
  all: ["branches"] as const,

  list: (params: GetBranchesParams) =>
    ["branches", "list", params] as const,

  detail: (id: number) =>
    ["branches", "detail", id] as const,
};

// GET BRANCHES
export function useGetBranches(params: GetBranchesParams) {
  return useQuery({
    queryKey: branchQueryKeys.list(params),
    queryFn: () => branchService.getBranches(params),
    placeholderData: (previousData) => previousData,
    staleTime: 30_000,
  });
}

// GET BRANCH BY ID
export function useGetBranchById(id: number) {
  return useQuery({
    queryKey: branchQueryKeys.detail(id),
    queryFn: () => branchService.getBranchById(id),
    enabled: id > 0,
  });
}

// CREATE BRANCH
export function useCreateBranch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateBranchInput) =>
      branchService.createBranch(payload),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: branchQueryKeys.all,
      });
    },
  });
}

// UPDATE BRANCH
export function useUpdateBranch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: UpdateBranchInput;
    }) => branchService.updateBranch(id, payload),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: branchQueryKeys.all,
      });
    },
  });
}

// ACTIVATE / DEACTIVATE BRANCH
export function useUpdateBranchStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      isActive,
    }: {
      id: number;
      isActive: boolean;
    }) => branchService.updateBranchStatus(id, isActive),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: branchQueryKeys.all,
      });
    },
  });
}