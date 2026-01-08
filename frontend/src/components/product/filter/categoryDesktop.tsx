import React, { useState, useEffect } from "react";
import { Menu, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { categoryService } from "@/services/api/customer/category.service";
import { type ICategory } from "@/types/category";
import { Link } from "react-router-dom";
import getCategoryIcon from "@/utils/mapIcon";

interface ICategoryWithChildren extends ICategory {
  children?: ICategoryWithChildren[];
}

const CategoryDropdownContent: React.FC = () => {
  const [categories, setCategories] = useState<ICategoryWithChildren[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIdx, setActiveIdx] = useState<number>(0);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await categoryService.getAllCategories();
        if (res.data) {
          setCategories(res.data as ICategoryWithChildren[]);
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

  if (loading)
    return (
      <div className="w-[900px] h-[500px] bg-[#151517] p-6 rounded border border-zinc-800">
        <Skeleton className="h-full w-full bg-zinc-800" />
      </div>
    );

  return (
    <div className="bg-[#151517]/95 backdrop-blur-md text-white shadow-2xl w-[1000px] border border-zinc-800 flex rounded overflow-hidden h-[550px] animate-in fade-in zoom-in-95">
      {/* CỘT DANH MỤC CHA (CẤP 1) */}
      <div className="w-64 bg-black/40 border-r border-zinc-800 py-2 overflow-y-auto no-scrollbar">
        {categories.map((cat, i) => (
          <div
            key={cat._id}
            onMouseEnter={() => setActiveIdx(i)}
            className={cn(
              "flex items-center gap-3 px-4 py-3 cursor-pointer text-sm font-bold uppercase tracking-tight",
              activeIdx === i
                ? "bg-zinc-800 text-red-500 border-l-4 border-red-600"
                : "text-gray-400 border-l-4 border-transparent hover:text-gray-200"
            )}
          >
            <span
              className={activeIdx === i ? "text-red-500" : "text-gray-500"}
            >
              {getCategoryIcon(cat.name)}
            </span>
            <span className="flex-1 truncate">{cat.name}</span>
            <ChevronRight
              className={cn(
                "w-4 h-4",
                activeIdx === i ? "opacity-100" : "opacity-20"
              )}
            />
          </div>
        ))}
      </div>

      {/* NỘI DUNG CHI TIẾT (CẤP 2 & CẤP 3) */}
      <div className="flex-1 p-6 bg-transparent overflow-y-auto no-scrollbar">
        <Link
          to={`/category/${activeCat?._id}`}
          className="text-xs text-red-500 hover:text-red-400 font-bold uppercase tracking-widest underline underline-offset-4 mb-6 block"
        >
          Xem tất cả {activeCat?.name}
        </Link>

        {/* LƯỚI HIỂN THỊ CÁC NHÓM DANH MỤC */}
        <div className="grid grid-cols-3 gap-x-6 gap-y-8">
          {activeCat?.children && activeCat.children.length > 0 ? (
            activeCat.children.map((group) => (
              <div key={group._id} className="space-y-3">
                {/* TIÊU ĐỀ NHÓM (CẤP 2) - Màu đỏ như GearVN */}
                <h3 className="font-bold text-red-600 uppercase text-[13px] tracking-wider border-b border-zinc-800/50 pb-1">
                  <Link
                    to={`/category/${activeCat._id}?sub=${group._id}`}
                    className="hover:underline"
                  >
                    {group.name}
                  </Link>
                </h3>

                {/* DANH SÁCH MỤC CON (CẤP 3) */}
                <ul className="space-y-1.5">
                  {group.children && group.children.length > 0 ? (
                    group.children.map((item) => (
                      <li key={item._id}>
                        <Link
                          to={`/category/${activeCat._id}?child=${item._id}`}
                          className="text-[13px] text-gray-400 hover:text-white block line-clamp-1"
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))
                  ) : (
                    <li className="text-[12px] italic text-gray-600">
                      Đang cập nhật...
                    </li>
                  )}
                </ul>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-gray-500 text-sm">
              Chưa có danh mục con
            </div>
          )}
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
        className="border-2 border-white bg-transparent rounded text-white hover:border-red-600 hover:text-red-600 gap-2 cursor-pointer font-bold uppercase transition-all"
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
