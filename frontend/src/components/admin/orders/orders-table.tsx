import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import type {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table"
import { ChevronDown, ChevronsRight, ChevronsLeft, SearchX } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { IUser } from "@/types/user"
import { columns } from "./columns"  
import { useNavigate } from "react-router-dom"



interface DataTableProps {
  users: IUser[];
  setPage: (page: number) => void;
  totalPages: number;
  page: number; 
  search: string;
  setSearch: (search: string) => void;
}

export function DataTable({users, setPage, totalPages, page, search, setSearch} : DataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const navigate = useNavigate();

  const table = useReactTable({
    data: users,
    columns,
    meta: {
      onUserClick: (id: string) => navigate(`/admin/users/${id}`)
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
    },
  })

  const handlePreButton = () => {
    if(page <= 1) return;
    setPage(page - 1);
  }

  const handleNextButton = () => {
    if(page >= totalPages) return;
    setPage(page + 1);
  }

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input 
          placeholder="Tìm kiếm theo email và tên khách hàng"
          value={search }
          onChange={(event) =>
            setSearch(event.target.value)
          }
          className="max-w-sm bg-white text-md"
        />  
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="overflow-hidden rounded-md border bg-white">
        <Table>
          <TableHeader className="bg-blue-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-md sm:text-lg font-bold">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
         <TableBody>
            {users.length > 0 ? (
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={
                    `text-md sm:text-base ` +
                    (index % 2 === 0 ? "bg-white" : "bg-slate-100")
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              
              // render if no user found
              <TableRow>
                  <TableCell colSpan={columns.length}>
                    <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground">
                      <SearchX className="w-12 h-12 mb-3 opacity-70" />
                      <span className="text-lg font-semibold">Không tìm thấy dữ liệu</span>
                      <span className="text-sm mb-3">Thử dùng từ khóa khác hoặc reset tìm kiếm.</span>

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

      {/* {PAGINATION} */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2 flex flex-row">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePreButton()}
          >
            <ChevronsLeft size={28} strokeWidth={2.25} />
          </Button>
          <div className="flex gap-0.5 mt-0">
            {Array.from({ length: totalPages }, (_, i) => {
              const pageNum = i + 1;
              const isActive = pageNum === page;

              return (
                <div
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={
                    `cursor-pointer px-3 py-1 rounded border 
                    ${isActive ? "bg-blue-600 text-white" : "bg-white"}`
                  }
                >
                  {pageNum}
                </div>
              );
            })}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleNextButton()}
          >
            <ChevronsRight size={28} strokeWidth={2.25} />
          </Button>
        </div>
      </div>
    </div>
  )
}
