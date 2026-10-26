"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as service from "../services/backup.service";
export const useBackups = (params: Parameters<typeof service.getBackups>[0]) =>
  useQuery({
    queryKey: ["backups", params],
    queryFn: () => service.getBackups(params),
    refetchInterval: 15000,
  });
export const useBackupContext = () =>
  useQuery({ queryKey: ["backup-context"], queryFn: service.getBackupContext });
export const useAssignments = () =>
  useQuery({
    queryKey: ["backup-assignments"],
    queryFn: service.getAssignments,
  });
export function useUploadBackup(onProgress: (percent: number) => void) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      input,
      files,
    }: {
      input: Parameters<typeof service.uploadBackup>[0];
      files: File[];
    }) => service.uploadBackup(input, files, onProgress),
    onSuccess: () => client.invalidateQueries({ queryKey: ["backups"] }),
    onError: () => client.invalidateQueries({ queryKey: ["backups"] }),
  });
}
export function useAssignBranch() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      userId,
      branchId,
    }: {
      userId: number;
      branchId: number | null;
    }) => service.assignBranch(userId, branchId),
    onSuccess: () =>
      Promise.all([
        client.invalidateQueries({ queryKey: ["backup-assignments"] }),
        client.invalidateQueries({ queryKey: ["backup-context"] }),
      ]),
  });
}
