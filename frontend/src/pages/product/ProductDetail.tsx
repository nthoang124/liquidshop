import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Star,
  ShieldCheck,
  Truck,
  ChevronRight,
  ShoppingCart,
  CreditCard,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";

import { productService } from "@/services/api/customer/product.service";
import { reviewService } from "@/services/api/customer/review.service";
// import { cartService } from "@/services/cart.service";
import type { IProduct } from "@/types/product";

import ProductSpecsTable from "@/components/product/ProductSpecTable";
import ProductListCarousel from "@/components/common/carousel/ProductListCarousel";
import useDocumentTitle from "@/hooks/useDocumentTitle";

import { formatVND } from "@/utils/admin/formatMoney";

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<IProduct | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<IProduct[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [comment, setComment] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [userRating, setUserRating] = useState<number>(5);

  const [activeImage, setActiveImage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

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

          fetchRelatedProducts(data.category?._id || "", data._id);

          fetchReviews(data._id);
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

  // --- 2. LẤY SẢN PHẨM TƯƠNG TỰ ---
  const fetchRelatedProducts = async (
    categoryId: string,
    currentId: string
  ) => {
    if (!categoryId) return;
    try {
      const res = await productService.getProducts({
        category: categoryId,
        limit: 10,
      });
      const related = res.data.products.filter((p) => p._id !== currentId);
      setRelatedProducts(related);
    } catch (error) {
      console.log("Failed to fetch related", error);
    }
  };

  // --- 3. Review ---
  const fetchReviews = async (productId: string) => {
    try {
      const res: any = await reviewService.getReviewsByProduct(productId);
      if (res && res.data) {
        setReviews(res.data);
      }
    } catch (error) {
      console.log("Failed to fetch reviews", error);
      setReviews([]);
    }
  };

  const handleSubmitReview = async () => {
    const token =
      localStorage.getItem("accessToken") ||
      sessionStorage.getItem("accessToken");
    if (!token) {
      toast.error("Vui lòng đăng nhập để đánh giá sản phẩm");
      navigate("/auth/login/customer");
      return;
    }

    if (!product) return;

    if (!comment.trim()) {
      toast.error("Vui lòng nhập nội dung đánh giá");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        productId: product._id,
        rating: userRating,
        comment: comment,
      };

      await reviewService.createReview(payload);

      toast.success("Đánh giá đã được gửi và đang chờ duyệt!");

      // Reset form
      setComment("");
      setUserRating(5);
    } catch (error: any) {
      console.error("Submit review error", error);
      toast.error(error.response?.data?.message || "Gửi đánh giá thất bại");
    } finally {
      setIsSubmitting(false);
    }
  };

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
                  <Button className="flex-1 h-14 bg-red-600 hover:bg-red-700 text-white shadow-lg cursor-pointer">
                    <span className="flex items-center gap-2 text-lg font-bold uppercase">
                      {product.stockQuantity > 0 ? "MUA NGAY" : "HẾT HÀNG"}
                      <ShoppingCart className="w-5 h-5" />
                    </span>
                  </Button>

                  <Button
                    variant="outline"
                    className="flex-1 h-14 border-blue-600 text-blue-700 cursor-pointer"
                  >
                    <span className="flex items-center gap-2 text-lg font-bold uppercase">
                      TRẢ GÓP 0% <CreditCard className="w-5 h-5" />
                    </span>
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
        <Card>
          <CardHeader>
            <CardTitle className="uppercase border-l-4 border-red-600 pl-3">
              Đánh giá & Nhận xét
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* --- FORM VIẾT ĐÁNH GIÁ MỚI --- */}
            <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="font-bold text-gray-800 mb-3">
                Gửi đánh giá của bạn
              </h3>

              {/* Chọn sao */}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm font-medium">Chọn mức đánh giá:</span>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setUserRating(star)}
                      className="p-1 transition-transform hover:scale-110 focus:outline-none"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= userRating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <span className="text-sm font-bold text-yellow-600 ml-2">
                  {userRating === 1
                    ? "Tệ"
                    : userRating === 2
                    ? "Khá tệ"
                    : userRating === 3
                    ? "Tạm Ổn"
                    : userRating === 4
                    ? "Tốt"
                    : userRating === 5
                    ? "Tuyệt vời"
                    : ""}
                </span>
              </div>

              {/* Nhập nội dung */}
              <div className="space-y-3">
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Hãy chia sẻ cảm nhận của bạn về sản phẩm này..."
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />

                <div className="flex justify-end">
                  <Button
                    onClick={handleSubmitReview}
                    disabled={isSubmitting}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    {isSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
                  </Button>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            {/* --- DANH SÁCH ĐÁNH GIÁ CŨ --- */}
            <h3 className="font-bold text-gray-800 mb-4">
              Khách hàng nhận xét ({reviews.length})
            </h3>

            {reviews.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá sản phẩm
                này!
              </div>
            ) : (
              <div className="space-y-6">
                {reviews.map((rv) => (
                  <div
                    key={rv._id}
                    className="border-b border-gray-100 last:border-0 pb-6"
                  >
                    <div className="flex items-start gap-3">
                      {/* Avatar giả lập */}
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold">
                        {rv.userId?.fullName?.charAt(0) || "U"}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-gray-900">
                            {rv.userId?.fullName || "Ẩn danh"}
                          </span>
                          <span className="text-xs text-gray-400">
                            {new Date(rv.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="flex text-yellow-400 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < rv.rating ? "fill-current" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>

                        <p className="text-gray-700 text-sm leading-relaxed">
                          {rv.comment}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

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
