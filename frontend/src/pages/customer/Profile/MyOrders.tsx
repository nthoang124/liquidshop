import React, { useRef } from "react";
import { useNavigate, useLoaderData, useSearchParams } from "react-router-dom";
import { Package, Calendar, Search, Box, X, RotateCcw } from "lucide-react";

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
import { type IOrder } from "@/types/order";
import CancelOrderDialog from "@/pages/order/CancelDialog";
import PaginationCustom from "@/components/common/Pagination";
import ScrollToTop from "@/components/common/ScrollToTop";

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
        className: "bg-purple-500/10 text-purple-400 border-purple-500/20",
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
  const [searchParams, setSearchParams] = useSearchParams();
  const searchInputRef = useRef<HTMLInputElement>(null);

  // 1. Lấy dữ liệu từ Loader
  const { orders, isSearching, searchCode } = useLoaderData() as any;

  // 2. Lấy trạng thái hiện tại từ URL
  const activeTab = searchParams.get("status") || "all";
  const currentPage = Number(searchParams.get("page")) || 1;

  // 3. Logic lọc và phân trang (Client-side)
  const filteredOrders = orders.filter((order: IOrder) => {
    if (activeTab === "all") return true;
    return order.orderStatus === activeTab;
  });

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const currentItems = filteredOrders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // 4. Các hàm xử lý cập nhật URL
  const handlePageChange = (page: number) => {
    setSearchParams((prev) => {
      prev.set("page", page.toString());
      return prev;
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleTabChange = (value: string) => {
    setSearchParams((prev) => {
      prev.set("status", value);
      prev.set("page", "1");
      return prev;
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const value = searchInputRef.current?.value || "";
    if (!value.trim()) return;

    setSearchParams({ code: value.trim() });
  };

  const handleResetSearch = () => {
    if (searchInputRef.current) searchInputRef.current.value = "";
    setSearchParams({});
  };

  return (
    <Card className="bg-[#151517] border-neutral-800 text-slate-200 shadow-xl min-h-[600px]">
      <ScrollToTop />
      <CardHeader className="border-b border-neutral-800 pb-4 sm:pb-6 px-4 sm:px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <Package className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" /> Đơn mua
            </CardTitle>
            <CardDescription className="text-neutral-400 mt-1 text-sm sm:text-base">
              Quản lý và theo dõi đơn hàng của bạn
            </CardDescription>
          </div>

          <form
            onSubmit={handleSearch}
            className="flex w-full md:w-auto items-center gap-2"
          >
            <div className="relative flex-1 md:w-[250px]">
              <Input
                ref={searchInputRef}
                defaultValue={searchCode}
                placeholder="Mã đơn (VD: ORD123...)"
                className="bg-[#2a2a2c] border-neutral-700 text-white placeholder:text-neutral-500 pr-8 focus:border-red-500 text-sm h-9 sm:h-10"
              />
              {searchCode && (
                <X
                  className="w-4 h-4 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer hover:text-white"
                  onClick={handleResetSearch}
                />
              )}
            </div>
            <Button
              type="submit"
              variant="secondary"
              className="bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700 h-9 sm:h-10"
            >
              <Search className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </CardHeader>

      <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">
        {isSearching && (
          <div className="flex items-center justify-between mb-4 bg-blue-500/10 border border-blue-500/20 p-2 sm:p-3 rounded">
            <span className="text-xs sm:text-sm text-blue-400">
              Kết quả cho:{" "}
              <span className="font-bold text-white">{searchCode}</span>
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetSearch}
              className="text-neutral-400 hover:text-white h-7 sm:h-8 text-xs sm:text-sm"
            >
              <RotateCcw className="w-3 h-3 mr-1 sm:mr-2" /> Xem tất cả
            </Button>
          </div>
        )}

        {!isSearching && (
          <div className="w-full overflow-x-auto pb-2 mb-4 sm:mb-6 -mx-3 px-3 sm:mx-0 sm:px-0 no-scrollbar">
            <Tabs
              value={activeTab}
              onValueChange={handleTabChange}
              className="w-full"
            >
              <TabsList className="bg-[#2a2a2c] p-1 border border-neutral-800 h-auto inline-flex w-max sm:w-auto sm:flex-wrap rounded">
                {[
                  { value: "all", label: "Tất cả" },
                  { value: "pending_confirmation", label: "Chờ xác nhận" },
                  { value: "processing", label: "Đang xử lý" },
                  { value: "shipping", label: "Đang giao" },
                  { value: "completed", label: "Hoàn thành" },
                  { value: "cancelled", label: "Đã hủy" },
                ].map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="data-[state=active]:bg-neutral-700 data-[state=active]:text-white text-neutral-400 text-xs sm:text-sm px-3 py-1.5 cursor-pointer"
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        )}

        <div className="space-y-4">
          {currentItems.length > 0 ? (
            currentItems.map((order: IOrder) => {
              const statusInfo = getStatusInfo(order.orderStatus);
              const paymentStatusInfo = getPaymentStatusInfo(
                order.paymentStatus
              );

              return (
                <div
                  key={order._id}
                  className="border border-neutral-800 rounded bg-[#1e1e20] overflow-hidden hover:border-neutral-600 transition-colors"
                >
                  <div className="p-3 sm:p-4 border-b border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#252527]">
                    <div className="flex items-start sm:items-center gap-2 sm:gap-3 flex-col sm:flex-row">
                      <span className="font-bold text-white text-sm sm:text-base">
                        #{order.orderCode}
                      </span>
                      <span className="hidden sm:inline text-neutral-600">
                        |
                      </span>
                      <div className="text-xs sm:text-sm text-neutral-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={`${statusInfo.className} font-normal border text-xs sm:text-sm whitespace-nowrap`}
                    >
                      {statusInfo.label}
                    </Badge>
                  </div>

                  <div className="p-3 sm:p-4">
                    <div className="space-y-3 mb-4">
                      {order.items.slice(0, 2).map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-3 sm:gap-4"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-slate-200 text-sm sm:text-base line-clamp-1">
                              {item.name}
                            </p>
                            <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
                              x{item.quantity}
                            </p>
                          </div>
                          <div className="text-right whitespace-nowrap">
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

                    <Separator className="bg-neutral-800 my-3 sm:my-4" />

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="text-xs sm:text-sm w-full sm:w-auto flex justify-between sm:block">
                        <span className="text-neutral-500 mr-2">
                          Thanh toán:
                        </span>
                        <span
                          className={`font-medium ${paymentStatusInfo.color}`}
                        >
                          {paymentStatusInfo.label}
                        </span>
                      </div>

                      <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
                        <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                          <span className="text-xs text-neutral-500 sm:hidden">
                            Tổng tiền:
                          </span>
                          <div className="text-right">
                            <p className="hidden sm:block text-xs text-neutral-500">
                              Tổng tiền
                            </p>
                            <p className="text-base sm:text-lg font-bold text-red-500">
                              {formatVND(order.totalAmount)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-2 w-full sm:w-auto">
                          {order.orderStatus === "pending_confirmation" && (
                            <CancelOrderDialog
                              orderCode={order.orderCode}
                              variant="ghost"
                              onSuccess={() => navigate(".", { replace: true })} // Refresh data qua loader
                            />
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 sm:flex-none border-neutral-600 text-neutral-300 hover:bg-neutral-800 hover:text-white bg-transparent h-9"
                            onClick={() =>
                              navigate(`/orders/${order.orderCode}`)
                            }
                          >
                            Chi tiết
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-10 sm:py-20 flex flex-col items-center justify-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-neutral-800 rounded-full flex items-center justify-center mb-4">
                <Box className="w-8 h-8 sm:w-10 sm:h-10 text-neutral-600" />
              </div>
              <h3 className="text-base sm:text-lg font-medium text-white">
                {isSearching
                  ? "Không tìm thấy đơn hàng"
                  : "Chưa có đơn hàng nào"}
              </h3>
              {!isSearching && (
                <Button
                  onClick={() => navigate("/")}
                  className="bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto mt-4"
                >
                  Mua sắm ngay
                </Button>
              )}
            </div>
          )}

          {totalPages > 1 && (
            <div className="py-2">
              <PaginationCustom
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MyOrders;
