import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

import Carousel from "@/components/product/carousel/carousel";
import ProductCard from "@/components/product/ProductCard";
import type { IProduct } from "@/types/product";

interface ProductListCarouselProps {
  title: string;
  products: IProduct[];
  viewAllLink?: string;
  autoplay?: boolean;
  className?: string;
}

const ProductListCarousel: React.FC<ProductListCarouselProps> = ({
  title,
  products,
  viewAllLink,
  autoplay = false,
  className,
}) => {
  return (
    <div className={`w-full bg-white rounded-md px-3 py-3 ${className || ""}`}>
      <div className="flex items-center justify-between mb-4 px-1">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 uppercase border-l-4 border-red-600 pl-3">
          {title}
        </h2>

        {viewAllLink && (
          <Link
            to={viewAllLink}
            className="group flex items-center text-sm font-medium text-blue-600 hover:text-red-600 transition-colors"
          >
            Xem tất cả
            <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
          </Link>
        )}
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
