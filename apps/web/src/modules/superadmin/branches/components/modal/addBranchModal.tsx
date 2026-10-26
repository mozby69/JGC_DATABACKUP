"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createBranchSchema,
  type CreateBranchFormValues,
  type CreateBranchInput,
} from "@repo/shared";

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (data: CreateBranchInput) => Promise<void>;
  isSaving?: boolean;
};

export default function AddBranchModal({
  open,
  onClose,
  onSave,
  isSaving = false,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateBranchFormValues, unknown, CreateBranchInput>({
    resolver: zodResolver(createBranchSchema),
    defaultValues: {
      branchCode: "",
      branchName: "",
      ipAddress: "",
      sshPort: 22,
      sshUsername: "backupuser",
      backupFolder: "C:/BackupData",
    },
  });

  if (!open) return null;

  const submit = async (data: CreateBranchInput) => {
    await onSave(data);
    reset();
    onClose();
  };

  const inputClass =
    "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-emerald-600";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-branch-title"
        className="w-full max-w-xl rounded-xl bg-white p-6 shadow-xl"
      >
        <h2 id="add-branch-title" className="text-lg font-semibold">
          Add Branch
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Register a Windows PC for centralized backup management.
        </p>

        <form onSubmit={handleSubmit(submit)} className="mt-5 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm">Branch Code</label>
              <input
                {...register("branchCode")}
                className={inputClass}
                placeholder="BR001"
              />
              {errors.branchCode && (
                <p className="text-xs text-red-600">
                  {errors.branchCode.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm">Branch Name</label>
              <input
                {...register("branchName")}
                className={inputClass}
                placeholder="Bacolod Branch"
              />
              {errors.branchName && (
                <p className="text-xs text-red-600">
                  {errors.branchName.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm">PC IP / Hostname</label>
              <input
                {...register("ipAddress")}
                className={inputClass}
                placeholder="192.168.1.101"
              />
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
                {...register("sshPort")}
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
            <input
              {...register("sshUsername")}
              className={inputClass}
              placeholder="backupuser"
            />
            {errors.sshUsername && (
              <p className="text-xs text-red-600">
                {errors.sshUsername.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm">Windows Backup Folder</label>
            <input
              {...register("backupFolder")}
              className={inputClass}
              placeholder="C:/BackupData"
            />
            {errors.backupFolder && (
              <p className="text-xs text-red-600">
                {errors.backupFolder.message}
              </p>
            )}
          </div>

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
              {isSaving ? "Saving..." : "Save Branch"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}