"use client";

import { useEffect, useMemo, useState } from "react";
import type { Branch, CreateBranchInput, UpdateBranchInput } from "@repo/shared";

import DataTable from "@/components/common/Datatable"; 
import { branchColumns } from "../components/column";
import AddBranchModal from "../components/modal/addBranchModal";
import { useCreateBranch, useGetBranches, useUpdateBranch } from "../hooks/useBranch";
import toast from "react-hot-toast";
import EditBranchModal from "../components/modal/editBranchModal";


export default function BranchesView() {
  const [openAddModal, setOpenAddModal] = useState(false);

  const [userPage, setUserPage] = useState(1);
  const [userLimit] = useState(10);

  const [userSearch, setUserSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);

const updateBranchMutation = useUpdateBranch();

const handleEditBranch = (branch: Branch) => {
  setSelectedBranch(branch);
};

const handleUpdateBranch = async (
  id: number,
  payload: UpdateBranchInput
) => {
  await updateBranchMutation.mutateAsync({
    id,
    payload,
  });
    toast.success("Updated Successfully!");
  setSelectedBranch(null);
};

const columns = useMemo(
  () => branchColumns(handleEditBranch),
  []
);



  // Debounce search to avoid calling the API on every keystroke
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(userSearch);
    }, 400);

    return () => clearTimeout(timeout);
  }, [userSearch]);

  const {
    data,
    isPending,
    isFetching,
    isError,
    error,
  } = useGetBranches({
    page: userPage,
    limit: userLimit,
    search: debouncedSearch,
  });

  const createBranchMutation = useCreateBranch();

  const branches = data?.data ?? [];
  const totalRecords = data?.pagination.totalRecords ?? 0;

  const handleSaveBranch = async (
    payload: CreateBranchInput
  ) => {
    await createBranchMutation.mutateAsync(payload);
    toast.success("New Branch Added Successfully!");
    setOpenAddModal(false);
    setUserPage(1);
  };

  return (
    <div className="space-y-5 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">
            Branch Management
          </h1>

          <p className="text-sm text-gray-500">
            Manage Windows branches and their backup configurations.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setOpenAddModal(true)}
          className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800"
        >
          + Add Branch
        </button>
      </div>

      {isError && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          Failed to load branches: {error.message}
        </div>
      )}

      <DataTable<Branch>
        title="All Branches"
        description="Manage registered Windows PCs for centralized backups."
        columns={columns}
        data={branches}
        getRowId={(row) => row.id}
        manualPagination
        page={userPage}
        pageSize={userLimit}
        totalRows={totalRecords}
        onPageChange={setUserPage}
        searchPlaceholder="Search branches..."
        searchValue={userSearch}
        onSearchChange={(value) => {
          setUserSearch(value);
          setUserPage(1);
        }}
        isLoading={isPending || isFetching}
      />

      <AddBranchModal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        onSave={handleSaveBranch}
        isSaving={createBranchMutation.isPending}
      />


      {selectedBranch && (
        <EditBranchModal
            key={selectedBranch.id}
            open={true}
            branch={selectedBranch}
            onClose={() => setSelectedBranch(null)}
            onSave={handleUpdateBranch}
            isSaving={updateBranchMutation.isPending}
        />
        )}


    </div>
  );
}