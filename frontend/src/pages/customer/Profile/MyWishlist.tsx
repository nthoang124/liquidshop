import React, { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, Trash2, ShoppingCart, Loader2, PackageX } from "lucide-react";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { wishlistService } from "@/services/api/customer/wishlist.service";
import { formatVND } from "@/utils/admin/formatMoney";
import PaginationCustom from "@/components/common/Pagination";

import ScrollToTop from "@/components/common/ScrollToTop";

const MyWishlist: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const res: any = await wishlistService.getWishlist();
      const products = res.wishlist?.products || res.wishlist || [];
      setItems(products);
      console.log(products);
    } catch (error) {
      console.error(error);
      toast.error("Không thể tải danh sách yêu thích");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const currentItems = useMemo(() => {
    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    return items.slice(indexOfFirstItem, indexOfLastItem);
  }, [items, currentPage]);

  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRemove = async (productId: string) => {
    try {
      await wishlistService.removeFromWishlist(productId);
      toast.success("Đã xóa khỏi danh sách yêu thích");
      // Cập nhật lại list sau khi xóa thành công
      setItems((prev) => prev.filter((item) => item._id !== productId));
    } catch (error) {
      toast.error("Xóa thất bại");
    }
  };

  return (
    <Card className="bg-[#151517] border-neutral-800 text-slate-200 shadow-xl min-h-[600px]">
      <ScrollToTop />
      <CardHeader className="border-b border-neutral-800 pb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
              <Heart className="w-6 h-6 text-red-500 fill-current" /> Sản phẩm
              yêu thích
            </CardTitle>
            <CardDescription className="text-neutral-400 mt-1">
              Lưu giữ những sản phẩm bạn đang quan tâm
            </CardDescription>
          </div>
          <div className="text-sm text-neutral-500">
            {items.length} sản phẩm
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-red-600" />
          </div>
        ) : items.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentItems.map((product) => {
                const categoryName =
                  typeof product.category === "object"
                    ? product.category?.name || "Uncategorized"
                    : String(product.category || "Uncategorized");

                const productLink = `/product/${encodeURIComponent(
                  categoryName
                )}/${product._id}`;

                return (
                  <div
                    key={product._id}
                    className="group relative bg-[#1e1e20] border border-neutral-800 rounded-md overflow-hidden hover:border-neutral-600 transition-all"
                  >
                    {/* IMAGE */}
                    <div className="aspect-square bg-white relative overflow-hidden">
                      <img
                        src={
                          product.images?.[0] || "https://placehold.co/300x300"
                        }
                        alt={product.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />

                      {/* REMOVE BUTTON */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleRemove(product._id);
                        }}
                        className="absolute top-1.5 right-1.5 p-1.5 bg-black/60 hover:bg-red-600 text-white rounded-full transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                        title="Xóa khỏi wishlist"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* CONTENT */}
                    <div className="p-3">
                      <Link to={productLink}>
                        <h3 className="text-sm font-medium text-white line-clamp-1 hover:text-red-500 transition-colors mb-1">
                          {product.name}
                        </h3>
                      </Link>

                      <div className="flex items-center justify-between mb-2">
                        <span className="text-red-500 font-semibold text-base">
                          {formatVND(product.price)}
                        </span>

                        {product.stockQuantity > 0 ? (
                          <Badge
                            variant="outline"
                            className="border-green-800 text-green-500 bg-green-500/10 text-xs px-1.5 py-0"
                          >
                            Còn hàng
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="border-neutral-700 text-neutral-500 bg-neutral-800 text-xs px-1.5 py-0"
                          >
                            Hết hàng
                          </Badge>
                        )}
                      </div>

                      <Button
                        onClick={() => navigate(productLink)}
                        className="w-full h-8 bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700 text-xs"
                      >
                        <ShoppingCart className="w-3.5 h-3.5 mr-1.5" />
                        Xem chi tiết
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-8 border-t border-neutral-800 pt-4">
              <PaginationCustom
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </>
        ) : (
          <div className="text-center py-20 flex flex-col items-center justify-center">
            <div className="w-20 h-20 bg-neutral-800 rounded-full flex items-center justify-center mb-4">
              <PackageX className="w-10 h-10 text-neutral-600" />
            </div>
            <h3 className="text-lg font-medium text-white">Danh sách trống</h3>
            <p className="text-neutral-500 mb-6 max-w-xs mx-auto">
              Bạn chưa lưu sản phẩm nào. Hãy dạo một vòng cửa hàng nhé!
            </p>
            <Button
              onClick={() => navigate("/")}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Mua sắm ngay
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MyWishlist;
