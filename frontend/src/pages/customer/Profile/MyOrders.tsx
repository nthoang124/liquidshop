import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Package,
  Calendar,
  Loader2,
  Search,
  Box,
  X,
  RotateCcw,
} from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

import { formatVND } from "@/utils/admin/formatMoney";
import { orderService } from "@/services/api/customer/order.service";
import { type IOrder } from "@/types/order";
import CancelOrderDialog from "@/pages/order/CancelDialog";
import PaginationCustom from "@/components/common/Pagination";

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
  const ITEMS_PER_PAGE = 5;

  const navigate = useNavigate();

  // State
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [searchCode, setSearchCode] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  // Ref để lưu danh sách gốc (Backup) nhằm tránh phải gọi API lại khi xóa tìm kiếm
  const originalOrdersRef = useRef<IOrder[]>([]);

  // 1. Fetch toàn bộ đơn hàng khi vào trang
  const fetchAllOrders = async () => {
    setLoading(true);
    try {
      const res: any = await orderService.getMyOrders();
      if (res && res.data) {
        const sortedOrders = res.data.sort(
          (a: IOrder, b: IOrder) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setOrders(sortedOrders);
        originalOrdersRef.current = sortedOrders; // Lưu backup
      }
    } catch (error) {
      console.error(error);
      toast.error("Không thể tải lịch sử đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  // 2. Tìm kiếm đơn hàng
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchCode.trim()) return;

    setLoading(true);
    setIsSearching(true);

    try {
      const res: any = await orderService.getOrderByCode(searchCode.trim());

      if (res && res.order) {
        setOrders([res.order]);
      } else {
        setOrders([]);
      }
    } catch (error: any) {
      setOrders([]);
      toast.error(error.response?.data?.message || "Không tìm thấy đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  const handleResetSearch = () => {
    setSearchCode("");
    setIsSearching(false);
    setOrders(originalOrdersRef.current); // Khôi phục lại danh sách gốc từ backup
  };

  // Logic lọc theo Tab (Chỉ chạy khi không tìm kiếm)
  const filteredOrders = orders.filter((order) => {
    if (activeTab === "all") return true;
    return order.orderStatus === activeTab;
  });

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const currentItems = filteredOrders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Card className="bg-[#151517] border-neutral-800 text-slate-200 shadow-xl min-h-[600px]">
      <CardHeader className="border-b border-neutral-800 pb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
              <Package className="w-6 h-6 text-red-500" /> Đơn mua
            </CardTitle>
            <CardDescription className="text-neutral-400 mt-1">
              Quản lý và theo dõi đơn hàng của bạn
            </CardDescription>
          </div>

          {/* --- THANH TÌM KIẾM --- */}
          <form
            onSubmit={handleSearch}
            className="flex w-full md:w-auto items-center gap-2"
          >
            <div className="relative w-full md:w-[250px]">
              <Input
                placeholder="Nhập mã đơn hàng (VD: ORD123...)"
                className="bg-[#2a2a2c] border-neutral-700 text-white placeholder:text-neutral-500 pr-8 focus:border-red-500"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
              />
              {searchCode && (
                <X
                  className="w-4 h-4 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer hover:text-white"
                  onClick={() => setSearchCode("")}
                />
              )}
            </div>
            <Button
              type="submit"
              variant="secondary"
              className="bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
            </Button>
          </form>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        {/* Nếu đang tìm kiếm thì hiện nút quay lại */}
        {isSearching && (
          <div className="flex items-center justify-between mb-4 bg-blue-500/10 border border-blue-500/20 p-3 rounded-md">
            <span className="text-sm text-blue-400">
              Kết quả tìm kiếm cho:{" "}
              <span className="font-bold text-white">{searchCode}</span>
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetSearch}
              className="text-neutral-400 hover:text-white h-8"
            >
              <RotateCcw className="w-3 h-3 mr-2" /> Xem tất cả
            </Button>
          </div>
        )}

        {/* Tabs Filter (Ẩn khi đang tìm kiếm để tránh rối) */}
        {!isSearching && (
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
        )}

        {/* Loading State */}
        {loading && !isSearching ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-red-600" />
          </div>
        ) : (
          /* Order List */
          <div className="space-y-4">
            {currentItems.length > 0 ? (
              currentItems.map((order) => {
                const statusInfo = getStatusInfo(order.orderStatus);
                const paymentStatusInfo = getPaymentStatusInfo(
                  order.paymentStatus
                );

                return (
                  <div
                    key={order._id}
                    className="border border-neutral-800 rounded-lg bg-[#1e1e20] overflow-hidden hover:border-neutral-600 transition-colors animate-in fade-in zoom-in duration-300"
                  >
                    <div className="p-4 border-b border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-[#252527]">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-white">
                          #{order.orderCode}
                        </span>
                        <span className="text-neutral-600">|</span>
                        <div className="text-sm text-neutral-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(order.createdAt).toLocaleDateString(
                            "vi-VN"
                          )}
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={`${statusInfo.className} font-normal border`}
                      >
                        {statusInfo.label}
                      </Badge>
                    </div>

                    <div className="p-4">
                      <div className="space-y-3 mb-4">
                        {order.items.slice(0, 2).map((item, idx) => (
                          <div key={idx} className="flex items-center gap-4">
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
                            <p className="text-xs text-neutral-500">
                              Tổng tiền
                            </p>
                            <p className="text-lg font-bold text-red-500">
                              {formatVND(order.totalAmount)}
                            </p>
                          </div>

                          {/* Nút Chi tiết */}
                          <Button
                            variant="outline"
                            className="ml-2 border-neutral-600 text-neutral-300 hover:bg-neutral-800 hover:text-white bg-transparent"
                            onClick={() =>
                              navigate(`/orders/${order.orderCode}`)
                            }
                          >
                            Chi tiết
                          </Button>

                          {/* Hủy Đơn Dialog*/}
                          {order.orderStatus === "pending_confirmation" && (
                            <CancelOrderDialog
                              orderCode={order.orderCode}
                              variant="ghost"
                              onSuccess={() => {
                                setOrders((prev) =>
                                  prev.map((o) =>
                                    o.orderCode === order.orderCode
                                      ? { ...o, orderStatus: "cancelled" }
                                      : o
                                  )
                                );
                              }}
                            />
                          )}
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
                  {isSearching
                    ? "Không tìm thấy đơn hàng"
                    : "Chưa có đơn hàng nào"}
                </h3>
                <p className="text-neutral-500 mb-6 max-w-xs mx-auto">
                  {isSearching
                    ? "Vui lòng kiểm tra lại mã đơn hàng."
                    : "Bạn chưa có đơn hàng nào trong mục này."}
                </p>
                {!isSearching && (
                  <Button
                    onClick={() => navigate("/")}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    Mua sắm ngay
                  </Button>
                )}
                {isSearching && (
                  <Button
                    variant="outline"
                    onClick={handleResetSearch}
                    className="border-neutral-700 text-white hover:bg-neutral-800"
                  >
                    Quay lại danh sách
                  </Button>
                )}
              </div>
            )}
            <PaginationCustom
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MyOrders;
