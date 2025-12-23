import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  MapPin,
  CreditCard,
  Truck,
  QrCode,
  Banknote,
  Loader2,
  Ticket,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

import { useCart } from "@/context/CartContext";
import { type ICreateOrderPayload } from "@/types/order";

import { formatVND } from "@/utils/admin/formatMoney";

import { cartService } from "@/services/api/customer/cart.service";
import { orderService } from "@/services/api/customer/order.service";
import { promotionService } from "@/services/api/customer/promotion.service";

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { updateCartCount } = useCart();

  // Lấy danh sách ID sản phẩm được chọn. Nếu không có thì mặc định là mảng rỗng
  const selectedItemIds = location.state?.selectedItems || [];

  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [processingOrder, setProcessingOrder] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState<
    "COD" | "BankTransfer" | "OnlineGateway"
  >("COD");
  const [paymentProvider, setPaymentProvider] = useState<"VNPAY" | "Momo">(
    "VNPAY"
  );
  const [notes, setNotes] = useState("");
  const [voucherCode, setVoucherCode] = useState("");

  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedVoucher, setAppliedVoucher] = useState<string | null>(null);

  // --- 1. Fetch Cart Data & Validate ---
  useEffect(() => {
    // Nếu user vào thẳng trang checkout mà không chọn món nào -> đá về cart
    if (!selectedItemIds || selectedItemIds.length === 0) {
      toast.warning("Vui lòng chọn sản phẩm để thanh toán");
      navigate("/cart");
      return;
    }

    const fetchCart = async () => {
      setLoading(true);
      try {
        const res: any = await cartService.getCart();
        if (res && res.cart) {
          setCart(res.cart);
        }
      } catch (error) {
        console.error("Lỗi tải giỏ hàng", error);
        navigate("/cart");
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [navigate, selectedItemIds]);

  // --- 2. Derived State: LỌC SẢN PHẨM & TÍNH TOÁN LẠI ---

  // Chỉ lấy những item có ID nằm trong danh sách đã chọn
  const checkoutItems = useMemo(() => {
    if (!cart || !cart.items) return [];
    return cart.items.filter((item: any) =>
      selectedItemIds.includes(item.productId)
    );
  }, [cart, selectedItemIds]);

  // Tính tổng tiền MỚI dựa trên danh sách đã lọc (Không dùng cart.totalAmount của server)
  const subtotal = useMemo(() => {
    return checkoutItems.reduce(
      (acc: number, item: any) => acc + item.price * item.quantity,
      0
    );
  }, [checkoutItems]);

  const shippingFee = 0;
  const finalTotal = subtotal + shippingFee - discountAmount;

  // --- 3. Handle Apply Voucher ---
  const handleApplyVoucher = async () => {
    if (!voucherCode.trim()) return;

    try {
      const res: any = await promotionService.checkPromotion(voucherCode);
      const voucher = res.promotion;

      if (voucher) {
        let discount = 0;

        // Check điều kiện trên subtotal MỚI
        if (subtotal < voucher.minOrderAmount) {
          toast.error(
            `Đơn hàng phải tối thiểu ${formatVND(voucher.minOrderAmount)}`
          );
          return;
        }

        if (voucher.discountType === "percentage") {
          discount = (subtotal * voucher.discountValue) / 100;
          if (
            voucher.maxDiscountAmount &&
            discount > voucher.maxDiscountAmount
          ) {
            discount = voucher.maxDiscountAmount;
          }
        } else {
          discount = voucher.discountValue;
        }

        if (discount > subtotal) discount = subtotal;

        setDiscountAmount(discount);
        setAppliedVoucher(voucherCode);
        toast.success("Áp dụng mã giảm giá thành công!");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Mã giảm giá không hợp lệ");
      setDiscountAmount(0);
      setAppliedVoucher(null);
    }
  };

  // --- 4. Handle Create Order ---
  const handlePlaceOrder = async () => {
    setProcessingOrder(true);
    try {
      const payload: ICreateOrderPayload = {
        paymentMethod,
        notes,
        voucherCode: appliedVoucher || undefined,
        paymentProvider:
          paymentMethod === "OnlineGateway" ? paymentProvider : undefined,
        items: selectedItemIds,
      };

      const res: any = await orderService.createOrder(payload);

      if (res) {
        toast.success("Đặt hàng thành công!");
        await updateCartCount();
        if (res.paymentUrl) {
          window.location.href = res.paymentUrl;
        } else {
          navigate(`/order-success?code=${res.order.orderCode}`);
        }
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Có lỗi xảy ra khi tạo đơn");
    } finally {
      setProcessingOrder(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-red-600" />
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-8 font-sans">
      <div className="container mx-auto max-w-7xl px-4">
        <h1 className="text-2xl font-bold mb-6 text-slate-800 uppercase flex items-center gap-2">
          <CreditCard className="w-6 h-6 text-red-600" /> Thanh toán
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* CỘT TRÁI */}
          <div className="lg:col-span-2 space-y-6">
            {/* Địa chỉ nhận hàng */}
            <Card className="border-none shadow-sm">
              <CardHeader className="border-b bg-white pb-4">
                <CardTitle className="flex items-center gap-2 text-lg text-red-600">
                  <MapPin className="w-5 h-5" /> Địa chỉ nhận hàng
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="bg-orange-50 p-4 border border-orange-200 rounded text-sm text-orange-800">
                  ℹ️ Đơn hàng sẽ được giao đến <strong>địa chỉ mặc định</strong>{" "}
                  của bạn. Vui lòng kiểm tra{" "}
                  <Link to="/users/me" className="hover:underline">
                    <strong>tại đây</strong>
                  </Link>{" "}
                  để chắc chắn rằng bạn đã đặt địa chỉ mặc định và đảm bảo rằng
                  bạn đã cung cấp <strong>số điện thoại</strong> liên lạc!{" "}
                </div>
              </CardContent>
            </Card>

            {/* Phương thức thanh toán */}
            <Card className="border-none shadow-sm">
              <CardHeader className="border-b bg-white pb-4">
                <CardTitle className="flex items-center gap-2 text-lg text-slate-800">
                  Phương thức thanh toán
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                {/* COD */}
                <div
                  className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                    paymentMethod === "COD"
                      ? "border-red-600 bg-red-50"
                      : "hover:bg-slate-50"
                  }`}
                  onClick={() => setPaymentMethod("COD")}
                >
                  <div className="mr-4">
                    <Truck
                      className={`w-6 h-6 ${
                        paymentMethod === "COD"
                          ? "text-red-600"
                          : "text-slate-400"
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">
                      Thanh toán khi nhận hàng (COD)
                    </p>
                    <p className="text-sm text-slate-500">
                      Thanh toán tiền mặt cho shipper khi nhận hàng
                    </p>
                  </div>
                  <div className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center">
                    {paymentMethod === "COD" && (
                      <div className="w-2 h-2 rounded-full bg-red-600" />
                    )}
                  </div>
                </div>

                {/* BankTransfer */}
                <div
                  className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                    paymentMethod === "BankTransfer"
                      ? "border-red-600 bg-red-50"
                      : "hover:bg-slate-50"
                  }`}
                  onClick={() => setPaymentMethod("BankTransfer")}
                >
                  <div className="mr-4">
                    <QrCode
                      className={`w-6 h-6 ${
                        paymentMethod === "BankTransfer"
                          ? "text-red-600"
                          : "text-slate-400"
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">
                      Chuyển khoản ngân hàng (VietQR)
                    </p>
                    <p className="text-sm text-slate-500">
                      Quét mã QR để chuyển khoản nhanh 24/7
                    </p>
                  </div>
                  <div className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center">
                    {paymentMethod === "BankTransfer" && (
                      <div className="w-2 h-2 rounded-full bg-red-600" />
                    )}
                  </div>
                </div>

                {/* OnlineGateway */}
                <div
                  className={`flex flex-col p-4 border rounded-lg cursor-pointer transition-all ${
                    paymentMethod === "OnlineGateway"
                      ? "border-red-600 bg-red-50"
                      : "hover:bg-slate-50"
                  }`}
                  onClick={() => setPaymentMethod("OnlineGateway")}
                >
                  <div className="flex items-center w-full">
                    <div className="mr-4">
                      <Banknote
                        className={`w-6 h-6 ${
                          paymentMethod === "OnlineGateway"
                            ? "text-red-600"
                            : "text-slate-400"
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900">
                        Ví điện tử / Thẻ ATM
                      </p>
                      <p className="text-sm text-slate-500">
                        Thanh toán qua VNPAY hoặc Momo
                      </p>
                    </div>
                    <div className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center">
                      {paymentMethod === "OnlineGateway" && (
                        <div className="w-2 h-2 rounded-full bg-red-600" />
                      )}
                    </div>
                  </div>

                  {/* Sub-options cho OnlineGateway */}
                  {paymentMethod === "OnlineGateway" && (
                    <div className="mt-4 pl-10 flex gap-4 animate-in fade-in slide-in-from-top-2">
                      <Button
                        variant="outline"
                        className={`flex-1 border-2 ${
                          paymentProvider === "VNPAY"
                            ? "border-blue-600 text-blue-700 bg-blue-50"
                            : ""
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setPaymentProvider("VNPAY");
                        }}
                      >
                        VNPAY
                      </Button>
                      <Button
                        variant="outline"
                        className={`flex-1 border-2 ${
                          paymentProvider === "Momo"
                            ? "border-pink-600 text-pink-700 bg-pink-50"
                            : ""
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setPaymentProvider("Momo");
                        }}
                      >
                        MOMO
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Ghi chú */}
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-slate-700">
                Ghi chú đơn hàng (Tùy chọn)
              </Label>
              <Textarea
                id="notes"
                placeholder="Ví dụ: Giao hàng giờ hành chính, gọi trước khi giao..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="bg-white"
              />
            </div>
          </div>

          {/* CỘT PHẢI: TỔNG KẾT ĐƠN HÀNG */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6 border-none shadow-md overflow-hidden">
              <div className="bg-slate-800 p-4 text-white">
                <h3 className="font-bold uppercase flex items-center gap-2">
                  Thông tin đơn hàng ({checkoutItems.length} món)
                </h3>
              </div>

              <CardContent className="p-6 space-y-6 bg-white">
                {/* HIỂN THỊ DANH SÁCH ĐÃ LỌC */}
                <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                  {checkoutItems.map((item: any) => (
                    <div
                      key={item.productId}
                      className="flex justify-between text-sm"
                    >
                      <div>
                        <p className="font-medium text-slate-800 line-clamp-1 w-40">
                          {item.name}
                        </p>
                        <p className="text-slate-500">x {item.quantity}</p>
                      </div>
                      <p className="font-medium">
                        {formatVND(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Voucher Input */}
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase text-slate-500">
                    Mã khuyến mãi
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Nhập mã..."
                      value={voucherCode}
                      onChange={(e) =>
                        setVoucherCode(e.target.value.toUpperCase())
                      }
                      disabled={!!appliedVoucher}
                    />
                    {appliedVoucher ? (
                      <Button
                        variant="destructive"
                        onClick={() => {
                          setAppliedVoucher(null);
                          setDiscountAmount(0);
                          setVoucherCode("");
                        }}
                      >
                        Xóa
                      </Button>
                    ) : (
                      <Button
                        onClick={handleApplyVoucher}
                        disabled={!voucherCode}
                      >
                        <Ticket className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Tính tiền (HIỂN THỊ SỐ TIỀN MỚI) */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Tạm tính:</span>
                    <span className="font-medium">{formatVND(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Phí vận chuyển:</span>
                    <span className="font-medium">0đ</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Giảm giá:</span>
                      <span className="font-medium">
                        - {formatVND(discountAmount)}
                      </span>
                    </div>
                  )}

                  <Separator className="my-2" />

                  <div className="flex justify-between items-end">
                    <span className="font-bold text-lg text-slate-800">
                      Tổng cộng:
                    </span>
                    <span className="font-bold text-2xl text-red-600">
                      {formatVND(finalTotal)}
                    </span>
                  </div>
                </div>

                {/* Nút đặt hàng */}
                <Button
                  className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-bold text-lg shadow-lg uppercase"
                  onClick={handlePlaceOrder}
                  disabled={processingOrder}
                >
                  {processingOrder ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang xử
                      lý...
                    </>
                  ) : (
                    "Đặt hàng ngay"
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
