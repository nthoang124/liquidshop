import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Star,
  Check,
  ShieldCheck,
  Truck,
  RotateCcw,
  Gift,
  ChevronRight,
  ShoppingCart,
  CreditCard,
  MapPin,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import type { Product } from "@/types/product";
import ProductSpecsTable from "@/components/product/ProductSpecs"; // Đã sửa đường dẫn import chuẩn
import ProductListCarousel from "@/components/common/carousel/ProductListCarousel";
import useDocumentTitle from "@/hooks/useDocumentTitle";

import pcData from "@/data/pcs.json";
import mouseData from "@/data/mice.json";
import keyboardData from "@/data/keyboards.json";

// Map dữ liệu
const DATABASE: Record<string, Product[]> = {
  pc: pcData as Product[],
  mouse: mouseData as Product[],
  keyboard: keyboardData as Product[],
};

// Helper format tiền
const formatCurrency = (value: number | undefined) => {
  if (value === undefined) return "Liên hệ";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};

// Helper lấy sản phẩm tương tự (Đã loại bỏ sản phẩm hiện tại)
const getRelatedProducts = (
  category: string | undefined,
  currentId: string | number | undefined
) => {
  if (!category) return [];
  const list = DATABASE[category] || [];
  // Lọc bỏ sản phẩm đang xem
  if (currentId) {
    return list.filter((p) => String(p.id) !== String(currentId));
  }
  return list;
};

