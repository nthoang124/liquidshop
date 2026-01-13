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
import { formatVND } from "@/utils/admin/formatMoney";
import { cartService } from "@/services/api/customer/cart.service";
import { orderService } from "@/services/api/customer/order.service";
import { promotionService } from "@/services/api/customer/promotion.service";
import useDocumentTitle from "@/hooks/useDocumentTitle";

const CheckoutPage: React.FC = () => {
  useDocumentTitle("Thanh toán");
  const navigate = useNavigate();
  const location = useLocation();
  const { updateCartCount } = useCart();
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

  useEffect(() => {
    if (!selectedItemIds.length) {
      toast.warning("Chọn sản phẩm!");
      navigate("/cart");
      return;
    }
    const fetchCart = async () => {
      setLoading(true);
      try {
        const res: any = await cartService.getCart();
        if (res?.cart) setCart(res.cart);
      } catch (e) {
        navigate("/cart");
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [navigate]);

  const checkoutItems = useMemo(
    () =>
      cart?.items?.filter((item: any) =>
        selectedItemIds.includes(item.productId)
      ) || [],
    [cart, selectedItemIds]
  );
  const subtotal = useMemo(
    () =>
      checkoutItems.reduce(
        (acc: number, item: any) => acc + item.price * item.quantity,
        0
      ),
    [checkoutItems]
  );
  const finalTotal = subtotal - discountAmount;

  const handleApplyVoucher = async () => {
    if (!voucherCode.trim()) return;
    try {
      const res: any = await promotionService.checkPromotion(voucherCode);
      const v = res.promotion;
      if (subtotal < v.minOrderAmount) {
        toast.error(`Đơn tối thiểu ${formatVND(v.minOrderAmount)}`);
        return;
      }
      let d =
        v.discountType === "percentage"
          ? (subtotal * v.discountValue) / 100
          : v.discountValue;
      if (v.maxDiscountAmount && d > v.maxDiscountAmount)
        d = v.maxDiscountAmount;
      setDiscountAmount(d > subtotal ? subtotal : d);
      setAppliedVoucher(voucherCode);
      toast.success("Đã áp dụng mã giảm giá!");
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Mã không hợp lệ");
    }
  };

  const handlePlaceOrder = async () => {
    setProcessingOrder(true);
    try {
      const res: any = await orderService.createOrder({
        paymentMethod,
        notes,
        voucherCode: appliedVoucher || undefined,
        paymentProvider:
          paymentMethod === "OnlineGateway" ? paymentProvider : undefined,
        items: selectedItemIds,
      });
      if (res) {
        toast.success("Đặt hàng thành công!");
        await updateCartCount();
        if (res.paymentUrl) window.location.href = res.paymentUrl;
        else navigate(`/order-success?code=${res.order.orderCode}`);
      }
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Lỗi tạo đơn");
    } finally {
      setProcessingOrder(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-red-600" />
      </div>
    );

  return (
    <div className="bg-transparent min-h-screen py-8">
      <div className="container mx-auto max-w-7xl px-4">
        <h1 className="text-2xl font-bold mb-8 text-white uppercase flex items-center gap-3">
          <CreditCard className="w-7 h-7 text-red-600" /> Thanh toán
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-3">
            <Card className="bg-[#151517]/90 border-zinc-800 rounded shadow-xl backdrop-blur-md">
              <CardHeader className="border-b border-zinc-800 pb-4">
                <CardTitle className="flex items-center gap-2 text-lg text-red-500 uppercase font-bold">
                  <MapPin className="w-5 h-5" /> Địa chỉ nhận hàng
                </CardTitle>
              </CardHeader>
              <CardContent className="">
                <div className="bg-red-600/10 p-4 border border-red-600/20 rounded text-sm text-gray-300 italic">
                  Đơn hàng sẽ được giao đến <strong>địa chỉ mặc định</strong>.
                  Kiểm tra thông tin{" "}
                  <Link
                    to="/users/me"
                    className="text-red-500 underline font-bold"
                  >
                    tại đây
                  </Link>
                  .
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#151517]/90 border-zinc-800 rounded shadow-xl backdrop-blur-md">
              <CardHeader className="border-b border-zinc-800 pb-4">
                <CardTitle className="text-lg text-white uppercase font-bold">
                  Phương thức thanh toán
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                {[
                  {
                    id: "COD",
                    label: "Tiền mặt (COD)",
                    sub: "Shipper thu tiền khi giao hàng",
                    icon: Truck,
                  },
                  {
                    id: "BankTransfer",
                    label: "Chuyển khoản (VietQR)",
                    sub: "Quét mã QR nhanh 24/7",
                    icon: QrCode,
                  },
                  {
                    id: "OnlineGateway",
                    label: "Ví điện tử / Thẻ ATM",
                    sub: "VNPAY hoặc Momo",
                    icon: Banknote,
                  },
                ].map((m) => (
                  <div
                    key={m.id}
                    onClick={() => setPaymentMethod(m.id as any)}
                    className={`flex items-center p-4 border rounded cursor-pointer transition-all ${
                      paymentMethod === m.id
                        ? "border-red-600 bg-red-600/10"
                        : "border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800"
                    }`}
                  >
                    <m.icon
                      className={`w-6 h-6 mr-4 ${
                        paymentMethod === m.id
                          ? "text-red-500"
                          : "text-gray-500"
                      }`}
                    />
                    <div className="flex-1">
                      <p className="font-bold text-white">{m.label}</p>
                      <p className="text-xs text-gray-500">{m.sub}</p>
                    </div>
                    <div
                      className={`w-4 h-4 rounded border ${
                        paymentMethod === m.id
                          ? "border-red-500 bg-red-500"
                          : "border-zinc-700"
                      }`}
                    />
                  </div>
                ))}
                {paymentMethod === "OnlineGateway" && (
                  <div className="pl-10 flex gap-4 animate-in fade-in slide-in-from-top-2">
                    <Button
                      variant="outline"
                      className={`flex-1 border-zinc-800 rounded ${
                        paymentProvider === "VNPAY"
                          ? "border-red-600 bg-red-600/10 text-red-500"
                          : "text-gray-400"
                      }`}
                      onClick={() => setPaymentProvider("VNPAY")}
                    >
                      VNPAY
                    </Button>
                    <Button
                      variant="outline"
                      className={`flex-1 border-zinc-800 rounded ${
                        paymentProvider === "Momo"
                          ? "border-red-600 bg-red-600/10 text-red-500"
                          : "text-gray-400"
                      }`}
                      onClick={() => setPaymentProvider("Momo")}
                    >
                      MOMO
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="space-y-2">
              <Label className="text-white font-bold uppercase text-xs">
                Ghi chú (Tùy chọn)
              </Label>
              <Textarea
                placeholder="Ví dụ: Giao giờ hành chính..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="bg-zinc-900 border-zinc-800 text-white rounded h-24 focus:ring-red-600 focus:border-red-600"
              />
            </div>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-24 bg-[#151517]/90 border-zinc-800 rounded shadow-2xl backdrop-blur-md overflow-hidden">
              <div className="bg-zinc-800 p-5 text-white font-bold uppercase text-sm tracking-widest text-center border-b border-zinc-700">
                Tóm tắt đơn hàng
              </div>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-4 max-h-60 overflow-y-auto no-scrollbar">
                  {checkoutItems.map((item: any) => (
                    <div
                      key={item.productId}
                      className="flex justify-between text-sm"
                    >
                      <div className="flex-1 pr-4">
                        <p className="text-gray-200 line-clamp-1">
                          {item.name}
                        </p>
                        <p className="text-gray-500">x{item.quantity}</p>
                      </div>
                      <p className="font-bold text-white">
                        {formatVND(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
                <Separator className="bg-zinc-800" />
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-bold text-gray-500">
                    Mã giảm giá
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="NHẬP MÃ..."
                      value={voucherCode}
                      onChange={(e) =>
                        setVoucherCode(e.target.value.toUpperCase())
                      }
                      disabled={!!appliedVoucher}
                      className="bg-zinc-900 border-zinc-800 text-white rounded font-bold"
                    />
                    {appliedVoucher ? (
                      <Button
                        variant="destructive"
                        onClick={() => {
                          setAppliedVoucher(null);
                          setDiscountAmount(0);
                          setVoucherCode("");
                        }}
                        className="rounded"
                      >
                        Xóa
                      </Button>
                    ) : (
                      <Button
                        onClick={handleApplyVoucher}
                        disabled={!voucherCode}
                        className="bg-red-600 text-white rounded"
                      >
                        <Ticket className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
                <Separator className="bg-zinc-800" />
                <div className="space-y-3">
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Tạm tính:</span>
                    <span className="text-white">{formatVND(subtotal)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-sm text-green-500">
                      <span>Giảm giá:</span>
                      <span>- {formatVND(discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-end pt-2">
                    <span className="font-bold text-white uppercase text-sm">
                      Tổng cộng:
                    </span>
                    <span className="font-bold text-2xl text-red-500">
                      {formatVND(finalTotal)}
                    </span>
                  </div>
                </div>
                <Button
                  onClick={handlePlaceOrder}
                  disabled={processingOrder}
                  className="w-full h-14 bg-red-600 hover:bg-red-700 text-white font-bold text-lg rounded uppercase transition-all shadow-lg shadow-red-900/20"
                >
                  {processingOrder ? (
                    <Loader2 className="animate-spin mr-2" />
                  ) : (
                    "Xác nhận đặt hàng"
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
