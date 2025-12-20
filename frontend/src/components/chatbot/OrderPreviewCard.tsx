// Components/Chat/OrderPreviewCard.tsx
import React, { useEffect, useState } from "react";
import { orderService } from "@/services/api/customer/order.service";
import { type IOrder } from "@/types/order"; //
import { Loader2, Package, ChevronRight } from "lucide-react";
import { formatVND } from "@/utils/admin/formatMoney";
import { Button } from "../ui/button";

interface OrderPreviewCardProps {
  orderCode: string;
}

export const OrderPreviewCard: React.FC<OrderPreviewCardProps> = ({
  orderCode,
}) => {
  const [order, setOrder] = useState<IOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response: any = await orderService.getOrderByCode(orderCode);

        if (response && response.order) {
          setOrder(response.order);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Lỗi lấy đơn hàng:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (orderCode) fetchOrder();
  }, [orderCode]);

  // Hàm map trạng thái dựa trên interface IOrder
  const getStatusLabel = (status: IOrder["orderStatus"]) => {
    const statusMap: Record<string, { label: string; color: string }> = {
      pending_confirmation: {
        label: "Chờ xác nhận",
        color: "bg-amber-100 text-amber-700",
      },
      processing: { label: "Đang xử lý", color: "bg-blue-100 text-blue-700" },
      shipping: {
        label: "Đang giao hàng",
        color: "bg-indigo-100 text-indigo-700",
      },
      completed: { label: "Hoàn thành", color: "bg-green-100 text-green-700" },
      cancelled: { label: "Đã hủy", color: "bg-red-100 text-red-700" },
    };
    return (
      statusMap[status] || { label: status, color: "bg-gray-100 text-gray-700" }
    );
  };

  if (loading)
    return (
      <div className="flex items-center gap-2 p-3 border rounded-xl bg-white/50 animate-pulse w-full max-w-[280px]">
        <Loader2 className="w-4 h-4 animate-spin text-red-500" />
        <span className="text-xs text-gray-400">Đang kiểm tra đơn hàng...</span>
      </div>
    );

  if (error || !order) return null;

  const status = getStatusLabel(order.orderStatus);

  return (
    <div className="my-2 border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm w-full max-w-[280px] text-gray-800">
      {/* Header */}
      <div className="bg-gray-50 px-3 py-2 border-b border-gray-100 flex justify-between items-center">
        <div className="flex items-center gap-1.5">
          <Package className="w-3.5 h-3.5 text-red-600" />
          <span className="text-[10px] font-bold text-gray-500 uppercase">
            Thông tin đơn
          </span>
        </div>
        <span
          className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${status.color}`}
        >
          {status.label}
        </span>
      </div>

      {/* Content */}
      <div className="p-3">
        <div className="flex flex-col gap-2 mb-3">
          <div>
            <p className="text-xs text-gray-400">Mã đơn</p>
            <p className="text-sm font-bold truncate">{order.orderCode}</p>
          </div>
          <div>
            <p className="text-xs">Thanh toán</p>
            <p className="text-sm font-bold text-red-600">
              {formatVND(order.totalAmount)}
            </p>
          </div>
        </div>

        <Button
          onClick={() => (window.location.href = `/orders/${order.orderCode}`)}
          className="w-full flex items-center justify-center gap-1 bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold py-2 rounded-lg transition-colors"
        >
          XEM CHI TIẾT
          <ChevronRight className="w-3.5 h-3.5" />
        </Button>
      </div>

      {/* Footer */}
      <div className="px-3 py-1.5 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
        <span className="text-[9px] text-gray-400">
          {new Date(order.createdAt).toLocaleDateString("vi-VN")}
        </span>
        <span className="text-[9px] font-medium text-gray-500 italic">
          {order.paymentMethod === "COD" ? "Thanh toán COD" : "Chuyển khoản"}
        </span>
      </div>
    </div>
  );
};
