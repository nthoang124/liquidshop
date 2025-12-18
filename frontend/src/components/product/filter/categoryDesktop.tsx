import React, { useState, useEffect, useMemo } from "react";
import { Menu, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { categoryService } from "@/services/api/customer/category.service";
import { type ICategory } from "@/types/category";
import { Link } from "react-router-dom";

import getCategoryIcon from "@/utils/mapIcon";
import { getFiltersForCategory } from "@/types/filter";

interface ICategoryWithChildren extends ICategory {
  children: ICategory[];
}

const CategoryDropdownContent: React.FC = () => {
  const [categories, setCategories] = useState<ICategoryWithChildren[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIdx, setActiveIdx] = useState<number>(0);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await categoryService.getAllCategories();
        if (res.success && res.data) {
          const parents = res.data.filter((c) => !c.parentCategory);
          const hierarchy = parents.map((p) => ({
            ...p,
            children: res.data.filter((c) => c.parentCategory?._id === p._id),
          }));
          setCategories(hierarchy);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchCats();
  }, []);

  const activeCat = categories[activeIdx];
  const activeFilters = useMemo(
    () => (activeCat ? getFiltersForCategory(activeCat.name) : []),
    [activeCat]
  );

  if (loading)
    return (
      <div className="w-[900px] h-[500px] bg-white p-6">
        <Skeleton className="h-full w-full" />
      </div>
    );

  return (
    <div className="bg-white text-black shadow-xl w-3xl border border-gray-200 flex rounded-md overflow-hidden h-[500px] animate-in fade-in zoom-in-95">
      {/* DANH MỤC CHA */}
      <div className="w-64 bg-gray-50 border-r border-gray-200 py-2 overflow-y-auto">
        {categories.map((cat, i) => (
          <div
            key={cat._id}
            onMouseEnter={() => setActiveIdx(i)}
            className={cn(
              "flex items-center gap-3 px-4 py-3 cursor-pointer text-sm font-medium transition-all",
              activeIdx === i
                ? "bg-white text-red-600 border-l-4 border-red-600 shadow-sm"
                : "text-gray-600 border-l-4 border-transparent"
            )}
          >
            <span
              className={activeIdx === i ? "text-red-600" : "text-gray-400"}
            >
              {getCategoryIcon(cat.name)}
            </span>
            <span className="flex-1 truncate">{cat.name}</span>
            <ChevronRight className="w-4 h-4 opacity-30" />
          </div>
        ))}
      </div>

      {/* CON */}
      <div className="flex-1 p-3 bg-white overflow-y-auto">
        <Link
          to={`/category/${activeCat?._id}`}
          className="text-xs text-blue-600 hover:text-red-600 font-medium underline"
        >
          Xem tất cả {activeCat?.name}
        </Link>
        <div className="grid grid-cols-3">
          {activeCat?.children.length > 0 && (
            <div className="col-span-3 mb-2">
              <h3 className="font-bold text-gray-800 uppercase text-xs mb-3 border-b pb-1">
                Danh mục con
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {activeCat.children.map((child) => (
                  <Link
                    key={child._id}
                    to={`/category/${
                      activeCat._id
                    }?category=${encodeURIComponent(child.name)}`}
                    className="text-sm text-gray-600 hover:text-red-600 transition-colors"
                  >
                    {child.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
          {activeFilters.map((group, idx) => (
            <div key={idx} className="space-y-2">
              <h3 className="font-bold text-xs text-red-600 uppercase">
                {group.label}
              </h3>
              <ul className="space-y-1">
                {group.options.map((opt, i) => (
                  <li key={i}>
                    <Link
                      to={`/category/${activeCat?._id}?${
                        group.key
                      }=${encodeURIComponent(opt.value)}`}
                      className="text-sm text-gray-500 hover:text-red-600 block transition-all hover:translate-x-1"
                    >
                      {opt.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const CategoryDesktop: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div
      className="relative group z-50"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <Button
        variant="outline"
        className="border-2 border-white bg-transparent text-white hover:bg-white hover:text-black gap-2 cursor-pointer"
      >
        <Menu className="h-4 w-4" /> Danh mục
      </Button>
      {isOpen && (
        <div className="absolute left-0 top-full pt-2">
          <CategoryDropdownContent />
        </div>
      )}
    </div>
  );
};
export default CategoryDesktop;
