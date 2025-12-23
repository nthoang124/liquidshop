import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { categoryService } from "@/services/api/customer/category.service";
import { Skeleton } from "@/components/ui/skeleton";
import { type ICategory } from "@/types/category";

const BottomCategory: React.FC = () => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);

        const res = await categoryService.getAllCategories();
        if (res.success && res.data) {
          setCategories(res.data);
        }
      } catch (error) {
        console.log("Failed to fetch categories: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="w-full bg-white rounded-md px-3 py-3 shadow-sm mt-4">
      <div className="flex flex-col justify-between mb-4 px-1">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 uppercase border-l-4 border-red-600 pl-3 mb-6 md:mb-10">
          Danh mục sản phẩm
        </h2>

        {loading ? (
          <div className="grid grid-cols-5 lg:grid-cols-10 gap-4">
            {Array.from({ length: 10 }).map((_, index) => (
              <div key={index} className="flex flex-col items-center space-y-2">
                <Skeleton className="h-16 w-16 rounded-full" />
                <Skeleton className="h-4 w-12" />
              </div>
            ))}
          </div>
        ) : (
          <div
            className="grid grid-rows-2 grid-flow-col gap-4 overflow-x-auto pb-4 snap-x scrollbar-hide
            md:grid-cols-5 lg:grid-cols-10 md:gap-8 md:overflow-visible md:max-h-none md:grid-flow-row"
          >
            {categories.map((category) => (
              <Link
                to={`/category/${category._id}`}
                key={category._id}
                className="flex-shrink-0 w-20 flex flex-col items-center justify-start snap-start md:w-auto group hover:bg-gray-50 p-2 rounded-lg transition-colors"
              >
                <div className="w-12 h-12 md:w-16 md:h-16 mb-2 flex items-center justify-center">
                  <img
                    src={
                      category.imageUrl ||
                      "https://placehold.co/64x64?text=No+Img"
                    }
                    alt={category.name}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://placehold.co/64x64?text=Error";
                    }}
                  />
                </div>
                <p className="text-sm text-center font-medium text-gray-700 group-hover:text-red-600 transition-colors line-clamp-2">
                  {category.name}
                </p>
              </Link>
            ))}
          </div>
        )}

        {!loading && categories.length === 0 && (
          <div className="text-center text-gray-500 py-4">
            Chưa có danh mục nào.
          </div>
        )}
      </div>
    </div>
  );
};

export default BottomCategory;
