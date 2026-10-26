"use client";
import { useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import BackupListing from "@/modules/backup/components/BackupListing";
import {
  useAssignments,
  useAssignBranch,
} from "@/modules/backup/hooks/useBackups";
export default function BackupView() {
  const options = useAssignments();
  const assignment = useAssignBranch();
  const [userId, setUserId] = useState("");
  async function assign(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try {
      await assignment.mutateAsync({
        userId: Number(userId),
        branchId: form.get("branchId") ? Number(form.get("branchId")) : null,
      });
      toast.success("Branch assignment saved");
    } catch {
      toast.error("Unable to save branch assignment");
    }
  }
  const selectedUser = options.data?.users.find(
    (user) => user.id === Number(userId),
  );
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Backup Management</h1>
        <p className="mt-1 text-sm text-gray-500">
          View submissions and download backups from every branch.
        </p>
      </div>
      <details className="rounded-xl border bg-white p-5">
        <summary className="cursor-pointer font-medium">
          User branch assignments
        </summary>
        {options.isPending ? (
          <p className="mt-4">Loading assignments...</p>
        ) : options.isError ? (
          <p role="alert" className="mt-4 text-red-700">
            Unable to load assignments.{" "}
            <button onClick={() => options.refetch()}>Retry</button>
          </p>
        ) : (
          <form
            onSubmit={assign}
            className="mt-4 flex flex-wrap items-end gap-4"
          >
            <label className="text-sm">
              User
              <select
                required
                className="mt-2 block rounded-lg border p-2"
                value={userId}
                onChange={(event) => setUserId(event.target.value)}
              >
                <option value="">Choose user</option>
                {options.data?.users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.username})
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm">
              Assigned branch
              <select
                key={`${userId}-${selectedUser?.branchId}`}
                disabled={!userId || assignment.isPending}
                defaultValue={selectedUser?.branchId ?? ""}
                name="branchId"
                className="mt-2 block rounded-lg border p-2"
              >
                <option value="">Unassigned</option>
                {options.data?.branches
                  .filter(
                    (branch) =>
                      branch.isActive || branch.id === selectedUser?.branchId,
                  )
                  .map((branch) => (
                    <option
                      key={branch.id}
                      value={branch.id}
                      disabled={!branch.isActive}
                    >
                      {branch.branchName}
                      {!branch.isActive ? " (inactive)" : ""}
                    </option>
                  ))}
              </select>
            </label>
            <button
              disabled={!userId || assignment.isPending}
              className="rounded-lg bg-emerald-700 px-4 py-2 text-white disabled:opacity-50"
            >
              {assignment.isPending ? "Saving..." : "Save Assignment"}
            </button>
          </form>
        )}
      </details>
      <BackupListing branches={options.data?.branches ?? []} />
    </div>
  );
}
