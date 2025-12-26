import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { SearchX } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow
} from "@/components/ui/table"

import { columns } from "./columns"
import type { IReview } from "@/types/review"
import { EnumSelect } from "./EnumSelect"
import Pagination from "../common/Pagination"


interface DataTableProps {
  reviews: IReview[];
  page: number;
  totalPages: number;
  setPage: (page: number) => void;

  search: string;
  setSearch: (search: string) => void;

  handleDetailOpen: (review: IReview) => void;

  status: string;
  rating: number | null;
  setStatus: (value: string) => void;
  setRating: (value: number | null) => void;
  onDelete: (id: string) => void;
}


export function ReviewsTable({
  reviews, page, totalPages, setPage,
  search, setSearch,
  handleDetailOpen,
  status, rating, setStatus, setRating,
  onDelete,
}: DataTableProps) {

  const table = useReactTable({
    data: reviews,
    columns: columns(handleDetailOpen, onDelete),
    getCoreRowModel: getCoreRowModel(),
  });

  const RATING_OPTIONS = [
    { value: "all", label: "Đánh giá" },
    { value: "5", label: "5⭐" },
    { value: "4", label: "4⭐" },
    { value: "3", label: "3⭐" },
    { value: "2", label: "2⭐" },
    { value: "1", label: "1⭐" },
  ] as const

  const STATUS_OPTIONS = [
    { value: "all", label: "Trạng thái" },
    { value: "pending", label: "Xem xét" },
    { value: "approved", label: "Đã duyệt" },
    { value: "rejected", label: "Từ chối" },
  ]

  return (
    <div className="w-full">
      
      {/* FILTER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 py-4">
        <Input
          placeholder="Tìm kiếm theo tên sản phẩm, tên khách hàng"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm bg-white text-md"
        />
        <div className="flex flex-row gap-1">
            <EnumSelect
                value={rating === null ? "all" : rating.toString()}
                options={RATING_OPTIONS}
                placeholder="Đánh giá"
                onChange={(val) =>
                    setRating(val === "all" ? null : Number(val))
                }
            />
            <EnumSelect
                value={status}
                options={STATUS_OPTIONS}
                placeholder="Trạng thái"
                onChange={(val) => setStatus(val)}
            />
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-xs bg-white">
        <Table>
          <TableHeader className="bg-slate-50 h-16">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-md sm:text-lg font-bold">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {reviews.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="text-md sm:text-base"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns(handleDetailOpen, onDelete).length}>
                  <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground">
                    <SearchX className="w-12 h-12 mb-3 opacity-70" />
                    <span className="text-lg font-semibold">Không tìm thấy dữ liệu</span>
                    <span className="text-sm mb-3">Thử dùng từ khóa khác hoặc reset tìm kiếm.</span>

                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearch("");
                        setStatus("all");
                        setRating(null);
                      }}
                    >
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
