import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Star,
  ShieldCheck,
  Truck,
  ChevronRight,
  ShoppingCart,
  CreditCard,
  Heart,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

import { productService } from "@/services/api/customer/product.service";
import { cartService } from "@/services/api/customer/cart.service";
import { wishlistService } from "@/services/api/customer/wishlist.service";
import { useCart } from "@/context/CartContext";

import type { IProduct } from "@/types/product";
import ProductSpecsTable from "@/components/product/ProductSpecTable";
import ProductListCarousel from "@/components/product/carousel/ProductListCarousel";
import ProductReviews from "@/components/customer/ProductReview";

import useDocumentTitle from "@/hooks/useDocumentTitle";

import { formatVND } from "@/utils/admin/formatMoney";

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { updateCartCount } = useCart();

  const [product, setProduct] = useState<IProduct | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<IProduct[]>([]);

  const [activeImage, setActiveImage] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const [isWishlisted, setIsWishlisted] = useState(false);

  useDocumentTitle(product?.name || "Chi tiết sản phẩm");

  // --- 1. LẤY CHI TIẾT SẢN PHẨM ---
  useEffect(() => {
    const fetchProductData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await productService.getProductDetail(id);

        if (data) {
          setProduct(data);
          setActiveImage(data.images?.[0] || "");

          const categoryName =
            typeof data.category === "object" ? data.category?.name : "";
          if (categoryName) {
            fetchRelatedProducts(categoryName, data._id);
          }
        } else {
          setProduct(null);
        }
      } catch (error) {
        console.error("Failed to fetch product", error);
        toast.error("Lỗi tải sản phẩm");
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [id]);

  const fetchRelatedProducts = async (
    categoryName: string,
    currentId: string
  ) => {
    if (!categoryName) return;

    try {
      const res = await productService.getProducts({
        category: categoryName,
        limit: 11,
        fields:
          "name,price,images,originalPrice,averageRating, specifications, soldCount",
      });

      const products = res.data?.products || [];

      const related = products
        .filter((p: any) => p._id !== currentId)
        .slice(0, 10);

      setRelatedProducts(related);
    } catch (error) {
      console.error("Failed to fetch related products:", error);
    }
  };

  const handleAddToCart = async () => {
    const token =
      localStorage.getItem("accessToken") ||
      sessionStorage.getItem("accessToken");
    if (!token) {
      toast.error("Vui lòng đăng nhập để mua hàng!");
      navigate("/auth/login/customer");
      return;
    }

    if (!product) return;

    setIsAddingToCart(true);

    try {
      await cartService.addToCart(product._id, 1);
      await updateCartCount();
      toast.success("Đã thêm sản phẩm vào giỏ hàng!", {
        action: {
          label: "Xem giỏ hàng",
          onClick: () => navigate("/cart"),
        },
      });
    } catch (error: any) {
      console.error("Add to cart error", error);
      toast.error(
        error.response?.data?.message || "Không thể thêm vào giỏ hàng"
      );
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleToggleWishlist = async () => {
    const token =
      localStorage.getItem("accessToken") ||
      sessionStorage.getItem("accessToken");
    if (!token) {
      toast.error("Vui lòng đăng nhập để lưu sản phẩm!");
      return;
    }
    if (!product) return;

    try {
      if (isWishlisted) {
        await wishlistService.removeFromWishlist(product._id);
        setIsWishlisted(false);
        toast.success("Đã xóa khỏi sản phẩm yêu thích");
      } else {
        await wishlistService.addToWishlist(product._id);
        setIsWishlisted(true);
        toast.success("Đã thêm vào sản phẩm yêu thích");
      }
    } catch (error) {
      toast.error("Thao tác thất bại");
    }
  };

  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (!product) return;
      try {
        const res: any = await wishlistService.getWishlist();
        // Kiểm tra xem product._id có trong danh sách trả về không
        const list = res.wishlist?.products || res.wishlist || [];
        const exists = list.some((item: any) => item._id === product._id);
        setIsWishlisted(exists);
      } catch (e) {
        /* Ignore error if guest */
      }
    };
    if (product) checkWishlistStatus();
  }, [product]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Card className="w-[280px]">
          <CardContent className="flex flex-col items-center gap-4 py-8">
            <Skeleton className="h-12 w-12 rounded-full" />
            <Skeleton className="h-4 w-40" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Không tìm thấy sản phẩm!
        </h2>
        <Button onClick={() => navigate("/")} variant="outline">
          Quay lại trang chủ
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-6 font-sans">
      <div className="container mx-auto max-w-7xl px-4 space-y-6">
        {/* ---------- BREADCRUMB ---------- */}
        <div className="flex items-center text-sm text-muted-foreground space-x-2">
          <span
            onClick={() => navigate("/")}
            className="hover:text-red-600 cursor-pointer"
          >
            Trang chủ
          </span>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-medium truncate">
            {product.name}
          </span>
        </div>

        {/* ---------- PRODUCT CARD ---------- */}
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-8">
              {/* ---------- IMAGES ---------- */}
              <div className="lg:col-span-5 p-6 border-b lg:border-b-0 lg:border-r border-gray-100">
                <div className="relative aspect-square bg-white rounded-lg overflow-hidden mb-4 flex items-center justify-center">
                  <img
                    src={activeImage}
                    alt={product.name}
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="flex justify-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {product.images?.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImage(img)}
                      className={`relative w-16 h-16 rounded-md overflow-hidden border-2 transition-all flex-shrink-0 cursor-pointer ${
                        activeImage === img
                          ? "border-red-600 ring-1 ring-red-600"
                          : "border-transparent bg-gray-100"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`thumb-${index}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* ---------- INFO ---------- */}
              <div className="lg:col-span-7 p-6 lg:pl-0">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-sm mb-6">
                  <div className="flex items-center gap-1">
                    <span className="text-muted-foreground">SKU:</span>
                    <span className="font-semibold">{product.sku}</span>
                  </div>
                  <Separator orientation="vertical" className="h-4" />
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="font-bold">
                      {Number(product.averageRating).toFixed(1)}
                    </span>
                    <span className="text-xs text-gray-500">
                      ({product.reviewCount} đánh giá) | Đã bán:{" "}
                      {product.soldCount}
                    </span>
                  </div>
                </div>

                {/* ---------- PRICE ---------- */}
                <div className="flex flex-col md:flex-row gap-3 mb-6 bg-red-50/50 p-4 rounded-lg border border-red-100">
                  <span className="text-3xl md:text-4xl font-bold text-red-600">
                    {formatVND(product.price)}
                  </span>

                  <div className="flex items-center gap-3">
                    {product.originalPrice &&
                      product.originalPrice > product.price && (
                        <span className="text-lg text-gray-400 line-through">
                          {formatVND(product.originalPrice)}
                        </span>
                      )}

                    {product.discountPercentage &&
                      product.discountPercentage > 0 && (
                        <Badge
                          variant="outline"
                          className="border-red-600 text-red-600 font-bold"
                        >
                          -{product.discountPercentage}%
                        </Badge>
                      )}
                  </div>
                </div>

                {/* ---------- ACTIONS ---------- */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                  <Button
                    onClick={handleAddToCart}
                    disabled={isAddingToCart || product.stockQuantity <= 0}
                    className="flex-1 h-14 bg-red-600 hover:bg-red-700 text-white shadow-lg cursor-pointer"
                  >
                    <span className="flex items-center gap-2 text-lg font-bold uppercase">
                      {product.stockQuantity > 0 ? "MUA NGAY" : "HẾT HÀNG"}
                      <ShoppingCart className="w-5 h-5" />
                    </span>
                  </Button>

                  <Button
                    variant="outline"
                    className={`h-14 w-14 border-gray-300 flex-shrink-0 ${
                      isWishlisted ? "border-red-500 bg-red-50" : ""
                    }`}
                    onClick={handleToggleWishlist}
                    title="Thêm vào yêu thích"
                  >
                    <Heart
                      className={`w-6 h-6 transition-colors ${
                        isWishlisted
                          ? "fill-red-600 text-red-600"
                          : "text-gray-400 hover:text-red-500"
                      }`}
                    />
                  </Button>
                </div>

                {/* ---------- POLICIES ---------- */}
                <div className="border-t pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex gap-3">
                    <Truck className="w-5 h-5 text-red-600" />
                    <p className="text-sm font-medium">Miễn phí vận chuyển</p>
                  </div>
                  <div className="flex gap-3">
                    <ShieldCheck className="w-5 h-5 text-red-600" />
                    <p className="text-sm font-medium">Bảo hành chính hãng</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ---------- SPECS ---------- */}
        {product.specifications && (
          <Card>
            <CardHeader>
              <CardTitle className="uppercase border-l-4 border-red-600 pl-3">
                Thông số kỹ thuật
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ProductSpecsTable specs={product.specifications} />
            </CardContent>
          </Card>
        )}

        {/* ---------- REVIEWS ---------- */}
        <ProductReviews productId={product._id} />
        {/* ---------- RELATED ---------- */}
        {relatedProducts.length > 0 && (
          <Card>
            <CardContent className="p-4">
              <ProductListCarousel
                title="Sản phẩm tương tự"
                products={relatedProducts}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
