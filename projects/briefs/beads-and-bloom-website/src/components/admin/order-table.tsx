"use client";

import { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  createColumnHelper,
  flexRender,
} from "@tanstack/react-table";
import { format } from "date-fns";
import Link from "next/link";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OrderStatusBadge } from "./order-status-badge";
import { OrderStatusButton } from "./order-status-button";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";

export type AdminOrder = {
  id: number;
  status: string;
  totalAmount: string;
  giftMessage: string | null;
  createdAt: Date;
  customerName: string | null;
  customerEmail: string | null;
};

const statusTabs = ["all", "new", "making", "shipped", "delivered"] as const;

const columnHelper = createColumnHelper<AdminOrder>();

const columns = [
  columnHelper.accessor("id", {
    header: "Order #",
    cell: (info) => (
      <Link
        href={`/admin/orders/${info.getValue()}`}
        className="font-medium text-teal-700 hover:underline"
      >
        #{info.getValue()}
      </Link>
    ),
  }),
  columnHelper.accessor("customerName", {
    header: "Customer",
    cell: (info) => info.getValue() ?? "Unknown",
  }),
  columnHelper.accessor("createdAt", {
    header: "Date",
    cell: (info) => format(new Date(info.getValue()), "MMM d, yyyy"),
    meta: { hideOnMobile: true },
  }),
  columnHelper.accessor("totalAmount", {
    header: "Total",
    cell: (info) => `$${info.getValue()}`,
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: (info) => <OrderStatusBadge status={info.getValue()} />,
  }),
  columnHelper.display({
    id: "actions",
    header: "Action",
    cell: (info) => (
      <OrderStatusButton
        orderId={info.row.original.id}
        currentStatus={info.row.original.status}
      />
    ),
  }),
];

export function OrderTable({
  data,
  initialStatus,
}: {
  data: AdminOrder[];
  initialStatus?: string;
}) {
  const [activeTab, setActiveTab] = useState(initialStatus ?? "all");
  const [search, setSearch] = useState("");

  const filteredData = useMemo(() => {
    let result = data;

    // Filter by status tab
    if (activeTab !== "all") {
      result = result.filter((order) => {
        if (activeTab === "new") {
          return order.status === "new" || order.status === "confirmed";
        }
        return order.status === activeTab;
      });
    }

    // Filter by search
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (order) =>
          (order.customerName?.toLowerCase().includes(q) ?? false) ||
          String(order.id).includes(q)
      );
    }

    return result;
  }, [data, activeTab, search]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize: 20 },
    },
  });

  return (
    <div className="space-y-4">
      {/* Status tabs */}
      <div className="flex flex-wrap gap-1">
        {statusTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium capitalize transition-colors ${
              activeTab === tab
                ? "bg-teal-100 text-teal-800"
                : "text-stone-500 hover:bg-stone-100 hover:text-stone-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
        <Input
          placeholder="Search by customer name or order #..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Table */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={
                      (header.column.columnDef.meta as { hideOnMobile?: boolean })
                        ?.hideOnMobile
                        ? "hidden md:table-cell"
                        : ""
                    }
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {search || activeTab !== "all"
                    ? "No orders match your filters."
                    : "No orders yet. They'll appear here when customers place orders."}
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={
                        (cell.column.columnDef.meta as { hideOnMobile?: boolean })
                          ?.hideOnMobile
                          ? "hidden md:table-cell"
                          : ""
                      }
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {table.getPageCount() > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-stone-500">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="size-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
