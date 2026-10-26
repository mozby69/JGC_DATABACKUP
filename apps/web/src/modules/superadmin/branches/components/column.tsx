import type { Branch } from "@repo/shared";
import type { TableColumn } from "@/components/common/Table"; 
import { Pencil } from "lucide-react";

export const branchColumns = (
  onEdit: (branch: Branch) => void
): TableColumn<Branch>[] => [
  {
    key: "branchCode",
    header: "Branch Code",
    render: (row) => row.branchCode,
  },
  {
    key: "branchName",
    header: "Branch Name",
    render: (row) => row.branchName,
  },
  {
    key: "ipAddress",
    header: "PC IP / Host",
    render: (row) => row.ipAddress,
  },
  {
    key: "sshPort",
    header: "SSH Port",
    render: (row) => row.sshPort,
  },
  {
    key: "sshUsername",
    header: "SSH Username",
    render: (row) => row.sshUsername,
  },
  {
    key: "backupFolder",
    header: "Backup Folder",
    render: (row) => row.backupFolder,
  },
  {
    key: "isActive",
    header: "Status",
    render: (row) => (
      <span
        className={
          row.isActive
            ? "font-medium text-green-600"
            : "font-medium text-red-600"
        }
      >
        {row.isActive ? "Active" : "Inactive"}
      </span>
    ),
  },
  {
    key: "actions",
    header: "Actions",
    render: (row) => (
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onEdit(row);
        }}
        className="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm hover:bg-gray-100"
      >
        <Pencil size={14} />
        Edit
      </button>
    ),
  },
];