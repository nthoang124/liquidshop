import React from "react";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";

import type { IProduct } from "@/types/product";

import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { getProductSpecsAttrs } from "@/utils/specMapper";

interface ProductCardProps {
  product: IProduct & {};
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, className }) => {
  const specItems = getProductSpecsAttrs(product);

  const categoryName =
    typeof product.category === "object"
      ? product.category.name
      : String(product.category);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  // Link tới chi tiết sản phẩm
  const productLink = `/product/${encodeURIComponent(categoryName)}/${
    product._id
  }`;

  const displayImage =
    product.images && product.images.length > 0
      ? product.images[0]
      : "https://placehold.co/300x300?text=No+Image";

  return (
    <Link to={productLink} className="block h-full">
      <Card
        className={cn(
          "group relative h-full bg-white border border-gray-200 rounded-lg hover:shadow-xl transition-all duration-300 p-3 flex flex-col justify-between overflow-hidden",
          className
        )}
      >
        {/* Hình ảnh sản phẩm */}
        <div className="relative w-full aspect-[4/3] flex items-center justify-center overflow-hidden rounded-md bg-white">
          <img
            src={displayImage}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
          />
          {product.status === "out_of_stock" && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold text-sm">
              Hết hàng
            </div>
          )}
        </div>

        {/* Tên sản phẩm */}
        <h3
          className="text-sm font-bold text-gray-800 line-clamp-2 min-h-[40px] hover:text-red-600 transition-colors"
          title={product.name}
        >
          {product.name}
        </h3>

        {/* --- HỘP CẤU HÌNH --- */}
        <div className="bg-[#f3f4f6] rounded-md p-2 text-[11px] text-gray-600">
          <div className="grid grid-cols-2 gap-y-1.5 gap-x-2">
            {specItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={index}
                  className="flex items-center gap-1.5 overflow-hidden"
                  title={item.label}
                >
                  <IconComponent className="w-3.5 h-3.5 flex-shrink-0 text-gray-500" />
                  <span className="truncate font-medium">{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* --- GIÁ & ĐÁNH GIÁ --- */}
        <div className="border-t border-gray-50">
          <div className="flex items-end gap-2 mb-1 h-5">
            {/* GIÁ GỐC / ORIGINAL PRICE */}
            {product.originalPrice && product.originalPrice > product.price && (
              <>
                <span className="text-sm text-gray-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>

                {/* % Giảm giá */}
                {product.discountPercentage &&
                  product.discountPercentage > 0 && (
                    <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-1 rounded">
                      -{product.discountPercentage}%
                    </span>
                  )}
              </>
            )}
          </div>

          {/* Giá bán chính thức / FINAL PRICE */}
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-[#d70018]">
              {formatPrice(product.price)}
            </span>

            {/* Rating Stars */}
            {product.averageRating > 0 && (
              <div className="flex items-center gap-0.5 text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full">
                <span className="font-bold text-orange-500">
                  {Number(product.averageRating).toFixed(1)}
                </span>
                <Star className="w-3 h-3 fill-orange-500 text-orange-500" />
              </div>
            )}
          </div>

          <div>
            <span className="text-xs text-gray-500">
              Đã bán {product.soldCount}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default ProductCard;
