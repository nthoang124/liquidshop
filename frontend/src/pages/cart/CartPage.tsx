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
import useDocumentTitle from "@/hooks/useDocumentTitle";

const CartPage: React.FC = () => {
  useDocumentTitle("Giỏ hàng");

  const navigate = useNavigate();
  const { updateCartCount } = useCart();
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const fetchCart = async () => {
    try {
      const res: any = await cartService.getCart();
      if (res && res.cart) setCart(res.cart);
      console.log("Fetched cart:", res);
    } catch (error: any) {
      if (error.response?.status === 404) setCart(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const cartItems = cart?.items || [];

  const handleSelectItem = (productId: string) => {
    setSelectedItems((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === cartItems.length) setSelectedItems([]);
    else setSelectedItems(cartItems.map((item: any) => item.productId));
  };

  const selectedTotal = useMemo(() => {
    return cartItems.reduce(
      (total: number, item: any) =>
        selectedItems.includes(item.productId)
          ? total + item.price * item.quantity
          : total,
      0
    );
  }, [cartItems, selectedItems]);

  const handleUpdateQuantity = async (
    productId: string,
    curentQuantity: number,
    stockQuantity: number,
    adjustment: number
  ) => {
    const newQuantity = curentQuantity + adjustment;
    if (newQuantity <= 0) {
      await handleRemoveItem(productId);
      return;
    }
    if (adjustment > 0 && newQuantity > stockQuantity) {
      toast.error(
        `Số lượng trong kho không đủ. Chỉ còn ${stockQuantity} sản phẩm trong kho.`
      );
      return;
    }
    try {
      const res: any = await cartService.updateCartItem(productId, newQuantity);
      if (res && res.cart) {
        const updatedCart = { ...res.cart };
        updatedCart.items = updatedCart.items.map((newItem: any) => {
          const oldItem = cart.items.find(
            (i: any) => i.productId === newItem.productId
          );
          return {
            ...newItem,
            image: newItem.image || oldItem?.image,
            name: newItem.name || oldItem?.name,
            stockQuantity: oldItem?.stockQuantity,
          };
        });

        setCart(updatedCart);
        await updateCartCount();
      }
    } catch (error: any) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Lỗi cập nhật số lượng");
      }
    }
  };

  const handleRemoveItem = async (productId: string) => {
    try {
      const res: any = await cartService.removeCartItem(productId);
      if (res && res.cart) {
        setCart(res.cart);
        setSelectedItems((prev) => prev.filter((id) => id !== productId));
        await updateCartCount();
        toast.success("Đã xóa sản phẩm");
      }
    } catch (error) {
      toast.error("Lỗi xóa sản phẩm");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-red-600" />
      </div>
    );
  return (
    <div className="bg-transparent min-h-screen py-8">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:col-span-8 flex-1 space-y-4">
            <Card className="bg-[#151517]/90 border-zinc-800 rounded shadow-xl backdrop-blur-md">
              <CardHeader className="border-b border-zinc-800 flex flex-row items-center justify-between py-6">
                <CardTitle className="flex items-center gap-3 text-xl text-white uppercase font-bold">
                  <ShoppingCart className="w-6 h-6 text-red-600" /> Giỏ hàng
                </CardTitle>
                {cartItems.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="select-all"
                      checked={selectedItems.length === cartItems.length}
                      onCheckedChange={handleSelectAll}
                      className="border-zinc-600 data-[state=checked]:bg-red-600 rounded"
                    />
                    <label
                      htmlFor="select-all"
                      className="text-sm text-gray-400 cursor-pointer"
                    >
                      Chọn tất cả ({cartItems.length})
                    </label>
                  </div>
                )}
              </CardHeader>
              <CardContent className="p-0">
                {cartItems.length > 0 ? (
                  cartItems.map((item: any, index: number) => (
                    <div key={item.productId}>
                      <div
                        className={`p-6 flex flex-col sm:flex-row items-center gap-6 transition-colors ${
                          selectedItems.includes(item.productId)
                            ? "bg-red-600/5"
                            : ""
                        }`}
                      >
                        <Checkbox
                          checked={selectedItems.includes(item.productId)}
                          onCheckedChange={() =>
                            handleSelectItem(item.productId)
                          }
                          className="border-zinc-600 data-[state=checked]:bg-red-600 rounded"
                        />
                        <div className="w-24 h-24 bg-gray-700 rounded overflow-hidden p-2 shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="flex-1 space-y-1">
                          <h3 className="font-bold text-white hover:text-red-500 cursor-pointer line-clamp-2 transition-colors">
                            {item.name}
                          </h3>
                          <p className="text-red-500 font-bold text-lg">
                            {formatVND(item.price)}
                          </p>
                        </div>
                        <div className="flex items-center border border-zinc-800 rounded bg-zinc-900">
                          <button
                            onClick={() =>
                              handleUpdateQuantity(
                                item.productId,
                                item.quantity,
                                item.stockQuantity || 999,
                                -1
                              )
                            }
                            className="p-2 text-gray-400 hover:text-white"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-4 py-1 font-bold border-x border-zinc-800 w-12 text-center text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleUpdateQuantity(
                                item.productId,
                                item.quantity,
                                item.stockQuantity || 999,
                                1
                              )
                            }
                            className={`p-2 hover:text-white ${
                              item.quantity >= (item.stockQuantity || 999)
                                ? "text-zinc-600 cursor-not-allowed"
                                : "text-gray-400"
                            }`}
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        {item.stockQuantity <= 5 && (
                          <span className="text-xs text-orange-500 ml-2">
                            Còn {item.stockQuantity} SP
                          </span>
                        )}
                        <Button
                          variant="ghost"
                          onClick={() => handleRemoveItem(item.productId)}
                          className="text-zinc-600 hover:text-red-600"
                        >
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      </div>
                      {index < cartItems.length - 1 && (
                        <Separator className="bg-zinc-800" />
                      )}
                    </div>
                  ))
                ) : (
                  <div className="p-20 text-center space-y-4">
                    <p className="text-gray-500 italic">
                      Giỏ hàng của bạn đang trống
                    </p>
                    <Button
                      onClick={() => navigate("/")}
                      className="bg-red-600 hover:bg-red-700 text-white rounded font-bold px-8"
                    >
                      MUA SẮM NGAY
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:w-96">
            <Card className="sticky top-24 bg-[#151517]/90 border-zinc-800 rounded shadow-2xl backdrop-blur-md overflow-hidden">
              <div className="bg-red-600 p-5 text-white">
                <h3 className="font-bold uppercase flex items-center gap-2 tracking-widest">
                  <CreditCard className="w-5 h-5" /> Thanh toán
                </h3>
              </div>
              <CardContent className="p-6 space-y-6">
                <div className="flex justify-between items-end">
                  <span className="text-gray-400 font-medium">
                    Tạm tính ({selectedItems.length} món):
                  </span>
                  <p className="text-2xl font-bold text-red-500">
                    {formatVND(selectedTotal)}
                  </p>
                </div>
                <Button
                  onClick={() =>
                    navigate("/checkout", { state: { selectedItems } })
                  }
                  disabled={selectedItems.length === 0}
                  className="w-full h-14 bg-red-600 hover:bg-red-700 text-white font-bold text-lg rounded uppercase disabled:opacity-30"
                >
                  Đặt hàng ngay
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
