import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { SearchX } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow
} from "@/components/ui/table"

import { columns } from "./columns"
import type { IPromotion } from "@/types/promotion"
import PromotionStatusSelect from "./PromotionStatusSelect"
import Pagination from "../common/Pagination"

interface DataTableProps {
  promotions: IPromotion[];
  page: number;
  totalPages: number;
  setPage: (page: number) => void;
  handleDetailOpen: (promotion: IPromotion) => void;
  status: string;
  setStatus: (value: string) => void;
  onDelete: (id: string) => void;
}

export function PromotionsTable({
  promotions, page, totalPages, setPage,
  handleDetailOpen,
  status, setStatus,
  onDelete,
}: DataTableProps) {

  const table = useReactTable({
    data: promotions,
    columns: columns(handleDetailOpen, onDelete),
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full">
      
      {/* FILTER BAR */}
      <div className="flex items-center justify-end py-3">
        <PromotionStatusSelect
          value={status}
          onChange={(val) => setStatus(val)}
        />
      </div>

      {/* TABLE */}
      <div className="overflow-hidden bg-white">
        <Table>
          <TableHeader className="bg-[#F7FAFC] h-15">
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
            {promotions.length > 0 ? (
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
                        setStatus("all");
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
