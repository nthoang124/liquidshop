import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle, ShoppingBag, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatVND } from "@/utils/admin/formatMoney";
import { orderService } from "@/services/api/customer/order.service";

const OrderSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderCode = searchParams.get("code");

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderCode) {
      navigate("/");
      return;
    }

    const fetchOrder = async () => {
      try {
        const res: any = await orderService.getOrderByCode(orderCode);
        if (res && res.order) {
          setOrder(res.order);
        }
      } catch (error) {
        console.error("Lỗi lấy thông tin đơn hàng", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderCode, navigate]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-red-600 w-8 h-8" />
      </div>
    );
  }

  // API lỗi hoặc mã sai
  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <p className="text-slate-500 mb-4">Không tìm thấy thông tin đơn hàng</p>
        <Button onClick={() => navigate("/")}>Về trang chủ</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 md:p-12 rounded-2xl shadow-lg max-w-lg w-full text-center animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>

        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Đặt hàng thành công!
        </h1>
        <p className="text-slate-500 mb-6">
          Cảm ơn bạn đã mua sắm. Đơn hàng <strong>#{order.orderCode}</strong>{" "}
          đang được xử lý.
        </p>

        {/* Tóm tắt đơn hàng */}
        <Card className="bg-slate-50 border-dashed border-2 mb-8">
          <CardContent className="p-4 text-sm space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-500">Phương thức:</span>
              <span className="font-medium">{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Tổng thanh toán:</span>
              <span className="font-bold text-red-600 text-lg">
                {formatVND(order.totalAmount)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Giao đến:</span>
              <span className="font-medium text-right w-1/2 truncate">
                {order.customerInfo.shippingAddress.street
                  ? `${order.customerInfo.shippingAddress.street}, `
                  : " "}
                {order.customerInfo.shippingAddress.ward
                  ? `${order.customerInfo.shippingAddress.ward}, `
                  : " "}
                {order.customerInfo.shippingAddress.district
                  ? `${order.customerInfo.shippingAddress.district}, `
                  : " "}
                {order.customerInfo.shippingAddress.city
                  ? `${order.customerInfo.shippingAddress.city}`
                  : " "}
              </span>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-3">
          <Button
            className="w-full bg-slate-900 hover:bg-slate-800 h-11"
            onClick={() => navigate(`/orders/${order.orderCode}`)}
          >
            Xem chi tiết đơn hàng <ArrowRight className="w-4 h-4 ml-2" />
          </Button>

          <Button
            variant="outline"
            className="w-full h-11"
            onClick={() => navigate("/")}
          >
            <ShoppingBag className="w-4 h-4 mr-2" /> Tiếp tục mua sắm
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
