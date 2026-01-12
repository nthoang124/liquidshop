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
import type { IOrder } from "@/types/order"
import { PaymentStatusSelect } from "./PaymentStatusSelect"
import { OrderStatusSelect } from "./OrderStatusSelect"
import Pagination from "../common/Pagination"


interface DataTableProps {
  orders: IOrder[];
  page: number;
  totalPages: number;
  setPage: (page: number) => void;

  search: string;
  setSearch: (search: string) => void;

  handleDetailOpen: (order: IOrder) => void;
  onChangeOrderStatus: (status: string, id: string) => void;

  orderStatusSelected: string;
  paymentSatusSelected: string;
  setOrderStatusSelected: (value: string) => void;
  setPaymentStatusSelected: (value: string) => void;
}

export function OrdersTable({
  orders, page, totalPages, setPage,
  search, setSearch,
  handleDetailOpen,
  onChangeOrderStatus,
  orderStatusSelected, paymentSatusSelected,
  setOrderStatusSelected, setPaymentStatusSelected
}: DataTableProps) {

  const table = useReactTable({
    data: orders,
    columns: columns({
      onOpenDetail: handleDetailOpen,
      onChangeOrderStatus: onChangeOrderStatus,
    }),
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full">
      
      {/* FILTER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 py-4">

        <Input
          placeholder="Tìm kiếm theo mã đơn hàng, tên khách hàng, sdt"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md w-full bg-white text-sm"
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
      <div className="overflow-hidden rounded-sm bg-white">
        <Table>
          <TableHeader className="bg-slate-50 h-16">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-sm sm:text-base font-bold">
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
                    index % 2 === 0 ? "bg-white" : "bg-white"
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
                <TableCell colSpan={columns({onOpenDetail: handleDetailOpen, onChangeOrderStatus: onChangeOrderStatus}).length}>
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
      <Pagination page={page} setPage={setPage} totalPages={totalPages}/>
    </div>
  );
}
