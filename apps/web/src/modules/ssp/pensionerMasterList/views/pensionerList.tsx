
"use client";

import { useMemo, useState } from "react";
import {
  Search,
  Plus,
  SlidersHorizontal,
  MoreHorizontal,
  Eye,
  Pencil,
  ChevronLeft,
  ChevronRight,
  Users,
} from "lucide-react";
import Modal from "@/components/common/ModalHeader";
import { useDisclosure } from "@/hooks/useDisclosure";
import AddPensionerModal from "../components/modal/addPensioner";

type PensionerStatus = "Active" | "Inactive" | "Pending";

interface Pensioner {
  id: number;
  pensionerCode: string;
  name: string;
  pensionAmount: number;
  status: PensionerStatus;
  dateRegistered: string;
}

const pensioners: Pensioner[] = [
  {
    id: 1,
    pensionerCode: "PEN-001",
    name: "Maria Santos",
    pensionAmount: 15200,
    status: "Active",
    dateRegistered: "2026-10-01",
  },
  {
    id: 2,
    pensionerCode: "PEN-002",
    name: "Juan Dela Cruz",
    pensionAmount: 12800,
    status: "Active",
    dateRegistered: "2026-09-28",
  },
  {
    id: 3,
    pensionerCode: "PEN-003",
    name: "Rosa Mendoza",
    pensionAmount: 18500,
    status: "Inactive",
    dateRegistered: "2026-09-20",
  },
  {
    id: 4,
    pensionerCode: "PEN-004",
    name: "Pedro Reyes",
    pensionAmount: 14300,
    status: "Pending",
    dateRegistered: "2026-09-15",
  },
  {
    id: 5,
    pensionerCode: "PEN-005",
    name: "Elena Garcia",
    pensionAmount: 16750,
    status: "Active",
    dateRegistered: "2026-09-10",
  },
  {
    id: 6,
    pensionerCode: "PEN-006",
    name: "Antonio Flores",
    pensionAmount: 11200,
    status: "Active",
    dateRegistered: "2026-09-05",
  },
];

const PAGE_SIZE = 5;

const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
  }).format(amount);

const formatDate = (date: string): string =>
  new Intl.DateTimeFormat("en-PH", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));

const statusStyles: Record<PensionerStatus, string> = {
  Active: "bg-[#EAF2EB] text-[#42674D] border-[#D6E5D9]",
  Inactive: "bg-[#F1F0ED] text-[#787F79] border-[#E4E4E0]",
  Pending: "bg-[#F7F0E4] text-[#997344] border-[#EADFCB]",
};

