import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Package, Calendar, Loader2, Box } from "lucide-react";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

import { formatVND } from "@/utils/admin/formatMoney";
import { orderService } from "@/services/api/customer/order.service";
import { type IOrder } from "@/types/order";

// Helper chọn màu Badge cho Dark Mode
const getStatusInfo = (status: string) => {
  switch (status) {
    case "pending_confirmation":
      return {
        label: "Chờ xác nhận",
        className: "bg-orange-500/10 text-orange-500 border-orange-500/20",
      };
    case "processing":
      return {
        label: "Đang xử lý",
        className: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      };
    case "shipping":
      return {
        label: "Đang giao",
        className: "bg-purple-500/10 text-purple-500 border-purple-500/20",
      };
    case "completed":
      return {
        label: "Hoàn thành",
        className: "bg-green-500/10 text-green-500 border-green-500/20",
      };
    case "cancelled":
      return {
        label: "Đã hủy",
        className: "bg-red-500/10 text-red-500 border-red-500/20",
      };
    default:
      return {
        label: status,
        className: "bg-neutral-800 text-neutral-400 border-neutral-700",
      };
  }
};

const getPaymentStatusInfo = (status: string) => {
  switch (status) {
    case "paid":
      return { label: "Đã thanh toán", color: "text-green-500" };
    case "pending":
      return { label: "Chưa thanh toán", color: "text-orange-500" };
    case "failed":
      return { label: "Thất bại", color: "text-red-500" };
    default:
      return { label: status, color: "text-neutral-500" };
  }
};

const MyOrders: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res: any = await orderService.getMyOrders();
        if (res && res.data) {
          // Sắp xếp đơn mới nhất lên đầu
          const sortedOrders = res.data.sort(
            (a: IOrder, b: IOrder) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          setOrders(sortedOrders);
        }
      } catch (error) {
        console.error(error);
        toast.error("Không thể tải lịch sử đơn hàng");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    if (activeTab === "all") return true;
    return order.orderStatus === activeTab;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-red-600" />
      </div>
    );
  }

  return (
    <Card className="bg-[#151517] border-neutral-800 text-slate-200 shadow-xl min-h-[600px]">
      <CardHeader className="border-b border-neutral-800 pb-6">
        <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
          <Package className="w-6 h-6 text-red-500" /> Đơn mua
        </CardTitle>
        <CardDescription className="text-neutral-400">
          Theo dõi trạng thái và lịch sử mua sắm của bạn
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-6">
        {/* Tabs Filter */}
        <Tabs
          defaultValue="all"
          value={activeTab}
          onValueChange={setActiveTab}
          className="mb-6"
        >
          <TabsList className="bg-[#2a2a2c] p-1 border border-neutral-800 h-auto flex-wrap justify-start w-full sm:w-auto">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-neutral-700 data-[state=active]:text-white text-neutral-400"
            >
              Tất cả
            </TabsTrigger>
            <TabsTrigger
              value="pending_confirmation"
              className="data-[state=active]:bg-neutral-700 data-[state=active]:text-white text-neutral-400"
            >
              Chờ xác nhận
            </TabsTrigger>
            <TabsTrigger
              value="processing"
              className="data-[state=active]:bg-neutral-700 data-[state=active]:text-white text-neutral-400"
            >
              Đang xử lý
            </TabsTrigger>
            <TabsTrigger
              value="shipping"
              className="data-[state=active]:bg-neutral-700 data-[state=active]:text-white text-neutral-400"
            >
              Đang giao
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className="data-[state=active]:bg-neutral-700 data-[state=active]:text-white text-neutral-400"
            >
              Hoàn thành
            </TabsTrigger>
            <TabsTrigger
              value="cancelled"
              className="data-[state=active]:bg-neutral-700 data-[state=active]:text-white text-neutral-400"
            >
              Đã hủy
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Order List */}
        <div className="space-y-4">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => {
              const statusInfo = getStatusInfo(order.orderStatus);
              const paymentStatusInfo = getPaymentStatusInfo(
                order.paymentStatus
              );

              return (
                <div
                  key={order._id}
                  className="border border-neutral-800 rounded-lg bg-[#1e1e20] overflow-hidden hover:border-neutral-600 transition-colors"
                >
                  {/* Header của mỗi Card đơn hàng */}
                  <div className="p-4 border-b border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-[#252527]">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-white">
                        #{order.orderCode}
                      </span>
                      <span className="text-neutral-600">|</span>
                      <div className="text-sm text-neutral-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={`${statusInfo.className} font-normal border`}
                    >
                      {statusInfo.label}
                    </Badge>
                  </div>

                  {/* Body của Card đơn hàng */}
                  <div className="p-4">
                    <div className="space-y-3 mb-4">
                      {order.items.slice(0, 2).map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4">
                          {/* Placeholder ảnh nếu backend chưa trả về image */}
                          <div className="w-16 h-16 bg-[#2a2a2c] rounded border border-neutral-700 flex items-center justify-center text-xs text-neutral-500 shrink-0">
                            IMG
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-slate-200 line-clamp-1">
                              {item.name}
                            </p>
                            <p className="text-sm text-neutral-500">
                              x{item.quantity}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-slate-300">
                              {formatVND(item.price)}
                            </p>
                          </div>
                        </div>
                      ))}
                      {order.items.length > 2 && (
                        <p className="text-xs text-neutral-500 italic pt-1">
                          + {order.items.length - 2} sản phẩm khác
                        </p>
                      )}
                    </div>

                    <Separator className="bg-neutral-800 my-4" />

                    <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center gap-4">
                      <div className="text-sm">
                        <span className="text-neutral-500 mr-2">
                          Thanh toán:
                        </span>
                        <span
                          className={`font-medium ${paymentStatusInfo.color}`}
                        >
                          {paymentStatusInfo.label}
                        </span>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-xs text-neutral-500">Tổng tiền</p>
                          <p className="text-lg font-bold text-red-500">
                            {formatVND(order.totalAmount)}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          className="ml-2 border-neutral-600 text-neutral-300 hover:bg-neutral-800 hover:text-white bg-transparent"
                          onClick={() => navigate(`/orders/${order.orderCode}`)}
                        >
                          Chi tiết
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-20 flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-neutral-800 rounded-full flex items-center justify-center mb-4">
                <Box className="w-10 h-10 text-neutral-600" />
              </div>
              <h3 className="text-lg font-medium text-white">
                Chưa có đơn hàng nào
              </h3>
              <p className="text-neutral-500 mb-6 max-w-xs mx-auto">
                Bạn chưa có đơn hàng nào trong trạng thái này. Hãy dạo một vòng
                cửa hàng nhé!
              </p>
              <Button
                onClick={() => navigate("/")}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Mua sắm ngay
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MyOrders;
