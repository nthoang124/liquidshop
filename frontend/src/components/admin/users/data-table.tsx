import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  type SortingState,
} from "@tanstack/react-table"

import { SearchX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow
} from "@/components/ui/table"


import type { IUser } from "@/types/user"
import { columns } from "./columns"
import { useNavigate } from "react-router-dom"
import Pagination from "../common/Pagination"
import { useState } from "react"


interface DataTableProps {
  users: IUser[];
  page: number;
  totalPages: number;
  setPage: (page: number) => void;

  search: string;
  setSearch: (search: string) => void;
}

export function DataTable({ users, page, totalPages, setPage, search, setSearch }: DataTableProps) {
  const navigate = useNavigate();
  const [sorting, setSorting] = useState<SortingState>([])

  const table = useReactTable({
    data: users,
    columns,
    meta: {
      onUserClick: (id: string) => navigate(`/admin/users/${id}`)
    },
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full">

      {/* SEARCH */}
      <div className="flex items-center py-4">
        <Input
          placeholder="Tìm kiếm theo email và tên khách hàng"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm bg-white text-sm"
        />
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-xs bg-white">
        <Table className="border-0">
          <TableHeader className="bg-[#F7FAFC] h-16">
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id} className="hover:bg-transparent border-0">
                {group.headers.map((header) => (
                  <TableHead key={header.id} className="text-md sm:text-lg font-semibold">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {users.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className={`text-md sm:text-base`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="border-0">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length}>
                  <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground">
                    <SearchX className="w-12 h-12 mb-3 opacity-70" />
                    <span className="text-lg font-semibold">Không tìm thấy dữ liệu</span>
                    <span className="text-sm mb-3">Thử từ khóa khác hoặc reset tìm kiếm.</span>

                    <Button variant="outline" onClick={() => setSearch("")}>
                      Xoá bộ lọc
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* PAGINATION */}
      <Pagination
        page={page}
        setPage={setPage}
        totalPages={totalPages}
      />
    </div>
  );
}
