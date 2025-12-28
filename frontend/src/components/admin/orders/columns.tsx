import type { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"
import type { IOrder } from "@/types/order"

import { formatVND } from "@/utils/admin/formatMoney";
import { formatDate } from "@/utils/formatDate";
import { formatOrderStatus } from "@/utils/admin/orderStatusUtils";
import { getPaymentStatusLabel } from "@/utils/admin/mapPaymentStatus";

export const columns = (onOpenDetail: (order: IOrder) => void): ColumnDef<IOrder>[] => [
  {
    accessorKey: "orderCode",
    header: () => (
      <span className="text-sm md:text-base">
        Mã đơn hàng
      </span>
    ),
    cell: ({ row }) => {
        const order = row.original;
        return (
            <button
                className="text-black hover:underline font-semibold text-[0.78rem] md:text-sm"
                onClick={() => onOpenDetail(order)}
            > 
                {row.getValue("orderCode")}
            </button>
        )
    }
  },
  {
    accessorKey: "customerInfo",
    header: () => (
      <span className="text-sm md:text-base">
        Khách hàng
      </span>
    ),
    cell: ({ row }) => {
       const customer = row.original.customerInfo;
       return (
            <div className="flex flex-col">
                <span className="font-medium text-[0.78rem] md:text-sm">{customer.fullName}</span>
                <span className="text-xs md:text-[0.78rem] text-gray-600">{customer.email}</span>
            </div>
       )
    }
  },
  {
    accessorKey: "totalAmount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-sm md:text-base font-bold hover:bg-blue-200"
        >
          Tổng tiền
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => { 
        const amount = row.getValue("totalAmount") as number;
        return (
            <span className="text-green-600 text-sm md:text-base font-bold">{formatVND(amount)}</span>
        )
    }
  },
  {
    accessorKey: "orderStatus",
    header: () => (
      <span className="text-sm md:text-base">
        Trạng thái đơn hàng
      </span>
    ),
    cell: ({ row }) => {
        const formatedStatus = formatOrderStatus(row.getValue("orderStatus"));
        return (
            <div className="text-sm md:text-[0.9rem]"> {formatedStatus}</div> 
        )
    }
  },
  {
    accessorKey: "paymentStatus",
    header: () => (
      <span className="text-sm md:text-base">
        Thanh toán
      </span>
    ),
    cell: ({ row }) => { 
      const paymentStatus = row.getValue("paymentStatus") as "paid" | "pending" | "failed";
      const label = getPaymentStatusLabel(paymentStatus)
      return (
      <div className={
        `w-fit px-1 py-1 rounded-xl text-[0.85rem] text-white text-center ` + 
        (paymentStatus === "paid" ? "bg-green-500" : paymentStatus === "pending" ? "bg-yellow-500" : "bg-red-500" )
        }>
          {label}
      </div> 
      );
    }
  },
  {
    accessorKey: "createdAt",
    header: () => (
      <span className="text-sm md:text-base">
        Ngày đặt
      </span>
    ),
    cell: ({ row }) => {
        const dateStr = row.getValue("createdAt") as string
        const dateFormat = formatDate(dateStr);
        return (
            <div className="text-sm text-muted-foreground">{dateFormat}</div> 
        )
    }
  },
]