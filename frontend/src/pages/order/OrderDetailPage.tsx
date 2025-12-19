import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  CreditCard,
  Package,
  Loader2,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

import { formatVND } from "@/utils/admin/formatMoney";
import { orderService } from "@/services/api/customer/order.service";
import { type IOrder } from "@/types/order";

import CancelOrderDialog from "./CancelDialog";

const OrderDetailPage: React.FC = () => {
  const { code } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState<IOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    if (!code) return;
    const fetchOrder = async () => {
      try {
        const res: any = await orderService.getOrderByCode(code);
        if (res && res.order) {
          setOrder(res.order);
        }
      } catch (error) {
        toast.error("Không tìm thấy đơn hàng");
        navigate("/profile/orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [code, navigate]);

  // Xử lý thanh toán lại (Re-payment)
  const handleRepayment = async () => {
    if (!order) return;
    setProcessingPayment(true);
    try {
      // Logic: Nếu là OnlineGateway thì mặc định gọi lại provider cũ (VNPAY/Momo)
      const provider =
        order.paymentMethod === "OnlineGateway" ? "VNPAY" : undefined;

      const res: any = await orderService.createPaymentUrl({
        orderCode: order.orderCode,
        paymentMethod: order.paymentMethod,
        paymentProvider: provider,
      });

      if (res && res.paymentUrl) {
        window.location.href = res.paymentUrl;
      } else {
        toast.success("Đơn hàng đã được cập nhật phương thức thanh toán");
        window.location.reload();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Lỗi tạo thanh toán");
    } finally {
      setProcessingPayment(false);
    }
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-red-600 w-8 h-8" />
      </div>
    );
  if (!order) return null;

  const renderStatus = () => {
    const steps = [
      { key: "pending_confirmation", label: "Chờ xác nhận", icon: Clock },
      { key: "processing", label: "Đang xử lý", icon: Package },
      { key: "shipping", label: "Đang giao", icon: Truck },
      { key: "completed", label: "Hoàn thành", icon: CheckCircle2 },
    ];

    // Logic để xác định active step (Có thể cải thiện ?)
    const currentIdx = steps.findIndex((s) => s.key === order.orderStatus);
    const isCancelled = order.orderStatus === "cancelled";

    if (isCancelled) {
      return (
        <div className="bg-red-50 p-4 rounded-lg flex items-center gap-2 text-red-700 border border-red-200 mb-6">
          <XCircle className="w-5 h-5" />
          <span className="font-bold">Đơn hàng đã bị hủy</span>
        </div>
      );
    }

    return (
      <div className="flex justify-between items-center mb-8 relative px-4">
        {/* Progress Bar Background */}
        <div className="absolute left-0 top-1/2 w-full h-1 bg-gray-200 -z-10" />

        {steps.map((step, index) => {
          const isActive = index <= currentIdx;
          const Icon = step.icon;
          return (
            <div
              key={step.key}
              className="flex flex-col items-center bg-slate-50 px-2"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                  isActive
                    ? "bg-red-600 border-red-600 text-white"
                    : "bg-white border-gray-300 text-gray-400"
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span
                className={`text-xs mt-2 font-medium ${
                  isActive ? "text-red-600" : "text-gray-500"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8 font-sans">
      <div className="container mx-auto max-w-5xl px-4">
        {/* Navigation */}
        <Button
          variant="ghost"
          onClick={() => navigate("/users/me")}
          className="mb-4 pl-0 hover:bg-transparent hover:text-red-600"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Quay lại danh sách
        </Button>

        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Chi tiết đơn hàng #{order.orderCode}
            </h1>
            <p className="text-slate-500 text-sm">
              Ngày đặt: {new Date(order.createdAt).toLocaleString("vi-VN")}
            </p>
          </div>
          <div className="flex gap-3">
            {/* Show Pay Button if Pending Payment */}
            {order.paymentStatus === "pending" &&
              order.orderStatus !== "cancelled" &&
              order.paymentMethod !== "COD" && (
                <Button
                  onClick={handleRepayment}
                  disabled={processingPayment}
                  className="bg-red-600 hover:bg-red-700 animate-pulse"
                >
                  {processingPayment ? (
                    <Loader2 className="animate-spin w-4 h-4" />
                  ) : (
                    "Thanh toán ngay"
                  )}
                </Button>
              )}
            {order.orderStatus === "pending_confirmation" && (
              <CancelOrderDialog
                orderCode={order.orderCode}
                onSuccess={() => window.location.reload()}
              />
            )}
          </div>
        </div>

        {renderStatus()}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-6">
            {/* List Items */}
            <Card className="border-none shadow-sm">
              <CardHeader className="bg-white border-b pb-3">
                <CardTitle className="text-base font-bold">Sản phẩm</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded border shrink-0 flex items-center justify-center text-xs text-gray-400">
                      IMG
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-slate-900 line-clamp-2">
                        {item.name}
                      </h4>
                      <p className="text-sm text-slate-500">SKU: {item.sku}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatVND(item.price)}</p>
                      <p className="text-sm text-slate-500">x{item.quantity}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Info Customer */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-none shadow-sm h-full">
                <CardHeader className="bg-white border-b pb-3">
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-red-600" /> Địa chỉ nhận
                    hàng
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 text-sm space-y-2">
                  <p className="font-bold text-slate-800">
                    {order.customerInfo.fullName}
                  </p>
                  <p className="text-slate-600">
                    {order.customerInfo.phoneNumber}
                  </p>
                  <p className="text-slate-600">
                    {order.customerInfo.shippingAddress.street},{" "}
                    {order.customerInfo.shippingAddress.ward},{" "}
                    {order.customerInfo.shippingAddress.district},{" "}
                    {order.customerInfo.shippingAddress.city}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm h-full">
                <CardHeader className="bg-white border-b pb-3">
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-red-600" /> Thông tin
                    thanh toán
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Phương thức:</span>
                    <span className="font-medium">{order.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Trạng thái:</span>
                    <Badge
                      variant={
                        order.paymentStatus === "paid" ? "default" : "secondary"
                      }
                      className={
                        order.paymentStatus === "paid" ? "bg-green-600" : ""
                      }
                    >
                      {order.paymentStatus === "paid"
                        ? "Đã thanh toán"
                        : "Chưa thanh toán"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* RIGHT COLUMN: Summary */}
          <div className="lg:col-span-1">
            <Card className="border-none shadow-sm sticky top-4">
              <CardHeader className="bg-slate-800 text-white pb-3 pt-4">
                <CardTitle className="text-base">Tổng quan đơn hàng</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Tạm tính</span>
                  <span>{formatVND(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Phí vận chuyển</span>
                  <span>{formatVND(order.shippingFee)}</span>
                </div>
                {order.discountAmount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Giảm giá</span>
                    <span>- {formatVND(order.discountAmount)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between items-end">
                  <span className="font-bold text-slate-800">Tổng cộng</span>
                  <span className="font-bold text-xl text-red-600">
                    {formatVND(order.totalAmount)}
                  </span>
                </div>

                {order.notes && (
                  <div className="mt-4 bg-yellow-50 p-3 rounded text-sm text-yellow-800 border border-yellow-200">
                    <span className="font-bold block mb-1">Ghi chú:</span>
                    {order.notes}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
