import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, Loader2, PackageSearch } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

import { productService } from "@/services/api/customer/product.service";
import { type IProduct } from "@/types/product";
import { formatVND } from "@/utils/admin/formatMoney";

interface SearchBarProps {
  className?: string;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  className,
  placeholder = "Bạn cần tìm gì?",
}) => {
  const navigate = useNavigate();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [results, setResults] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // 1. Xử lý Debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);
    return () => clearTimeout(timer);
  }, [query]);

  // 2. Gọi API khi debouncedQuery thay đổi
  useEffect(() => {
    const fetchPreview = async () => {
      if (!debouncedQuery.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const res = await productService.getProducts({
          keyword: debouncedQuery,
          limit: 5,
          fields: "name,price,images,slug,averageRating,discountPercentage",
        });

        if (res.data?.products) {
          setResults(res.data.products);
          setShowDropdown(true);
        }
      } catch (error) {
        console.error("Lỗi tìm kiếm:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPreview();
  }, [debouncedQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = () => {
    if (!query.trim()) return;
    setShowDropdown(false);
    navigate(`/products?keyword=${encodeURIComponent(query)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setShowDropdown(false);
  };

  return (
    <div ref={wrapperRef} className={cn("relative w-2/5", className)}>
      {/* INPUT AREA */}
      <div className="relative flex items-center">
        <Input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!showDropdown) setShowDropdown(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="pr-20 h-10 bg-white text-black focus-visible:ring-red-500 rounded-md shadow-sm"
        />

        <div className="absolute right-12 flex items-center">
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
          ) : query ? (
            <button
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          ) : null}
        </div>

        <Button
          onClick={handleSearch}
          variant="ghost"
          size="sm"
          className="absolute right-1 hover:bg-transparent hover:text-red-600 text-gray-500"
        >
          <Search className="w-5 h-5" />
        </Button>
      </div>

      {/* DROPDOWN RESULT */}
      {showDropdown && query.trim() && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {loading ? (
            <div className="p-4 text-center text-sm text-gray-500">
              Đang tìm kiếm...
            </div>
          ) : results.length > 0 ? (
            <>
              <div className="p-2 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Gợi ý sản phẩm
              </div>
              <ScrollArea className="max-h-[350px]">
                {results.map((product) => (
                  <div
                    key={product._id}
                    onClick={() => {
                      navigate(`/product/detail/${product._id}`);
                      setShowDropdown(false);
                    }}
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100 last:border-0"
                  >
                    <div className="w-10 h-10 border rounded bg-white p-0.5 flex-shrink-0">
                      <img
                        src={product.images?.[0] || "https://placehold.co/50"}
                        alt={product.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {product.name}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-red-600">
                          {formatVND(product.price)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </ScrollArea>
              <div
                className="p-3 text-center bg-gray-50 border-t border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={handleSearch}
              >
                <span className="text-sm text-blue-600 font-medium">
                  Xem tất cả kết quả cho "{query}"
                </span>
              </div>
            </>
          ) : (
            <div className="p-8 flex flex-col items-center justify-center text-gray-400">
              <PackageSearch className="w-10 h-10 mb-2 opacity-50" />
              <span className="text-sm">Không tìm thấy sản phẩm nào.</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
