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
import ProductSpecsTable from "../../components/product/ProductSpecs";
import ProductListCarousel from "@/components/common/carousel/ProductListCarousel";

import pcData from "@/data/pcs.json";
import mouseData from "@/data/mice.json";
import keyboardData from "@/data/keyboards.json";

const DATABASE: Record<string, Product[]> = {
  pc: pcData as Product[],
  mouse: mouseData as Product[],
  keyboard: keyboardData as Product[],
};

const formatCurrency = (value: number | undefined) => {
  if (value === undefined) return "Liên hệ";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};

const getProductArrayByCategory = (category: string | undefined) => {
  if (!category) return [];
  return DATABASE[category] || [];
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

    // Giả lập độ trễ mạng nhẹ
    const timer = setTimeout(() => {
      if (category && id) {
        const productList = DATABASE[category];

        // Tìm sản phẩm: so sánh id (chuyển về string để an toàn)
        const foundProduct = productList?.find((p) => String(p.id) === id);

        if (foundProduct) {
          setProduct(foundProduct);
          setActiveImage(foundProduct.image); // Set ảnh mặc định là ảnh chính
        } else {
          setProduct(null); // Không tìm thấy
        }
      }
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [category, id]);

  //   Loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-gray-300 rounded-full mb-4"></div>
          <div className="h-4 w-48 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  //Not found
  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Không tìm thấy sản phẩm!
        </h2>
        <p className="text-gray-500">
          Sản phẩm bạn tìm kiếm có thể đã bị xóa hoặc đường dẫn không đúng.
        </p>
        <Button onClick={() => navigate("/")} variant="outline">
          Quay lại trang chủ
        </Button>
      </div>
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
      {/* Main Detail */}
      <div className="bg-slate-50 py-6 shadow-md rounded-md">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex items-center text-sm text-muted-foreground mb-4 space-x-2">
            <button
              onClick={() => navigate("/")}
              className="hover:text-primary transition-colors cursor-pointer"
            >
              Trang chủ
            </button>
            <ChevronRight className="h-4 w-4" />
            <span
              className="capitalize hover:text-primary cursor-pointer"
              onClick={() => navigate(`/category/${category}`)}
            >
              {category === "pc" ? "PC Gaming" : category}
            </span>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground font-medium truncate max-w-[200px] md:max-w-md">
              {product.name}
            </span>
          </div>

          <div className="bg-background rounded-xl shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-8">
              <div className="lg:col-span-5 p-6 ">
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

              <div className="lg:col-span-7 p-6 lg:pl-0">
                {/* Header */}
                <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2 leading-tight">
                  {product.name}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-sm mb-6">
                  <div className="flex items-center gap-1">
                    <span className="text-muted-foreground">Mã SP:</span>
                    <span className="font-semibold text-foreground">
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
                    <span className="text-muted-foreground ml-1 text-xs">
                      ({product.reviewCount} đánh giá)
                    </span>
                  </div>
                </div>

                {/* Price Box */}
                <div className="flex flex-col md:flex-row items-start gap-3 mb-6 bg-red-50/50 p-4 rounded-lg border border-red-100">
                  <span className="text-3xl md:text-4xl font-bold text-red-600 tracking-tight">
                    {formatCurrency(product.price)}
                  </span>
                  <div className="flex flex-row gap-3">
                    {product.originalPrice &&
                      product.originalPrice > product.price && (
                        <span className="text-lg text-muted-foreground text-gray-500 font-normal line-through mt-1 mb-1.5">
                          {formatCurrency(product.originalPrice)}
                        </span>
                      )}
                    {product.discountRate && product.discountRate > 0 && (
                      <div className="border border-red-600 rounded-md text-md text-red-600 font-semibold px-2 my-1">
                        -{product.discountRate}%
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                  <Button className="flex-1 h-14 bg-red-600 hover:bg-red-700 text-white flex flex-col items-center justify-center gap-0 shadow-red-200 shadow-lg cursor-pointer">
                    <div className="flex items-center gap-2 text-lg font-bold uppercase">
                      MUA NGAY <ShoppingCart className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-normal opacity-90">
                      Giao tận nơi hoặc nhận tại cửa hàng
                    </span>
                  </Button>

                  <Button
                    variant="outline"
                    className="flex-1 h-14 border-blue-600 text-blue-700 hover:bg-blue-50 flex flex-col items-center justify-center gap-0 cursor-pointer"
                  >
                    <div className="flex items-center gap-2 text-lg font-bold uppercase">
                      TRẢ GÓP 0% <CreditCard className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-normal text-slate-500">
                      Duyệt hồ sơ nhanh chóng
                    </span>
                  </Button>
                </div>

                {/* Promotion Box */}
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

                {/* Policy Footer */}
                <div className="border-t pt-4 mb-5">
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
        </div>
      </div>
      {/* Similar products */}
      <div className="bg-slate-50 py-6 px-3 mt-4 shadow-md rounded-md">
        <ProductListCarousel
          title="Sản phẩm tương tự"
          products={getProductArrayByCategory(category)}
        />
      </div>
      {/* Specs */}
      <div className="bg-slate-50 py-6 px-3 mt-4 shadow-md rounded-md">
        <h2 className="text-lg font-bold">Thông số kỹ thuật</h2>
        <ProductSpecsTable specs={product.specs} />
      </div>

      {/* Rating & Reviews */}
      <div className="bg-slate-50 py-6 px-3 mt-4 shadow-md rounded-md">
        <h2 className="text-lg font-bold mb-5">Đánh giá và nhận xét</h2>
        <div className="flex gap-2">
          <span className="text-4xl font-bold">{product.rating}</span>
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
            <span className="text-muted-foreground ml-1 text-md text-gray-500">
              ({product.reviewCount} đánh giá)
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetailPage;
