import { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import { MoreVertical, Edit, Trash2, CheckCircle, XCircle } from "lucide-react";
import DeleteConfirmModal from "../modals/common/DeleteConfirmModal";

interface TableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  role?: "admin" | "user";
  tableType?: "vehicle" | "slots" | "requests" | "users";
}

function DataTable<T>({
  data,
  columns,
  onEdit,
  onDelete,
  role,
  tableType,
  onApprove,
  onReject,
}: TableProps<T>) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [openRowId, setOpenRowId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState<T | null>(null);

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: (updater) => {
      const newPagination =
        typeof updater === "function"
          ? updater({ pageIndex, pageSize })
          : updater;
      setPageIndex(newPagination.pageIndex);
      setPageSize(newPagination.pageSize);
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="flex  justify-between items-center">
        <input
          type="text"
          placeholder="Search..."
          value={globalFilter ?? ""}
          onChange={(e) => {
            const sanitized = e.target.value.replace(/\s+/g, " ").trimStart();
            if (sanitized !== "") {
              setGlobalFilter(sanitized.toLowerCase());
            } else {
              setGlobalFilter("");
            }
          }}
          className="w-72 px-4 py-2 rounded-md border border-green-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow-md border border-green-200">
        <table className="min-w-full divide-y divide-green-200 text-sm text-green-800">
          <thead className="bg-green-100 uppercase text-xs font-semibold text-green-600">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-5 py-3 text-left">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
                <th className="px-5 py-3 text-left">Actions</th>
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row, i) => (
              <tr
                key={row.id}
                className={`hover:bg-green-50 ${
                  i % 2 === 0 ? "bg-white" : "bg-green-50"
                }`}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-5 py-4 whitespace-nowrap">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}

                <td className="px-5 py-4 relative">
                  {/* ADMIN + REQUESTS → Approve / Reject */}
                  {role === "admin" &&
                  tableType === "requests" &&
                  (row.original as any)?.status === "PENDING" ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => onApprove?.((row.original as any).id)}
                        className="flex items-center gap-1 text-green-600 hover:bg-green-50 px-2 py-1 rounded"
                      >
                        <CheckCircle size={16} />
                        Approve
                      </button>
                      <button
                        onClick={() => onReject?.((row.original as any).id)}
                        className="flex items-center gap-1 text-red-600 hover:bg-red-50 px-2 py-1 rounded"
                      >
                        <XCircle size={16} />
                        Reject
                      </button>
                    </div>
                  ) : (
                    // USER + REQUESTS or VEHICLE → Edit/Delete Dropdown
                    ((role === "user" &&
                      (tableType === "requests" || tableType === "vehicle")) ||
                      (role === "admin" &&
                        (tableType === "vehicle" ||
                          tableType === "slots"))) && (
                      <>
                        <button
                          onClick={() => {
                            setOpenRowId((prev) =>
                              prev === row.id ? null : row.id
                            );
                          }}
                          className="hover:bg-green-200 rounded-full p-1"
                        >
                          <MoreVertical size={18} />
                        </button>

                        {openRowId === row.id && (
                          <div className="absolute top-10 z-50 w-36 bg-green-200 shadow-lg border rounded-md">
                            {onEdit && (
                              <button
                                className="w-full flex items-center px-4 py-2 hover:bg-green-100 text-sm"
                                onClick={() => {
                                  setOpenRowId(null);
                                  const rowData = row.original as T;
                                  onEdit(rowData);
                                }}
                              >
                                <Edit size={16} className="mr-2" />
                                Edit
                              </button>
                            )}
                            {onDelete && (
                              <button
                                className="w-full flex items-center px-4 py-2 hover:bg-green-100 text-sm text-green-600"
                                onClick={() => {
                                  setOpenRowId(null);
                                  const rowData = row.original as T;
                                  setRowToDelete(rowData);
                                  setIsDeleteModalOpen(true);
                                }}
                              >
                                <Trash2 size={16} className="mr-2" />
                                Delete
                              </button>
                            )}
                          </div>
                        )}
                      </>
                    )
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm text-green-600 mt-4">
        <div className="flex items-center gap-2">
          <label htmlFor="pageSize" className="text-sm">
            Rows per page:
          </label>
          <select
            id="pageSize"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPageIndex(0);
            }}
            className="border px-2 py-1 rounded-md text-sm"
          >
            {[5, 10, 20, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setPageIndex((prev) => Math.max(prev - 1, 0))}
            disabled={table.getState().pagination.pageIndex === 0}
            className="px-2 py-1 border rounded disabled:opacity-50"
          >
            Previous
          </button>

          <span>
            Page{" "}
            <strong>
              {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </strong>
          </span>

          <button
            onClick={() =>
              setPageIndex((prev) =>
                Math.min(prev + 1, table.getPageCount() - 1)
              )
            }
            disabled={
              table.getState().pagination.pageIndex >= table.getPageCount() - 1
            }
            className="px-2 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Delete Modal */}
      {rowToDelete && (
        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          onOpenChange={(open) => {
            setIsDeleteModalOpen(open);
            if (!open) setRowToDelete(null);
          }}
          onConfirm={() => {
            if (onDelete && rowToDelete) {
              onDelete(rowToDelete);
              setIsDeleteModalOpen(false);
              setRowToDelete(null);
            }
          }}
          title="Confirm Deletion"
          description="Are you sure you want to delete this item? This action cannot be undone."
        />
      )}
    </div>
  );
}

export default DataTable;
