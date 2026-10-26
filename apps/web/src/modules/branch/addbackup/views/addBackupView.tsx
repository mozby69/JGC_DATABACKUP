
"use client";

import { AddBackupForm } from "../components/AddBackupForm";
import { useMyBranch } from "../hooks/useBackup";


export default function AddBackupView() {
  const { data: branch, isLoading, isError } = useMyBranch();

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-semibold">
        Daily Backup
      </h1>

      {isLoading ? (
        <p>Loading branch information...</p>
      ) : isError || !branch ? (
        <p className="text-sm text-red-600">
          Unable to retrieve your assigned branch.
        </p>
      ) : (
        <AddBackupForm
          branchName={branch.branchName}
        />
      )}
    </div>
  );
}