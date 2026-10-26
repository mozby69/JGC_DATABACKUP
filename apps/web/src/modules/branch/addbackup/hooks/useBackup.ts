




"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { createBackup, getBackupById, getBranchBackups, getMyBranch } from "../service/backup.service";
import { CreateBackupInput } from "@repo/shared";



export const backupKeys = {
  all: ["branch-backups"] as const,
  detail: (id: number) =>
    ["branch-backups", id] as const,
};

export function useBranchBackups() {
  return useQuery({
    queryKey: backupKeys.all,
    queryFn: getBranchBackups,
    staleTime: 30_000,
  });
}

export function useBackupById(id: number) {
  return useQuery({
    queryKey: backupKeys.detail(id),
    queryFn: () => getBackupById(id),
    enabled: Number.isInteger(id) && id > 0,
  });
}

export function useCreateBackup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateBackupInput) =>
      createBackup(input),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: backupKeys.all,
      });
    },
  });
}





export function useMyBranch() {
  return useQuery({
    queryKey: ["my-branch"],
    queryFn: getMyBranch,
    staleTime: 60_000,
  });
}