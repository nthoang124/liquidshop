import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronRight, Truck, Dot } from "lucide-react";

import Carousel from "@/components/product/carousel/carousel";
import ProductCard from "@/components/product/ProductCard";
import type { IProduct } from "@/types/product";

interface ProductListCarouselProps {
  title: string;
  products: IProduct[];
  viewAllLink?: string;
  autoplay?: boolean;
  className?: string;
  brands?: any[];
}

const ProductListCarousel: React.FC<ProductListCarouselProps> = ({
  title,
  products,
  viewAllLink,
  autoplay = false,
  className,
  brands = [],
}) => {
  const navigate = useNavigate();

  return (
    <div className={`w-full bg-white rounded-md px-3 py-3 ${className || ""}`}>
      <div className="mb-4 px-1">
        {/* TOP */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* LEFT */}
          <div className="flex flex-col md:flex-row md:items-center gap-2">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 uppercase border-l-4 border-red-600 pl-3">
              {title}
            </h2>

            {/* Shipping badge */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Dot className="text-gray-400" />
              <Truck className="text-red-600 h-4 w-4" />
              <span>Miễn phí giao hàng</span>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            {/* Brands */}
            {brands && brands.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {brands.map((brand) => (
                  <span
                    key={brand._id}
                    onClick={() => navigate(`/products?brand=${brand.name}`)}
                    className="cursor-pointer px-2 py-1 text-xs font-medium
                bg-gray-100 hover:bg-red-50 hover:text-red-600
                rounded transition-colors"
                  >
                    {brand.name}
                  </span>
                ))}
              </div>
            )}

            {/* View all */}
            {viewAllLink && (
              <Link
                to={viewAllLink}
                className="inline-flex items-center text-sm font-medium
            text-blue-600 hover:text-red-600 transition-colors self-start md:self-auto"
              >
                Xem tất cả
                <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* --- CAROUSEL BODY --- */}
      <Carousel<IProduct>
        data={products}
        autoplay={autoplay}
        itemClassName="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
        renderItem={(product) => (
          <div className="h-full ">
            <ProductCard product={product} />
          </div>
        )}
      />
    </div>
  );
};

export default ProductListCarousel;
