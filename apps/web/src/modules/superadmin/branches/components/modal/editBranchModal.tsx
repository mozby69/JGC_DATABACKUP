


"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import axios from "axios";

import {
  updateBranchSchema,
  type Branch,
  type UpdateBranchInput,
} from "@repo/shared";

type Props = {
  open: boolean;
  branch: Branch | null;
  onClose: () => void;
  onSave: (id: number, data: UpdateBranchInput) => Promise<void>;
  isSaving?: boolean;
};

export default function EditBranchModal({
  open,
  branch,
  onClose,
  onSave,
  isSaving = false,
}: Props) {
  const [saveError, setSaveError] = useState<string | null>(null);

const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm<UpdateBranchInput>({
  resolver: zodResolver(updateBranchSchema),

  defaultValues: {
    branchCode: branch?.branchCode ?? "",
    branchName: branch?.branchName ?? "",
    ipAddress: branch?.ipAddress ?? "",
    sshPort: branch?.sshPort ?? 22,
    sshUsername: branch?.sshUsername ?? "",
    backupFolder: branch?.backupFolder ?? "",
  },
});



  if (!open || !branch) return null;

  const submit = async (data: UpdateBranchInput) => {
    try {
      setSaveError(null);
      await onSave(branch.id, data);
      onClose();
    } catch (error) {
      setSaveError(
        axios.isAxiosError(error)
          ? error.response?.data?.message ?? "Failed to update branch."
          : "Failed to update branch."
      );
    }
  };

  const inputClass =
    "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-emerald-600";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-branch-title"
        className="w-full max-w-xl rounded-xl bg-white p-6 shadow-xl"
      >
        <div className="flex items-center justify-between">
          <h2 id="edit-branch-title" className="text-lg font-semibold">
            Edit Branch
          </h2>

          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <p className="mt-1 text-sm text-gray-500">
          Update the Windows PC backup configuration.
        </p>

        <form onSubmit={handleSubmit(submit)} className="mt-5 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm">Branch Code</label>
              <input {...register("branchCode")} className={inputClass} />
              {errors.branchCode && (
                <p className="text-xs text-red-600">
                  {errors.branchCode.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm">Branch Name</label>
              <input {...register("branchName")} className={inputClass} />
              {errors.branchName && (
                <p className="text-xs text-red-600">
                  {errors.branchName.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm">PC IP / Hostname</label>
              <input {...register("ipAddress")} className={inputClass} />
              {errors.ipAddress && (
                <p className="text-xs text-red-600">
                  {errors.ipAddress.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm">SSH Port</label>
              <input
                type="number"
                {...register("sshPort", { valueAsNumber: true })}
                className={inputClass}
              />
              {errors.sshPort && (
                <p className="text-xs text-red-600">
                  {errors.sshPort.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm">SSH Username</label>
            <input {...register("sshUsername")} className={inputClass} />
            {errors.sshUsername && (
              <p className="text-xs text-red-600">
                {errors.sshUsername.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm">Backup Folder</label>
            <input {...register("backupFolder")} className={inputClass} />
            {errors.backupFolder && (
              <p className="text-xs text-red-600">
                {errors.backupFolder.message}
              </p>
            )}
          </div>

          {saveError && (
            <p role="alert" className="text-sm text-red-600">
              {saveError}
            </p>
          )}

          <div className="flex justify-end gap-3 border-t pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="rounded-lg border px-4 py-2 text-sm"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="rounded-lg bg-emerald-700 px-4 py-2 text-sm text-white disabled:opacity-50"
            >
              {isSaving ? "Updating..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}