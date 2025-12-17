import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Trash2,
  Minus,
  Plus,
  ShoppingCart,
  CreditCard,
  Loader2,
} from "lucide-react";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatVND } from "@/utils/admin/formatMoney";
import { cartService } from "@/services/api/customer/cart.service";

import { useCart } from "@/context/CartContext";

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { updateCartCount } = useCart();

  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    try {
      const res: any = await cartService.getCart();
      if (res && res.cart) {
        setCart(res.cart);
      }
    } catch (error: any) {
      console.error("Fetch cart error", error);
      if (error.response?.status === 404) {
        setCart(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleUpdateQuantity = async (
    productId: string,
    curentQuantity: number,
    adjustment: number
  ) => {
    const newQuantity = curentQuantity + adjustment;

    if (newQuantity <= 0) {
      await handleRemoveItem(productId);
      await updateCartCount();
      return;
    }

    try {
      const res: any = await cartService.updateCartItem(productId, newQuantity);
      console.log("Phản hồi từ Server:", res);
      if (res && res.cart) {
        setCart(res.cart);
        await updateCartCount();
        toast.success("Đã cập nhật số lượng");
      }
    } catch (error) {
      toast.error("Lỗi cập nhật số lượng");
    }
  };

  const handleRemoveItem = async (productId: string) => {
    try {
      const res: any = await cartService.removeCartItem(productId);

      if (res && res.cart) {
        setCart(res.cart);
        toast.success("Đã xóa sản phẩm khỏi giỏ");
      }
    } catch (error) {
      toast.error("Lỗi xóa sản phẩm");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-red-600" />
      </div>
    );
  }

  const cartItems = cart?.items || [];
  const totalAmount = cart?.totalAmount || 0;

  return (
    <div className="bg-slate-50 min-h-screen py-8 font-sans">
      <div className="container mx-auto max-w-7xl px-4">
        {/* Breadcrumb giữ nguyên... */}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* DANH SÁCH SẢN PHẨM */}
          <div className="lg:col-span-8 flex-1 space-y-4">
            <Card className="border-none shadow-sm">
              <CardHeader className="border-b bg-white">
                <CardTitle className="flex items-center gap-2 text-xl uppercase">
                  <ShoppingCart className="w-6 h-6 text-red-600" />
                  Giỏ hàng ({cartItems.length} sản phẩm)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 bg-white">
                {cartItems.length > 0 ? (
                  cartItems.map((item: any, index: number) => (
                    <div key={item.productId}>
                      <div className="p-6 flex flex-col sm:flex-row items-center gap-6">
                        {/* Ảnh sản phẩm */}
                        <div className="w-24 h-24 bg-gray-50 rounded-lg overflow-hidden border shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-contain"
                          />
                        </div>

                        {/* Thông tin */}
                        <div className="flex-1 space-y-1 text-center sm:text-left">
                          <h3 className="font-bold text-gray-900 hover:text-red-600 cursor-pointer line-clamp-2">
                            {item.name}
                          </h3>
                          <p className="text-red-600 font-bold text-lg">
                            {formatVND(item.price)}
                          </p>
                        </div>

                        {/* Bộ tăng giảm số lượng */}
                        <div className="flex items-center border rounded-md">
                          <button
                            onClick={() =>
                              handleUpdateQuantity(
                                item.productId,
                                item.quantity,
                                -1
                              )
                            }
                            className="p-2 hover:bg-gray-100 disabled:opacity-30 cursor-pointer"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-4 py-1 font-semibold border-x w-12 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleUpdateQuantity(
                                item.productId,
                                item.quantity,
                                1
                              )
                            }
                            className="p-2 hover:bg-gray-100 cursor-pointer"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Xóa */}
                        <Button
                          variant="ghost"
                          onClick={() => handleRemoveItem(item.productId)}
                          className="text-gray-400 hover:text-red-600 cursor-pointer"
                        >
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      </div>
                      {index < cartItems.length - 1 && <Separator />}
                    </div>
                  ))
                ) : (
                  <div className="p-12 text-center space-y-4">
                    <p className="text-muted-foreground">Giỏ hàng đang trống</p>
                    <Button
                      onClick={() => navigate("/")}
                      className="bg-red-600 cursor-pointer"
                    >
                      Tiếp tục mua sắm
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* TÓM TẮT ĐƠN HÀNG */}
          <div className="lg:w-96">
            <Card className="sticky top-6 border-none shadow-md overflow-hidden">
              <div className="bg-red-600 p-4 text-white">
                <h3 className="font-bold uppercase flex items-center gap-2">
                  <CreditCard className="w-5 h-5" /> Thanh toán
                </h3>
              </div>
              <CardContent className="p-6 space-y-4 bg-white">
                <div className="flex justify-between items-end">
                  <span className="text-gray-900 font-bold">Tổng cộng:</span>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-red-600">
                      {formatVND(totalAmount)}
                    </p>
                  </div>
                </div>
                <Button className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-bold text-lg shadow-lg uppercase cursor-pointer">
                  Đặt hàng
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
