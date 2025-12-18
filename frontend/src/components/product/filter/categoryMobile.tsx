import React, { useState, useEffect } from "react";
import { Menu, ChevronDown, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { categoryService } from "@/services/api/customer/category.service";
import { type ICategory } from "@/types/category";

interface ICategoryWithChildren extends ICategory {
  children: ICategory[];
}

const CategoryMobile: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<ICategoryWithChildren[]>([]);
  const [loading, setLoading] = useState(false);

  const [expandedCats, setExpandedCats] = useState<string[]>([]);

  useEffect(() => {
    if (open && categories.length === 0) {
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
                  child.parentCategory &&
                  child.parentCategory._id === parent._id
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
    }
  }, [open, categories.length]);

  const toggleExpand = (id: string) => {
    setExpandedCats((prev) =>
      prev.includes(id) ? prev.filter((catId) => catId !== id) : [...prev, id]
    );
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="flex flex-col items-center gap-1 flex-1 text-white border-none bg-transparent cursor-pointer focus:outline-none">
          <Menu className="h-6 w-6" />
          <span className="text-[10px]">Danh mục</span>
        </button>
      </SheetTrigger>

      <SheetContent
        side="left"
        className="w-[300px] p-0 bg-[#1c1c1f] border-r-gray-800 text-white"
      >
        <SheetHeader className="p-4 bg-[#1c1c1f] text-white border-b border-gray-800">
          <SheetTitle className="text-white text-left text-lg font-bold flex items-center gap-2">
            <Menu className="w-5 h-5" /> Danh mục sản phẩm
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-60px)]">
          {loading ? (
            <div className="p-4 space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-12 w-full bg-gray-800" />
              ))}
            </div>
          ) : (
            <div className="pb-6">
              {categories.map((cat) => {
                const isExpanded = expandedCats.includes(cat._id);
                return (
                  <div
                    key={cat._id}
                    className="border-b border-gray-800 last:border-b-0"
                  >
                    {/* Header danh mục Cha */}
                    <div
                      className="flex items-center justify-between py-3 px-4 hover:bg-gray-800/50 cursor-pointer transition-colors"
                      onClick={() => toggleExpand(cat._id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-white rounded-sm p-0.5 flex items-center justify-center">
                          {cat.imageUrl ? (
                            <img
                              src={cat.imageUrl}
                              alt={cat.name}
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <Menu className="w-3 h-3 text-black" />
                          )}
                        </div>
                        <span className="font-semibold text-sm uppercase text-gray-200">
                          {cat.name}
                        </span>
                      </div>
                      {cat.children.length > 0 &&
                        (isExpanded ? (
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        ))}
                    </div>

                    {/* Danh sách danh mục Con */}
                    {isExpanded && (
                      <div className="bg-[#151517] animate-in slide-in-from-top-2 duration-200">
                        {/* Link xem tất cả cha */}
                        <Link
                          to={`/category/${cat._id}`}
                          className="block py-2 pl-12 pr-4 text-sm text-red-400 font-medium hover:bg-gray-800"
                          onClick={() => setOpen(false)}
                        >
                          Xem tất cả {cat.name}
                        </Link>

                        {/* Loop con */}
                        {cat.children.map((child) => (
                          <Link
                            key={child._id}
                            to={`/category/${
                              cat._id
                            }?category=${encodeURIComponent(child.name)}`}
                            className="block py-2 pl-12 pr-4 text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                            onClick={() => setOpen(false)}
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default CategoryMobile;