const ProductDetailPage: React.FC = () => {
  const { category, id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [activeImage, setActiveImage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  // --- EFFECT: TÌM SẢN PHẨM KHI URL THAY ĐỔI ---
  useEffect(() => {
    setLoading(true);
    // Cuộn lên đầu trang mỗi khi đổi sản phẩm
    window.scrollTo(0, 0);

    if (category && id) {
      const productList = DATABASE[category];
      const foundProduct = productList?.find((p) => String(p.id) === id);

      if (foundProduct) {
        setProduct(foundProduct);
        setActiveImage(foundProduct.image);
      } else {
        setProduct(null);
      }
    }

    setLoading(false);
  }, [category, id]);

  // Loading State
  if (loading) {
    return (
      <>
        {useDocumentTitle("Đang tải sản phẩm...")}
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-12 bg-gray-300 rounded-full mb-4"></div>
            <div className="h-4 w-48 bg-gray-300 rounded"></div>
          </div>
        </div>
      </>
    );
  }

  // Not Found State
  if (!product) {
    return (
      <>
        {useDocumentTitle("Sản phẩm không tồn tại...")}
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">
            Không tìm thấy sản phẩm!
          </h2>
          <Button onClick={() => navigate("/")} variant="outline">
            Quay lại trang chủ
          </Button>
        </div>
      </>
    );
  }

  const images: string[] = [
    product.image,
    product.image,
    product.image,
    product.image,
  ];

  return (
    <>
      {useDocumentTitle(product.name)}
      <div className="bg-slate-50 min-h-screen py-6 font-sans">
        <div className="container mx-auto max-w-7xl px-4 space-y-6">
          {/* Breadcrumb */}
          <div className="flex items-center text-sm text-muted-foreground space-x-2">
            <button
              onClick={() => navigate("/")}
              className="hover:text-red-600 transition-colors cursor-pointer"
            >
              Trang chủ
            </button>
            <ChevronRight className="h-4 w-4" />
            <span
              className="capitalize hover:text-red-600 cursor-pointer"
              onClick={() => navigate(`/category/${category}`)}
            >
              {category === "pc" ? "PC Gaming" : category}
            </span>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground font-medium truncate max-w-[200px] md:max-w-md">
              {product.name}
            </span>
          </div>

          {/* MAIN */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-8">
              {/* IMAGE */}
              <div className="lg:col-span-5 p-6 border-b lg:border-b-0 lg:border-r border-gray-100">
                <div className="relative aspect-square bg-white rounded-lg overflow-hidden mb-4 flex items-center justify-center group">
                  <img
                    src={activeImage}
                    alt={product.name}
                    className="w-full h-full object-contain hover:scale-105 transition-transform duration-500 ease-out"
                  />
                </div>

                <div className="flex justify-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImage(img)}
                      className={`
                          relative w-16 h-16 rounded-md overflow-hidden border-2 transition-all cursor-pointer flex-shrink-0
                          ${
                            activeImage === img
                              ? "border-red-600 ring-1 ring-red-600"
                              : "border-transparent hover:border-gray-300 bg-gray-100"
                          }
                        `}
                    >
                      <img
                        src={img}
                        alt={`thumb-${index}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground bg-slate-50 p-2 rounded border border-slate-100">
                    <ShieldCheck className="w-4 h-4 text-green-600" /> 100%
                    Chính hãng
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground bg-slate-50 p-2 rounded border border-slate-100">
                    <RotateCcw className="w-4 h-4 text-blue-600" /> Đổi trả 7
                    ngày
                  </div>
                </div>
              </div>

              {/* DETAIL */}
              <div className="lg:col-span-7 p-6 lg:pl-0">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 leading-tight">
                  {product.name}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-sm mb-6">
                  <div className="flex items-center gap-1">
                    <span className="text-muted-foreground">Mã SP:</span>
                    <span className="font-semibold text-gray-900">
                      #{product.id}
                    </span>
                  </div>
                  <Separator orientation="vertical" className="h-4" />
                  <div className="flex items-center gap-1 text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating)
                            ? "fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="text-muted-foreground ml-1 text-xs text-gray-500">
                      ({product.reviewCount} đánh giá)
                    </span>
                  </div>
                </div>

                {/* Price Box */}
                <div className="flex flex-col md:flex-row items-start gap-3 mb-6 bg-red-50/50 p-4 rounded-lg border border-red-100">
                  <span className="text-3xl md:text-4xl font-bold text-red-600 tracking-tight">
                    {formatCurrency(product.price)}
                  </span>
                  <div className="flex flex-row gap-3 items-center mt-1">
                    {product.originalPrice &&
                      product.originalPrice > product.price && (
                        <span className="text-lg text-gray-400 font-normal line-through">
                          {formatCurrency(product.originalPrice)}
                        </span>
                      )}
                    {product.discountRate && product.discountRate > 0 && (
                      <div className="border border-red-600 rounded-md text-sm text-red-600 font-bold px-2 py-0.5">
                        -{product.discountRate}%
                      </div>
                    )}
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                  <Button className="flex-1 h-14 bg-red-600 hover:bg-red-700 text-white flex flex-col items-center justify-center gap-0 shadow-lg shadow-red-100 transition-all hover:-translate-y-0.5">
                    <div className="flex items-center gap-2 text-lg font-bold uppercase">
                      MUA NGAY <ShoppingCart className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-normal opacity-90">
                      Giao tận nơi hoặc nhận tại cửa hàng
                    </span>
                  </Button>

                  <Button
                    variant="outline"
                    className="flex-1 h-14 border-blue-600 text-blue-700 hover:bg-blue-50 flex flex-col items-center justify-center gap-0 transition-all hover:-translate-y-0.5"
                  >
                    <div className="flex items-center gap-2 text-lg font-bold uppercase">
                      TRẢ GÓP 0% <CreditCard className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-normal text-slate-500">
                      Duyệt hồ sơ nhanh chóng
                    </span>
                  </Button>
                </div>

                {/* Promotion */}
                {product.hasGift && (
                  <Card className="border-red-500 shadow-sm mb-6 overflow-hidden">
                    <div className="bg-red-600 text-white px-4 py-2 flex items-center gap-2 font-bold uppercase text-sm">
                      <Gift className="w-4 h-4" />
                      Ưu đãi đặc biệt
                    </div>
                    <CardContent className="p-4 bg-white pt-4">
                      <div className="mb-3 text-sm font-semibold text-red-600">
                        🎁 Quà tặng kèm sản phẩm
                      </div>
                      <ul className="space-y-2.5">
                        {[
                          "Giảm ngay 200.000đ khi mua kèm màn hình",
                          "Tặng Balo Gaming cao cấp chống nước",
                          "Hỗ trợ cài đặt phần mềm miễn phí trọn đời",
                        ].map((promo, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2 text-sm text-slate-700"
                          >
                            <Check className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                            <span>{promo}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {/* Policy */}
                <div className="border-t pt-4">
                  <h3 className="font-semibold text-sm mb-3">
                    Yên tâm mua hàng
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-slate-100 rounded-full text-red-600">
                        <Truck className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          Miễn phí vận chuyển
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Đơn hàng trên 500k toàn quốc
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-slate-100 rounded-full text-red-600">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          Hệ thống 50 cửa hàng
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Bảo hành dễ dàng mọi nơi
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SPECS */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-6 uppercase border-l-4 border-red-600 pl-3">
              Thông số kỹ thuật
            </h2>
            <ProductSpecsTable specs={product.specs} />
          </div>

          {/* RATING & REVIEW */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-6 uppercase border-l-4 border-red-600 pl-3">
              Đánh giá & Nhận xét
            </h2>
            <div className="flex flex-col items-center justify-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <span className="text-5xl font-bold text-gray-800 mb-2">
                {product.rating}
              </span>
              <div className="flex items-center gap-1 text-yellow-500 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-6 h-6 ${
                      i < Math.floor(product.rating)
                        ? "fill-current"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">
                Dựa trên {product.reviewCount} đánh giá từ khách hàng
              </span>
              <Button variant="outline" className="mt-4">
                Viết đánh giá của bạn
              </Button>
            </div>
          </div>

          {/* RELATED PRODUCT */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <ProductListCarousel
              title="Sản phẩm tương tự"
              products={getRelatedProducts(category, product.id)}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetailPage;