export default function PensionerList() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [page, setPage] = useState(1);
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const userModal = useDisclosure();

     const openModal = () => {
        userModal.open();

    }

    const closeModal = () => {
        userModal.close();
    }



  const filteredPensioners = useMemo(() => {
    const query = search.trim().toLowerCase();

    return pensioners.filter((pensioner) => {
      const matchesSearch =
        pensioner.name.toLowerCase().includes(query) ||
        pensioner.pensionerCode.toLowerCase().includes(query);

      const matchesStatus =
        status === "All" || pensioner.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [search, status]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredPensioners.length / PAGE_SIZE)
  );

  const currentPage = Math.min(page, totalPages);

  const paginatedPensioners = filteredPensioners.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleStatus = (value: string) => {
    setStatus(value);
    setPage(1);
  };

  return (
    <div className="min-h-full bg-[#F8F9F6] p-4">
      {/* Page heading */}
      <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="mb-1 text-[11px] font-medium uppercase tracking-[0.13em] text-[#929A93]">
            Pensioner Management
          </p>

          <h1 className="text-[24px] font-semibold tracking-tight text-[#26342F]">
            Pensioner List
          </h1>

          <p className="mt-1 text-[13px] text-[#929A93]">
            Manage and monitor all registered pensioners.
          </p>
        </div>

        <button
           onClick={openModal}
          type="button"
          className="inline-flex h-10 items-center gap-2 rounded-[10px] bg-[#26342F] px-4 text-[12px] font-medium text-white transition-colors hover:bg-[#374B40]"
        >
          <Plus size={16} />
          Add Pensioner
        </button>
      </div>

      {/* Table card */}
      <div className="overflow-hidden rounded-[15px] border border-[#E0E2DC] bg-white">
        {/* Table header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E9EBE6] px-5 py-5">
          <div>
            <div className="flex items-center gap-2">
              <Users size={17} className="text-[#64786A]" />

              <h2 className="text-[14px] font-semibold text-[#26342F]">
                All Pensioners
              </h2>

              <span className="rounded-full bg-[#EDF0EA] px-2 py-0.5 text-[11px] font-medium text-[#65776A]">
                {filteredPensioners.length}
              </span>
            </div>

            <p className="mt-1 text-[11px] text-[#929A93]">
              A complete list of registered pensioners.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#929A93]"
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  handleSearch(event.target.value)
                }
                placeholder="Search pensioners..."
                className="h-9 w-55 rounded-[9px] border border-[#DCE0D9] bg-[#FAFBF9] pl-9 pr-3 text-[12px] text-[#26342F] outline-none transition focus:border-[#8BA194] focus:ring-2 focus:ring-[#DDE7DE]"
              />
            </div>

            {/* Status filter */}
            <div className="relative flex items-center">
              <SlidersHorizontal
                size={14}
                className="pointer-events-none absolute left-3 text-[#87918B]"
              />

              <select
                value={status}
                onChange={(event) =>
                  handleStatus(event.target.value)
                }
                className="h-9 cursor-pointer appearance-none rounded-[9px] border border-[#DCE0D9] bg-[#FAFBF9] py-0 pl-9 pr-8 text-[12px] text-[#526459] outline-none focus:border-[#8BA194]"
              >
                <option value="All">All statuses</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-212.5 text-left">
            <thead className="bg-[#FAFBF9]">
              <tr className="border-b border-[#E9EBE6]">
                {[
                  "Pensioner",
                  "Pensioner ID",
                  "Pension Amount",
                  "Date Registered",
                  "Status",
                  "Actions",
                ].map((heading) => (
                  <th
                    key={heading}
                    className="px-5 py-3.5 text-[10px] font-semibold uppercase tracking-wildest text-[#929A93]"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {paginatedPensioners.map((pensioner) => {
                const initials = pensioner.name
                  .split(" ")
                  .slice(0, 2)
                  .map((part) => part.charAt(0))
                  .join("")
                  .toUpperCase();

                return (
                  <tr
                    key={pensioner.id}
                    className="border-b border-[#EEF0EB] transition-colors last:border-0 hover:bg-[#FAFBF9]"
                  >
                    {/* Name */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E4E9E3] text-[11px] font-semibold text-[#526459]">
                          {initials}
                        </div>

                        <div>
                          <p className="text-[12px] font-semibold text-[#26342F]">
                            {pensioner.name}
                          </p>
                          <p className="text-[10px] text-[#929A93]">
                            Registered pensioner
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* ID */}
                    <td className="px-5 py-4 text-[12px] text-[#87918B]">
                      {pensioner.pensionerCode}
                    </td>

                    {/* Amount */}
                    <td className="px-5 py-4 text-[12px] font-semibold text-[#26342F]">
                      {formatCurrency(pensioner.pensionAmount)}
                    </td>

                    {/* Date */}
                    <td className="px-5 py-4 text-[12px] text-[#87918B]">
                      {formatDate(pensioner.dateRegistered)}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-medium ${statusStyles[pensioner.status]}`}
                      >
                        {pensioner.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="relative">
                        <button
                          type="button"
                          aria-label={`Actions for ${pensioner.name}`}
                          aria-expanded={openMenu === pensioner.id}
                          onClick={() =>
                            setOpenMenu(
                              openMenu === pensioner.id
                                ? null
                                : pensioner.id
                            )
                          }
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-[#87918B] hover:bg-[#EDF0EA] hover:text-[#26342F]"
                        >
                          <MoreHorizontal size={18} />
                        </button>

                        {openMenu === pensioner.id && (
                          <div className="absolute right-0 top-9 z-20 w-36 rounded-lg border border-[#E0E2DC] bg-white p-1 shadow-lg">
                            <button
                              type="button"
                              // TODO: Connect to View Pensioner.
                              onClick={() => setOpenMenu(null)}
                              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-[12px] text-[#526459] hover:bg-[#F1F3EF]"
                            >
                              <Eye size={14} />
                              View details
                            </button>

                            <button
                              type="button"
                              // TODO: Connect to Edit Pensioner.
                              onClick={() => setOpenMenu(null)}
                              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-[12px] text-[#526459] hover:bg-[#F1F3EF]"
                            >
                              <Pencil size={14} />
                              Edit pensioner
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}

              {paginatedPensioners.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center">
                    <Users
                      size={28}
                      className="mx-auto mb-3 text-[#B1BAB1]"
                    />

                    <p className="text-[13px] font-medium text-[#526459]">
                      No pensioners found
                    </p>

                    <p className="mt-1 text-[12px] text-[#929A93]">
                      Try adjusting your search or filters.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#E9EBE6] px-5 py-4">
          <p className="text-[11px] text-[#929A93]">
            Showing{" "}
            <span className="font-medium text-[#526459]">
              {filteredPensioners.length === 0
                ? 0
                : (currentPage - 1) * PAGE_SIZE + 1}
              {" - "}
              {Math.min(
                currentPage * PAGE_SIZE,
                filteredPensioners.length
              )}
            </span>{" "}
            of {filteredPensioners.length} pensioners
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setPage(currentPage - 1)}
              className="flex h-8 items-center gap-1 rounded-lg border border-[#E0E2DC] px-3 text-[11px] text-[#526459] hover:bg-[#F5F7F3] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={14} />
              Previous
            </button>

            <span className="flex h-8 min-w-8 items-center justify-center rounded-lg bg-[#26342F] px-2 text-[11px] font-medium text-white">
              {currentPage}
            </span>

            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setPage(currentPage + 1)}
              className="flex h-8 items-center gap-1 rounded-lg border border-[#E0E2DC] px-3 text-[11px] text-[#526459] hover:bg-[#F5F7F3] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>






               <Modal onClose={closeModal} isOpen={userModal.isOpen} title={"Add Pensioner "} size="xl">
                <div>
                    <AddPensionerModal />
       
                </div>
            </Modal>



    </div>
  );
}
