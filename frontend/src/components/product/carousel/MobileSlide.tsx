import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import type { IProduct } from "@/types/product";
import type { IBrand } from "@/types/brand";

interface MobileProductSlideProps {
  title: string;
  products: IProduct[];
  brands?: IBrand[];
  viewAllLink?: string;
  className?: string;
}

const MobileProductSlide: React.FC<MobileProductSlideProps> = ({
  title,
  products,
  brands = [],
  viewAllLink,
  className,
}) => {
  const navigate = useNavigate();

  return (
    <div className={`bg-white rounded-md p-3 mb-2 ${className || ""}`}>
      <div className="flex items-center justify-between mb-3 ">
        <h2 className="text-base font-bold text-gray-800 uppercase border-l-4 border-red-600 pl-2 leading-none">
          {title}
        </h2>
        {viewAllLink && (
          <Link
            to={viewAllLink}
            className="text-xs text-blue-600 flex items-center gap-0.5 font-medium active:text-red-600"
          >
            Xem tất cả <ChevronRight className="w-3 h-3" />
          </Link>
        )}
      </div>

      {/* BRANDS FILTER */}
      {brands && brands.length > 0 && (
        <div className="flex overflow-x-auto gap-2 mb-3 pb-1 no-scrollbar">
          {brands.map((brand) => (
            <button
              key={brand._id}
              onClick={() => navigate(`/products?brand=${brand.name}`)}
              className="flex-shrink-0 px-2.5 py-1 text-[11px] font-medium text-gray-600 bg-gray-100 rounded border border-gray-100 active:bg-red-50 active:border-red-200 active:text-red-600 transition-colors"
            >
              {brand.name}
            </button>
          ))}
        </div>
      )}

      {/* PRODUCTS LIST */}
      <div className="flex overflow-x-auto gap-2 pb-2 snap-x snap-mandatory scroll-smooth no-scrollbar">
        {products.map((product) => (
          <div
            key={product._id}
            className="w-[160px] flex-shrink-0 snap-start h-auto"
          >
            <ProductCard product={product} />
          </div>
        ))}

        {viewAllLink && (
          <div className="w-[100px] flex-shrink-0 snap-start flex items-center justify-center">
            <Link
              to={viewAllLink}
              className="flex flex-col items-center text-gray-500 text-xs gap-1 p-4"
            >
              <div className="bg-gray-100 rounded-full p-2">
                <ChevronRight className="w-5 h-5" />
              </div>
              <span>Xem thêm</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileProductSlide;
