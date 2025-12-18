import React, { useState, useEffect } from "react";
import { Menu, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { categoryService } from "@/services/api/customer/category.service";
import { type ICategory } from "@/types/category";
import { Link } from "react-router-dom";

interface ICategoryWithChildren extends ICategory {
  children: ICategory[];
}

const CategoryDropdownContent: React.FC = () => {
  const [categories, setCategories] = useState<ICategoryWithChildren[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategoryIndex, setActiveCategoryIndex] = useState<number>(0);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryService.getAllCategories();
        if (res.success && res.data) {
          const allCats = res.data;

          // Lọc danh mục Cha
          const parents = allCats.filter((c) => !c.parentCategory);

          // Gán con vào cha dựa trên _id
          const hierarchy = parents.map((parent) => ({
            ...parent,
            children: allCats.filter(
              (child) =>
                child.parentCategory && child.parentCategory._id === parent._id
            ),
          }));

          setCategories(hierarchy);
        }
      } catch (error) {
        console.error("Failed to load categories", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="w-[850px] h-[450px] bg-white shadow-xl rounded-md p-6 flex gap-4">
        <div className="w-64 space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
        <div className="flex-1 space-y-2">
          <Skeleton className="h-8 w-1/3 mb-4" />
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const activeCategory = categories[activeCategoryIndex];

  return (
    <div className="bg-white text-black shadow-xl w-[850px] border border-gray-200 flex rounded-md overflow-hidden animate-in fade-in zoom-in-95 duration-200 h-[450px]">
      {/* CỘT TRÁI: DANH SÁCH CHA */}
      <div className="w-72 bg-gray-50 border-r border-gray-200 py-2 overflow-y-auto">
        {categories.map((cat, i) => (
          <div
            key={cat._id}
            className={cn(
              "flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors text-sm font-medium group",
              activeCategoryIndex === i
                ? "bg-white text-red-600 border-l-4 border-red-600 shadow-sm"
                : "text-gray-600 hover:bg-gray-100 hover:text-black border-l-4 border-transparent"
            )}
            onMouseEnter={() => setActiveCategoryIndex(i)}
          >
            {/* Hiển thị Icon từ URL hoặc Icon mặc định */}
            <div className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded-sm p-0.5">
              {cat.imageUrl ? (
                <img
                  src={cat.imageUrl}
                  alt={cat.name}
                  className="w-full h-full object-contain mix-blend-multiply"
                />
              ) : (
                <Menu className="w-4 h-4 text-gray-400" />
              )}
            </div>

            <span className="flex-1 truncate">{cat.name}</span>
            {cat.children.length > 0 && (
              <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-red-500" />
            )}
          </div>
        ))}
      </div>

      {/* CỘT PHẢI: DANH SÁCH CON */}
      <div className="flex-1 p-6 bg-white overflow-y-auto">
        {activeCategory ? (
          <div>
            <div className="flex items-center gap-2 mb-6 border-b pb-2 border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 uppercase tracking-wide">
                {activeCategory.name}
              </h3>
              <Link
                to={`/category/${activeCategory._id}`}
                className="text-xs text-blue-500 hover:underline ml-auto"
              >
                Xem tất cả
              </Link>
            </div>

            {activeCategory.children.length > 0 ? (
              <div className="grid grid-cols-3 gap-y-4 gap-x-6">
                {activeCategory.children.map((child) => (
                  <Link
                    key={child._id}
                    to={`/category/${
                      activeCategory._id
                    }?category=${encodeURIComponent(child.name)}`}
                    // Lưu ý: Link này tùy thuộc vào logic filter của bạn.
                    // Nếu bạn lọc theo sub-cat, có thể cần param khác.
                    // Ở đây tôi giả sử lọc theo tên con trong trang cha.
                    className="flex items-center gap-2 hover:text-red-600 transition-colors text-sm text-gray-600 group/item"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover/item:bg-red-500 transition-colors"></span>
                    {child.name}
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm italic">
                Đang cập nhật danh mục con...
              </p>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            Chọn một danh mục để xem chi tiết
          </div>
        )}
      </div>
    </div>
  );
};

// --- Component Chính ---
const CategoryDesktop: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div
      className="relative group z-50" // Thêm z-50
      onMouseEnter={() => setIsDropdownOpen(true)}
      onMouseLeave={() => setIsDropdownOpen(false)}
    >
      <Button
        variant="outline"
        className="border-2 border-white bg-transparent text-white hover:bg-white hover:text-black hover:border-white font-medium ml-3 flex gap-2 cursor-pointer"
      >
        <Menu className="h-4 w-4" />
        Danh mục
      </Button>

      {isDropdownOpen && (
        <div className="absolute left-0 top-full pt-2">
          <CategoryDropdownContent />
        </div>
      )}
    </div>
  );
};

export default CategoryDesktop;
