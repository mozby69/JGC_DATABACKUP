"use client";
import { useState } from "react";
import type { BackupBranch, BackupRecord } from "@repo/shared";
import DataTable, { type TableColumn } from "@/components/common/Datatable";
import { useBackups } from "../hooks/useBackups";
import { backupDownloadUrl } from "../services/backup.service";

const columns: TableColumn<BackupRecord>[] = [
  {
    key: "backupNo",
    header: "Backup No.",
    render: (row) => (
      <span className="font-medium break-all">{row.backupNo}</span>
    ),
  },
  { key: "branch", header: "Branch", render: (row) => row.branch.branchName },
  { key: "date", header: "Date", render: (row) => row.backupDate.slice(0, 10) },
  {
    key: "subject",
    header: "Subject",
    render: (row) => (
      <span className="whitespace-pre-wrap break-words">{row.subject}</span>
    ),
  },
  { key: "user", header: "Uploaded by", render: (row) => row.uploadedBy.name },
  {
    key: "status",
    header: "Status",
    render: (row) => (
      <span
        className={`rounded-full px-2 py-1 text-xs ${row.status === "COMPLETE" ? "bg-emerald-50 text-emerald-700" : row.status === "FAILED" ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"}`}
      >
        {row.status}
      </span>
    ),
  },
  {
    key: "files",
    header: "Attachments",
    render: (row) => (
      <ul className="space-y-2">
        {row.files.map((file) => (
          <li key={file.id}>
            {row.status === "COMPLETE" ? (
              <a
                className="text-emerald-700 underline break-all"
                href={backupDownloadUrl(row.id, file.id)}
              >
                {file.originalName}
              </a>
            ) : (
              <span className="break-all">{file.originalName}</span>
            )}
            <span className="block text-xs text-gray-500">
              {(Number(file.size) / 1024 / 1024).toFixed(2)} MB
            </span>
          </li>
        ))}
      </ul>
    ),
  },
];
export default function BackupListing({
  branches,
}: {
  branches?: BackupBranch[];
}) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [branchId, setBranchId] = useState("");
  const query = useBackups({
    page,
    limit: 10,
    search,
    ...(branchId ? { branchId: Number(branchId) } : {}),
  });
  return (
    <div className="space-y-3" id="backup-listing">
      {branches && (
        <label className="block text-sm">
          Filter by branch
          <select
            className="ml-3 rounded-lg border bg-white p-2"
            value={branchId}
            onChange={(event) => {
              setBranchId(event.target.value);
              setPage(1);
            }}
          >
            <option value="">All branches</option>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.branchName}
              </option>
            ))}
          </select>
        </label>
      )}
      {query.isError && (
        <p role="alert" className="text-red-700">
          Unable to load backups.{" "}
          <button className="underline" onClick={() => query.refetch()}>
            Retry
          </button>
        </p>
      )}
      <DataTable
        title={branches ? "All Backups" : "My Backups"}
        description="Download attachments from completed SFTP transfers."
        columns={columns}
        data={query.data?.backups ?? []}
        getRowId={(row) => row.id}
        manualPagination
        page={page}
        pageSize={10}
        totalRows={query.data?.pagination.totalRecords ?? 0}
        onPageChange={setPage}
        searchValue={search}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        searchPlaceholder="Search backup number, subject, or branch..."
        isLoading={query.isPending}
        emptyMessage="No backups found."
      />
    </div>
  );
}
