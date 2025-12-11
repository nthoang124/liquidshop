import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

import { formatDate } from "@/utils/formatDate";
import { formatVND } from "@/utils/admin/formatMoney";
import { Badge } from "@/components/ui/badge";

import type { IOrder } from "@/types/order";
import {
  getOrderStatusStyle,
  formatOrderStatus,
} from "@/utils/admin/orderStatusUtils";

interface OrderDetailDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  order: IOrder | null;
}

export default function OrderDetailDialog({
  open,
  setOpen,
  order,
}: OrderDetailDialogProps) {
  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-full max-w-md md:max-w-xl lg:max-w-2xl xl:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Chi tiết đơn hàng #{order.orderCode}
          </DialogTitle>
          <DialogDescription>
            Thông tin chi tiết về đơn hàng
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] pr-4">
          {/* --- Order status --- */}
          <div className="flex items-center gap-3 mb-4">
            <span className="font-medium">Trạng thái đơn hàng:</span>
            <Badge
              className={`${getOrderStatusStyle(order.orderStatus)} px-3 py-1`}
            >
              {formatOrderStatus(order.orderStatus)}
            </Badge>
          </div>

          {/* --- Customer Info --- */}
          <div className="border rounded-lg p-4 mb-4">
            <h3 className="text-lg font-semibold mb-2">Thông tin khách hàng</h3>

            <p><span className="font-medium">Họ tên:</span> {order.customerInfo.fullName}</p>
            <p><span className="font-medium">Email:</span> {order.customerInfo.email}</p>
            <p><span className="font-medium">Số điện thoại:</span> {order.customerInfo.phoneNumber}</p>

            <p className="mt-2 font-medium">Địa chỉ giao hàng:</p>
            {/* <p className="text-sm">
              {order.customerInfo.shippingAddress.street},{" "}
              {order.customerInfo.shippingAddress.ward},{" "}
              {order.customerInfo.shippingAddress.district},{" "}
              {order.customerInfo.shippingAddress.city}
            </p> */}
          </div>

          {/* --- Items List --- */}
          <div className="border rounded-lg p-4 mb-4">
            <h3 className="text-lg font-semibold mb-3">Sản phẩm</h3>

            <div className="space-y-3">
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center border-b pb-2"
                >
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">{item.sku}</p>
                    <p className="text-sm">
                      Số lượng: <span className="font-medium">{item.quantity}</span>
                    </p>
                  </div>
                  <p className="font-semibold">{formatVND(item.price)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* --- Payment Info --- */}
          <div className="border rounded-lg p-4 mb-4">
            <h3 className="text-lg font-semibold mb-2">Thanh toán</h3>

            <p>
              <span className="font-medium">Phương thức: </span>
              {order.paymentMethod === "COD" && "Thanh toán khi nhận hàng"}
              {order.paymentMethod === "BankTransfer" && "Chuyển khoản ngân hàng"}
              {order.paymentMethod === "OnlineGateway" && "Cổng thanh toán online"}
            </p>

            <p>
              <span className="font-medium">Trạng thái thanh toán: </span>
              {order.paymentStatus === "paid" ? (
                <Badge className="bg-green-100 text-green-700">Đã thanh toán</Badge>
              ) : order.paymentStatus === "failed" ? (
                <Badge className="bg-red-100 text-red-700">Thất bại</Badge>
              ) : (
                <Badge className="bg-yellow-100 text-yellow-700">Chờ thanh toán</Badge>
              )}
            </p>
          </div>

          {/* --- Summary --- */}
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3">Tổng kết</h3>

            <div className="flex justify-between">
              <span>Tạm tính:</span>
              <span>{formatVND(order.subtotal)}</span>
            </div>

            <div className="flex justify-between">
              <span>Phí vận chuyển:</span>
              <span>{formatVND(order.shippingFee)}</span>
            </div>

            {order.discountAmount > 0 && (
              <div className="flex justify-between text-red-600">
                <span>Giảm giá:</span>
                <span>- {formatVND(order.discountAmount)}</span>
              </div>
            )}

            <div className="flex justify-between font-bold text-lg mt-2">
              <span>Tổng thanh toán:</span>
              <span>{formatVND(order.totalAmount)}</span>
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="mt-4 p-3 border rounded-lg">
              <h4 className="font-semibold mb-1">Ghi chú từ khách hàng:</h4>
              <p className="text-gray-700">{order.notes}</p>
            </div>
          )}

          <p className="text-sm text-gray-500 mt-4">
            Ngày đặt: {formatDate(order.createdAt)}
          </p>
        </ScrollArea>

        <DialogFooter>
          <Button onClick={() => setOpen(false)}>Đóng</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
