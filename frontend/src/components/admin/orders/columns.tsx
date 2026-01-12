import type { ColumnDef } from "@tanstack/react-table"
import type { IOrder } from "@/types/order"

import { formatVND } from "@/utils/admin/formatMoney";
import { formatDate } from "@/utils/formatDate";
import { getPaymentStatusLabel, ORDER_STATUS } from "@/utils/admin/mapOrderDetail";
import { PaymentStatusBadge } from "./payment-status-badge";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface OrdersColumnProps {
  onOpenDetail: (order: IOrder) => void;
  onChangeOrderStatus: (status: string, id: string) => void;
}

export const columns = ({onOpenDetail, onChangeOrderStatus} : OrdersColumnProps): ColumnDef<IOrder>[] => [
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
                <span className="text-xs md:text-[0.78rem] text-slate-400 font-medium">{customer.email}</span>
            </div>
       )
    }
  },
  {
    accessorKey: "totalAmount",
    header: () => {
      return (
        <span className="text-sm md:text-base">
          Tổng tiền
        </span>
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
        const orderStatus = row.getValue("orderStatus") as 
        | "pending_confirmation"
        | "processing"
        | "shipping"
        | "completed"
        | "cancelled";
        return (
          <Select
            value={orderStatus}
            onValueChange={(value) =>
              onChangeOrderStatus(
                value as
                  | "pending_confirmation"
                  | "processing"
                  | "shipping"
                  | "completed"
                  | "cancelled",
                row.original._id
              )
            }
          >
            <SelectTrigger 
              className="
                h-8 w-full
                text-xs md:text-[0.85rem]
                rounded-sm
                border border-slate-300
                bg-white
                hover:bg-slate-50
                ring-offset-0
                focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
                data-[state=open]:ring-2 data-[state=open]:ring-blue-500
              "
            >
              <SelectValue placeholder="Trạng thái đơn hàng" />
            </SelectTrigger>
            <SelectContent 
              className="
              text-sm rounded-md
              border border-slate-200
              bg-white
              shadow-lg"
            >
              {Object.entries(ORDER_STATUS).map(([value, label]) => (
                <SelectItem 
                  key={value} 
                  value={value}
                  className="
                    text-xs md:text-sm
                    cursor-pointer
                    px-2 py-2
                    focus:bg-blue-50
                    focus:text-blue-700
                  "
                >
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
        </Select>
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
        <PaymentStatusBadge status={paymentStatus} label={label}/>
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