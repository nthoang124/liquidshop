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
          "group relative bg-white border border-gray-200 rounded p-2",
          "flex flex-col gap-2",
          "h-full",
          "transition-shadow sm:hover:shadow-xl overflow-hidden",
          className
        )}
      >
        {/* IMAGE */}
        <div className="relative w-full aspect-square sm:aspect-[4/3] overflow-hidden rounded-md bg-white">
          <img
            src={displayImage}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-contain transition-transform sm:group-hover:scale-105"
          />
          {product.status === "out_of_stock" && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold text-xs sm:text-sm">
              Hết hàng
            </div>
          )}
        </div>

        {/* NAME */}
        <h3
          className="text-xs sm:text-sm font-bold text-gray-800 line-clamp-2 min-h-[2.5em] transition-colors sm:group-hover:text-red-600"
          title={product.name}
        >
          {product.name}
        </h3>

        <div className="bg-[#f3f4f6] rounded-md p-1.5 sm:p-2 text-[10px] sm:text-xs text-gray-600">
          <div className="flex flex-wrap gap-y-1 gap-x-3 items-center">
            {specItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={index}
                  className="flex items-center gap-1 min-w-fit"
                  title={item.label}
                >
                  <IconComponent className="w-2.5 h-2.5 sm:w-3 h-3 flex-shrink-0 text-gray-500" />
                  <span className="font-medium whitespace-nowrap">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* PRICE & RATING */}
        <div className="mt-auto pt-1 sm:pt-2 flex flex-col gap-1">
          {/* PRICE */}
          <div>
            {product.originalPrice && product.originalPrice > product.price && (
              <div className="flex flex-wrap items-center gap-1 text-[10px] sm:text-xs mb-0.5">
                <span className="text-gray-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
                {product.discountPercentage &&
                  product.discountPercentage > 0 && (
                    <span className="font-bold text-red-600 bg-red-50 border border-red-200 px-0.5 rounded text-[9px] sm:text-[10px]">
                      -{product.discountPercentage}%
                    </span>
                  )}
              </div>
            )}

            <span className="block text-sm sm:text-lg font-bold text-[#d70018]">
              {formatPrice(product.price)}
            </span>
          </div>

          {/* RATING */}
          <div className="flex flex-wrap items-center gap-2 text-[10px] sm:text-xs text-gray-500">
            {product.averageRating > 0 && (
              <div className="flex items-center gap-0.5 bg-yellow-50 border border-yellow-200 px-1 py-0.5 rounded-sm">
                <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-orange-500 text-orange-500" />
                <span className="font-bold text-orange-500">
                  {Number(product.averageRating).toFixed(1)}
                </span>
              </div>
            )}
            <span className="hidden sm:inline">Đã bán {product.soldCount}</span>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default ProductCard;
