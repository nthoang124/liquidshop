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
import { type ICategory } from "@/types/category";
import getCategoryIcon from "@/utils/mapIcon";
import { cn } from "@/lib/utils";

interface ICategoryWithChildren extends ICategory {
  children?: ICategoryWithChildren[];
}

const CategoryMobile: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<ICategoryWithChildren[]>([]);
  const [expanded, setExpanded] = useState<string[]>([]);

  useEffect(() => {
    if (open && categories.length === 0) {
      categoryService.getAllCategories().then((res) => {
        if (res.data) {
          setCategories(res.data as ICategoryWithChildren[]);
        }
      });
    }
  }, [open, categories.length]);

  const toggle = (id: string) =>
    setExpanded((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="flex flex-col items-center gap-1 flex-1 text-white border-none bg-transparent">
          <Menu className="h-6 w-6" />
          <span className="text-[10px]">Danh mục</span>
        </button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-[300px] p-0 bg-[#1c1c1f] border-r-gray-800 text-white"
      >
        <SheetHeader className="p-4 border-b border-gray-800">
          <SheetTitle className="text-white text-left font-bold uppercase tracking-widest text-sm">
            Danh mục sản phẩm
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-60px)]">
          <div className="pb-10">
            {categories.map((cat) => {
              const isEx = expanded.includes(cat._id);
              return (
                <div key={cat._id} className="border-b border-gray-800">
                  {/* CẤP 1: DANH MỤC GỐC */}
                  <div
                    className="flex items-center justify-between p-4 active:bg-zinc-800 transition-colors"
                    onClick={() => toggle(cat._id)}
                  >
                    <div className="flex items-center gap-3 text-red-500">
                      {getCategoryIcon(cat.name)}
                      <span
                        className={cn(
                          "text-sm font-bold uppercase transition-colors",
                          isEx ? "text-red-500" : "text-gray-200"
                        )}
                      >
                        {cat.name}
                      </span>
                    </div>
                    {isEx ? (
                      <ChevronDown className="w-4 h-4 text-red-500" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-600" />
                    )}
                  </div>

                  {/* HIỂN THỊ CẤP 2 VÀ CẤP 3 KHI MỞ RỘNG */}
                  {isEx && (
                    <div className="bg-[#151517] pb-3 animate-in slide-in-from-top-2 duration-200">
                      <Link
                        to={`/category/${cat._id}`}
                        className="block py-3 pl-12 text-sm text-red-500 font-bold border-b border-gray-800/30 italic"
                        onClick={() => setOpen(false)}
                      >
                        Tất cả {cat.name}
                      </Link>

                      {/* DUYỆT CẤP 2 (NHÓM HÀNG) */}
                      {cat.children && cat.children.length > 0 ? (
                        cat.children.map((group) => (
                          <div key={group._id} className="mt-4 px-4 pl-12">
                            <h4 className="text-[11px] font-black text-zinc-500 uppercase tracking-tighter mb-2 border-l-2 border-red-600 pl-2">
                              {group.name}
                            </h4>

                            {/* DUYỆT CẤP 3 (MỤC NHỎ) */}
                            <div className="space-y-1">
                              {group.children && group.children.length > 0 ? (
                                group.children.map((child) => (
                                  <Link
                                    key={child._id}
                                    to={`/category/${cat._id}?sub=${child._id}`}
                                    className="block py-1.5 text-sm text-gray-400 hover:text-white transition-colors"
                                    onClick={() => setOpen(false)}
                                  >
                                    {child.name}
                                  </Link>
                                ))
                              ) : (
                                <span className="text-xs text-zinc-700">
                                  Đang cập nhật...
                                </span>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="pl-12 py-2 text-xs text-zinc-600">
                          Chưa có danh mục con
                        </p>
                      )}
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
