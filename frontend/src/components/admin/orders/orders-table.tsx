import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ChevronsRight, ChevronsLeft, SearchX } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow
} from "@/components/ui/table"

import { columns } from "./columns"
import type { IOrder } from "@/types/order"
import { PaymentStatusSelect } from "./PaymentStatusSelect"
import { OrderStatusSelect } from "./OrderStatusSelect"


interface DataTableProps {
  orders: IOrder[];
  page: number;
  totalPages: number;
  setPage: (page: number) => void;

  search: string;
  setSearch: (search: string) => void;

  handleDetailOpen: (order: IOrder) => void;

  orderStatusSelected: string;
  paymentSatusSelected: string;
  setOrderStatusSelected: (value: string) => void;
  setPaymentStatusSelected: (value: string) => void;
}

export function OrdersTable({
  orders, page, totalPages, setPage,
  search, setSearch,
  handleDetailOpen,
  orderStatusSelected, paymentSatusSelected,
  setOrderStatusSelected, setPaymentStatusSelected
}: DataTableProps) {

  const table = useReactTable({
    data: orders,
    columns: columns(handleDetailOpen),
    getCoreRowModel: getCoreRowModel(),
  });

  const prevPage = () => page > 1 && setPage(page - 1);
  const nextPage = () => page < totalPages && setPage(page + 1);

  return (
    <div className="w-full">
      
      {/* FILTER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 py-4">
        <Input
          placeholder="Tìm kiếm theo mã đơn hàng, tên khách hàng, sdt"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm bg-white text-md"
        />

        <div className="flex flex-row gap-1">
          <PaymentStatusSelect
            value={paymentSatusSelected}
            onChange={setPaymentStatusSelected}
          />
          <OrderStatusSelect
            value={orderStatusSelected}
            onChange={setOrderStatusSelected}
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-md border bg-white">
        <Table>
          <TableHeader className="bg-blue-100">
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
            {orders.length > 0 ? (
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  className={`text-md sm:text-base ${
                    index % 2 === 0 ? "bg-white" : "bg-slate-100"
                  }`}
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
                <TableCell colSpan={columns(handleDetailOpen).length}>
                  <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground">
                    <SearchX className="w-12 h-12 mb-3 opacity-70" />
                    <span className="text-lg font-semibold">Không tìm thấy dữ liệu</span>
                    <span className="text-sm mb-3">Thử dùng từ khóa khác hoặc reset tìm kiếm.</span>

                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearch("");
                        setPaymentStatusSelected("all");
                        setOrderStatusSelected("all");
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
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button variant="outline" size="sm" onClick={prevPage}>
          <ChevronsLeft size={28} strokeWidth={2.25} />
        </Button>

        <div className="flex gap-1">
          {Array.from({ length: totalPages }, (_, i) => {
            const num = i + 1;
            return (
              <button
                key={num}
                onClick={() => setPage(num)}
                className={`px-3 py-1 rounded border ${
                  page === num ? "bg-blue-600 text-white" : "bg-white"
                }`}
              >
                {num}
              </button>
            );
          })}
        </div>

        <Button variant="outline" size="sm" onClick={nextPage}>
          <ChevronsRight size={28} strokeWidth={2.25} />
        </Button>
      </div>
    </div>
  );
}
