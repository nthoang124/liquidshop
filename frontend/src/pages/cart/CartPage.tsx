import React, { useEffect, useState, useMemo } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { formatVND } from "@/utils/admin/formatMoney";
import { cartService } from "@/services/api/customer/cart.service";
import { useCart } from "@/context/CartContext";

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { updateCartCount } = useCart();

  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Danh sách ID các sản phẩm được chọn
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

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

  const cartItems = cart?.items || [];

  // --- LOGIC CHECKBOX ---

  // 1. Xử lý khi tick vào 1 sản phẩm
  const handleSelectItem = (productId: string) => {
    setSelectedItems((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId); // Bỏ chọn
      } else {
        return [...prev, productId]; // Chọn thêm
      }
    });
  };

  // 2. Xử lý "Chọn tất cả"
  const handleSelectAll = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([]); // Nếu đang chọn hết thì bỏ chọn hết
    } else {
      const allIds = cartItems.map((item: any) => item.productId);
      setSelectedItems(allIds);
    }
  };

  // 3. Tính toán tổng tiền DỰA TRÊN CÁC MÓN ĐÃ CHỌN
  const selectedTotal = useMemo(() => {
    if (!cartItems.length) return 0;
    return cartItems.reduce((total: number, item: any) => {
      if (selectedItems.includes(item.productId)) {
        return total + item.price * item.quantity;
      }
      return total;
    }, 0);
  }, [cartItems, selectedItems]);

  const handleUpdateQuantity = async (
    productId: string,
    curentQuantity: number,
    adjustment: number
  ) => {
    const newQuantity = curentQuantity + adjustment;
    if (newQuantity <= 0) {
      await handleRemoveItem(productId);
      return;
    }
    try {
      const res: any = await cartService.updateCartItem(productId, newQuantity);
      if (res && res.cart) {
        setCart(res.cart);
        await updateCartCount();
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
        // Nếu xóa item đang được chọn, phải remove nó khỏi list selectedItems
        setSelectedItems((prev) => prev.filter((id) => id !== productId));
        await updateCartCount();
        toast.success("Đã xóa sản phẩm");
      }
    } catch (error) {
      toast.error("Lỗi xóa sản phẩm");
    }
  };

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      toast.error("Bạn chưa chọn sản phẩm nào để đặt hàng!");
      return;
    }

    navigate("/checkout", {
      state: {
        selectedItems: selectedItems, // Truyền mảng ID qua state của router
      },
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-red-600" />
      </div>
    );
  }

  const isAllSelected =
    cartItems.length > 0 && selectedItems.length === cartItems.length;

  return (
    <div className="bg-slate-50 min-h-screen py-8 font-sans">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* DANH SÁCH SẢN PHẨM */}
          <div className="lg:col-span-8 flex-1 space-y-4">
            <Card className="border-none shadow-sm">
              <CardHeader className="border-b bg-white flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-xl uppercase">
                  <ShoppingCart className="w-6 h-6 text-red-600" />
                  Giỏ hàng
                </CardTitle>

                {/* Checkbox chọn tất cả */}
                {cartItems.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="select-all"
                      checked={isAllSelected}
                      onCheckedChange={handleSelectAll}
                      className="w-5 h-5 border-gray-400 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                    />
                    <label
                      htmlFor="select-all"
                      className="text-sm font-medium cursor-pointer select-none"
                    >
                      Chọn tất cả ({cartItems.length})
                    </label>
                  </div>
                )}
              </CardHeader>
              <CardContent className="p-0 bg-white">
                {cartItems.length > 0 ? (
                  cartItems.map((item: any, index: number) => {
                    const isSelected = selectedItems.includes(item.productId);
                    return (
                      <div key={item.productId}>
                        <div
                          className={`p-6 flex flex-col sm:flex-row items-center gap-6 transition-colors ${
                            isSelected ? "bg-red-50/30" : ""
                          }`}
                        >
                          {/* 1. Checkbox từng món */}
                          <div className="flex items-center justify-center">
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={() =>
                                handleSelectItem(item.productId)
                              }
                              className="w-5 h-5 border-gray-400 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                            />
                          </div>

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
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                              <p className="text-red-600 font-bold text-lg">
                                {formatVND(item.price)}
                              </p>
                            </div>
                          </div>

                          {/* Bộ tăng giảm số lượng */}
                          <div className="flex items-center border rounded-md bg-white">
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
                    );
                  })
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
                  {/* Hiển thị số lượng item đã chọn */}
                  <span className="text-gray-900 font-bold">
                    Tổng cộng ({selectedItems.length} món):
                  </span>
                  <div className="text-right">
                    {/* Hiển thị tổng tiền ĐÃ TÍNH TOÁN LẠI */}
                    <p className="text-2xl font-bold text-red-600">
                      {formatVND(selectedTotal)}
                    </p>
                  </div>
                </div>

                <Button
                  onClick={handleCheckout}
                  disabled={selectedItems.length === 0}
                  className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-bold text-lg shadow-lg uppercase cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Mua hàng
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
