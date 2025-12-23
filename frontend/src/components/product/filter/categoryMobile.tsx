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
import { categoryService } from "@/services/api/customer/category.service";
import { getFiltersForCategory } from "@/types/filter";
import { type ICategory } from "@/types/category";
import getCategoryIcon from "@/utils/mapIcon";

interface ICategoryWithChildren extends ICategory {
  children: ICategory[];
}

const CategoryMobile: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<ICategoryWithChildren[]>([]);
  const [expanded, setExpanded] = useState<string[]>([]);

  useEffect(() => {
    if (open && categories.length === 0) {
      categoryService.getAllCategories().then((res) => {
        if (res.data) {
          const parents = res.data.filter((c) => !c.parentCategory);
          setCategories(
            parents.map((p) => ({
              ...p,
              children: res.data.filter((c) => c.parentCategory?._id === p._id),
            }))
          );
        }
      });
    }
  }, [open]);

  const toggle = (id: string) =>
    setExpanded((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="flex flex-col items-center gap-1 flex-1 text-white border-none bg-transparent">
          <Menu className="h-6 w-6" />{" "}
          <span className="text-[10px]">Danh mục</span>
        </button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-[300px] p-0 bg-[#1c1c1f] border-r-gray-800 text-white"
      >
        <SheetHeader className="p-4 border-b border-gray-800">
          <SheetTitle className="text-white text-left">Danh mục</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-60px)]">
          <div className="pb-10">
            {categories.map((cat) => {
              const isEx = expanded.includes(cat._id);
              const filters = getFiltersForCategory(cat.name);
              return (
                <div key={cat._id} className="border-b border-gray-800">
                  <div
                    className="flex items-center justify-between p-4"
                    onClick={() => toggle(cat._id)}
                  >
                    <div className="flex items-center gap-3 text-red-400">
                      {getCategoryIcon(cat.name)}
                      <span className="text-sm font-bold text-gray-200 uppercase">
                        {cat.name}
                      </span>
                    </div>
                    {isEx ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </div>

                  {/* THAY THẾ ĐOẠN NÀY */}
                  {isEx && (
                    <div className="bg-[#151517] pb-3 animate-in slide-in-from-top-1">
                      <Link
                        to={`/category/${cat._id}`}
                        className="block py-2 pl-12 text-sm text-red-500 font-bold border-b border-gray-800/50"
                        onClick={() => setOpen(false)}
                      >
                        Tất cả {cat.name}
                      </Link>
                      {/* API Sub-categories */}
                      {cat.children.map((child) => (
                        <Link
                          key={child._id}
                          to={`/category/${
                            cat._id
                          }?category=${encodeURIComponent(child.name)}`}
                          className="block py-2 pl-12 text-sm text-gray-400"
                          onClick={() => setOpen(false)}
                        >
                          {child.name}
                        </Link>
                      ))}
                      {/* Config Filters */}
                      {filters.map((group, idx) => (
                        <div key={idx} className="mt-2">
                          <p className="pl-12 text-[10px] font-bold text-gray-600 uppercase">
                            Theo {group.label}
                          </p>
                          {group.options.map((opt, i) => (
                            <Link
                              key={i}
                              to={`/category/${cat._id}?${
                                group.key
                              }=${encodeURIComponent(opt.value)}`}
                              className="block py-2 pl-12 text-sm text-gray-500 hover:text-red-400"
                              onClick={() => setOpen(false)}
                            >
                              {opt.label}
                            </Link>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
export default CategoryMobile;
