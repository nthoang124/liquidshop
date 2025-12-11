import type { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"
import type { IOrder } from "@/types/order"

import { formatVND } from "@/utils/admin/formatMoney";
import { formatDate } from "@/utils/formatDate";
import { formatOrderStatus } from "@/utils/admin/orderStatusUtils";


export const columns = (onOpenDetail: (order: IOrder) => void): ColumnDef<IOrder>[] => [
  {
    accessorKey: "orderCode",
    header: "Mã đơn hàng",
    cell: ({ row }) => {
        const order = row.original;
        return (
            <button
                className="text-black hover:underline font-bold"
                onClick={() => onOpenDetail(order)}
            >
                {row.getValue("orderCode")}
            </button>
        )
    }
  },
  {
    accessorKey: "customerInfo",
    header: "Khách hàng",
    cell: ({ row }) => {
       const customer = row.original.customerInfo;
       return (
            <div className="flex flex-col">
                <span className="font-medium">{customer.fullName}</span>
                <span className="text-sm text-gray-600">{customer.email}</span>
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
          className="text-md sm:text-lg font-bold hover:bg-blue-200"
        >
          Tổng tiền
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => { 
        const amount = row.getValue("totalAmount") as number;
        return (
            <span className="text-green-600 text-md md:text-lg font-bold">{formatVND(amount)}</span>
        )
    }
  },
  {
    accessorKey: "orderStatus",
    header: ("Trạng thái đơn hàng"),
    cell: ({ row }) => {
        const formatedStatus = formatOrderStatus(row.getValue("orderStatus"));
        return (
            <div> {formatedStatus}</div> 
        )
    }
  },
  {
    accessorKey: "paymentStatus",
    header: ("Thanh toán"),
    cell: ({ row }) => { 
      const paymentStatus = row.getValue("paymentStatus");
      return (
      <div className={
        `w-20 px-1 py-1 rounded-xl text-sm md:text-md text-white text-center ` + 
        (paymentStatus === "paid" ? "bg-green-500" : paymentStatus === "pending" ? "bg-yellow-500" : "bg-red-500" )
        }>
          {row.getValue("paymentStatus")}
      </div> 
      );
    }
  },
  {
    accessorKey: "createdAt",
    header: ("Ngày đặt"),
    cell: ({ row }) => {
        const dateStr = row.getValue("createdAt") as string
        const dateFormat = formatDate(dateStr);
        return (
            <div>{dateFormat}</div> 
        )
    }
  },
]