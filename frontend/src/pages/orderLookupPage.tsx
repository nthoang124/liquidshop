import React, { useState } from "react";
import useDocumentTitle from "@/hooks/useDocumentTitle";

import { Link } from "react-router-dom";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  User,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// --- MOCK DATA TYPE ---
interface OrderStatus {
  step: number; // 1: Đặt hàng, 2: Xác nhận, 3: Vận chuyển, 4: Hoàn thành
  label: string;
  date: string;
}

interface OrderDetail {
  id: string;
  date: string;
  customer: {
    name: string;
    phone: string;
    address: string;
  };
  items: Array<{
    name: string;
    image: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  paymentMethod: string;
  statusHistory: OrderStatus[];
  currentStep: number;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};

const OrderLookupPage: React.FC = () => {
  const [searchParams, setSearchParams] = useState({ orderId: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState<OrderDetail | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchParams.orderId || !searchParams.phone) {
      setError("Vui lòng nhập đầy đủ Mã đơn hàng và Số điện thoại");
      return;
    }

    setLoading(true);
    setError("");
    setOrder(null);

    // --- GIẢ LẬP GỌI API ---
    setTimeout(() => {
      setLoading(false);
      // Demo logic: Nếu nhập đúng format thì hiện kết quả
      if (searchParams.orderId.length > 3) {
        setOrder({
          id: searchParams.orderId.toUpperCase(),
          date: "04/12/2025 - 14:30",
          customer: {
            name: "Nguyễn Văn A",
            phone: searchParams.phone,
            address: "276 Hoàng Văn Thụ, Phường 4, Quận Tân Bình, TP. HCM",
          },
          items: [
            {
              name: "Chuột Gaming Razer DeathAdder V3 Pro",
              image: "https://placehold.co/100x100?text=Mouse",
              quantity: 1,
              price: 3190000,
            },
            {
              name: "Bàn phím cơ AKKO 3068B Plus",
              image: "https://placehold.co/100x100?text=Keyboard",
              quantity: 1,
              price: 1890000,
            },
          ],
          total: 5080000,
          paymentMethod: "Thanh toán khi nhận hàng (COD)",
          currentStep: 3, // Đang vận chuyển
          statusHistory: [
            { step: 1, label: "Đã đặt hàng", date: "04/12/2025 14:30" },
            { step: 2, label: "Đã xác nhận", date: "04/12/2025 15:00" },
            { step: 3, label: "Đang vận chuyển", date: "05/12/2025 08:30" },
            { step: 4, label: "Giao thành công", date: "Dự kiến 06/12" },
          ],
        });
      } else {
        setError("Không tìm thấy đơn hàng. Vui lòng kiểm tra lại thông tin.");
      }
    }, 1000);
  };

  return (
    <>
      {useDocumentTitle("Tra cứu đơn hàng")}
      <div className="bg-slate-50 min-h-screen py-8 font-sans">
        <div className="container mx-auto max-w-4xl px-4">
          {/* Breadcrumb */}
          <div className="flex items-center text-sm text-muted-foreground mb-6 space-x-2">
            <Link to="/" className="hover:text-red-600 transition-colors">
              Trang chủ
            </Link>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <span className="text-gray-900 font-medium">Tra cứu đơn hàng</span>
          </div>

          {/* --- FORM TRA CỨU --- */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
            <div className="p-6 md:p-8 text-center border-b border-gray-100">
              <h1 className="text-2xl font-bold text-gray-800 mb-2 uppercase">
                Kiểm tra tình trạng đơn hàng
              </h1>
              <p className="text-gray-500 text-sm">
                Nhập mã đơn hàng và số điện thoại mua hàng để theo dõi lộ trình.
              </p>
            </div>

            <div className="p-6 md:p-8 bg-gray-50/50">
              <form
                onSubmit={handleSearch}
                className="max-w-2xl mx-auto space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">
                      Mã đơn hàng <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Package className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="VD: #123456"
                        className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all outline-none text-sm"
                        value={searchParams.orderId}
                        onChange={(e) =>
                          setSearchParams({
                            ...searchParams,
                            orderId: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">
                      Số điện thoại <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="VD: 0909xxx..."
                        className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all outline-none text-sm"
                        value={searchParams.phone}
                        onChange={(e) =>
                          setSearchParams({
                            ...searchParams,
                            phone: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-md border border-red-100">
                    <AlertCircle className="w-4 h-4" /> {error}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full md:w-auto md:min-w-[200px] mx-auto block mt-4 bg-red-600 hover:bg-red-700 text-white font-bold shadow-red-100  cursor-pointer"
                  disabled={loading}
                >
                  {loading ? "Đang kiểm tra..." : "TRA CỨU NGAY"}
                </Button>
              </form>
            </div>
          </div>

          {/* --- KẾT QUẢ TRA CỨU --- */}
          {order && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* 1. Timeline Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b pb-4">
                  <div>
                    <p className="text-sm text-gray-500">
                      Đơn hàng #
                      <span className="font-bold text-gray-900 text-lg">
                        {order.id}
                      </span>
                    </p>
                    <p className="text-xs text-gray-400">
                      Đặt ngày: {order.date}
                    </p>
                  </div>
                  <div className="mt-2 md:mt-0 px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full border border-blue-100 uppercase">
                    {order.statusHistory[order.currentStep - 1].label}
                  </div>
                </div>

                {/* Timeline UI */}
                <div className="relative px-2 md:px-10 py-4">
                  <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 hidden md:block z-0"></div>
                  <div
                    className="absolute top-1/2 left-0 h-1 bg-green-500 -translate-y-1/2 hidden md:block z-0 transition-all duration-1000"
                    style={{ width: `${((order.currentStep - 1) / 3) * 100}%` }}
                  ></div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
                    {order.statusHistory.map((step, idx) => {
                      const isActive = idx + 1 <= order.currentStep;
                      return (
                        <div
                          key={idx}
                          className="flex md:flex-col items-center gap-4 md:gap-2"
                        >
                          <div
                            className={`
                                              w-10 h-10 rounded-full flex items-center justify-center border-2 flex-shrink-0 bg-white
                                              ${
                                                isActive
                                                  ? "border-green-500 text-green-500"
                                                  : "border-gray-300 text-gray-300"
                                              }
                                          `}
                          >
                            {idx + 1 === 1 && <Clock className="w-5 h-5" />}
                            {idx + 1 === 2 && <Package className="w-5 h-5" />}
                            {idx + 1 === 3 && <Truck className="w-5 h-5" />}
                            {idx + 1 === 4 && (
                              <CheckCircle className="w-5 h-5" />
                            )}
                          </div>
                          <div className="text-left md:text-center">
                            <p
                              className={`text-sm font-bold ${
                                isActive ? "text-gray-900" : "text-gray-400"
                              }`}
                            >
                              {step.label}
                            </p>
                            <p className="text-xs text-gray-400">{step.date}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 2. Thông tin người nhận */}
                <div className="md:col-span-1 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-red-600" /> Thông tin nhận
                    hàng
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-gray-500 text-xs">Người nhận:</p>
                      <p className="font-semibold text-gray-900 flex items-center gap-1">
                        <User className="w-3 h-3" /> {order.customer.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Số điện thoại:</p>
                      <p className="font-semibold text-gray-900 flex items-center gap-1">
                        <Phone className="w-3 h-3" /> {order.customer.phone}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Địa chỉ:</p>
                      <p className="text-gray-700">{order.customer.address}</p>
                    </div>
                  </div>
                </div>

                {/* 3. Danh sách sản phẩm */}
                <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Package className="w-4 h-4 text-red-600" /> Sản phẩm (
                    {order.items.length})
                  </h3>
                  <div className="space-y-4 mb-4">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex gap-4 border-b border-gray-50 last:border-0 pb-4 last:pb-0"
                      >
                        <div className="w-16 h-16 border rounded-md overflow-hidden flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-800 line-clamp-2">
                            {item.name}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">
                            Số lượng: x{item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-red-600">
                            {formatCurrency(item.price)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">
                        Hình thức thanh toán:
                      </span>
                      <span className="font-medium text-gray-900">
                        {order.paymentMethod}
                      </span>
                    </div>
                    <div className="flex justify-between text-base pt-2 border-t border-gray-200">
                      <span className="font-bold text-gray-800">
                        Tổng tiền:
                      </span>
                      <span className="font-bold text-red-600 text-lg">
                        {formatCurrency(order.total)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default OrderLookupPage;
