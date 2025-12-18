import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import { FILTER_CONFIG } from "@/types/filter";
import { formatVND } from "@/utils/admin/formatMoney";

// --- 1. COMPONENT LỌC GIÁ (SLIDER) ---
const PriceFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [range, setRange] = useState([0, 50000000]);
  const [isOpen, setIsOpen] = useState(false);

  // Đồng bộ state với URL mỗi khi mở Popover hoặc URL thay đổi
  useEffect(() => {
    const gte = Number(searchParams.get("price[gte]")) || 0;
    const lte = Number(searchParams.get("price[lte]")) || 50000000;
    setRange([gte, lte]);
  }, [searchParams, isOpen]);

  const handleApply = () => {
    setSearchParams((prev) => {
      prev.set("price[gte]", range[0].toString());
      prev.set("price[lte]", range[1].toString());
      prev.set("page", "1"); // Reset về trang 1 khi lọc mới
      return prev;
    });
    setIsOpen(false);
  };

  const handleClear = () => {
    setSearchParams((prev) => {
      prev.delete("price[gte]");
      prev.delete("price[lte]");
      return prev;
    });
    setRange([0, 50000000]);
    setIsOpen(false);
  };

  // Hàm xử lý khi người dùng nhập số trực tiếp vào ô Input
  const handleInputChange = (index: number, value: string) => {
    const numValue = Number(value.replace(/\D/g, "")); // Loại bỏ ký tự không phải số
    const newRange = [...range];
    newRange[index] = numValue;
    setRange(newRange);
  };

  const isActive =
    searchParams.has("price[gte]") || searchParams.has("price[lte]");

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "bg-white",
            isActive && "border-red-600 text-red-600 bg-red-50"
          )}
        >
          Giá{" "}
          {isActive
            ? `(${formatVND(range[0])}đ - ${formatVND(range[1])}đ)`
            : ""}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="start">
        <div className="space-y-6">
          <p className="text-sm font-semibold text-gray-700">
            Chọn khoảng giá (đ)
          </p>

          {/* Ô NHẬP SỐ CỤ THỂ */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Input
                type="text"
                value={formatVND(range[0])}
                onChange={(e) => handleInputChange(0, e.target.value)}
                className="h-9 px-2 text-sm text-center"
              />
              <span className="absolute -top-5 left-0 text-[10px] text-gray-400 uppercase">
                Từ
              </span>
            </div>
            <span className="text-gray-400">—</span>
            <div className="relative">
              <Input
                type="text"
                value={formatVND(range[1])}
                onChange={(e) => handleInputChange(1, e.target.value)}
                className="h-9 px-2 text-sm text-center"
              />
              <span className="absolute -top-5 left-0 text-[10px] text-gray-400 uppercase">
                Đến
              </span>
            </div>
          </div>

          {/* SLIDER */}
          <Slider
            value={range}
            min={0}
            max={200000000} // Giới hạn kéo tối đa 100 triệu
            step={500000}
            onValueChange={setRange}
            className="my-6"
          />

          {/* NÚT ĐIỀU KHIỂN */}
          <div className="flex justify-between gap-3 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleClear}
              className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
            >
              Bỏ chọn
            </Button>
            <Button
              size="sm"
              onClick={handleApply}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold"
            >
              Xem kết quả
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

// --- 2. COMPONENT LỌC THUỘC TÍNH CHUNG (CHECKBOX) ---
interface AttributeFilterProps {
  label: string;
  paramKey: string; // Key trên URL (ví dụ: 'brand', 'specifications.ram')
  options: { label: string; value: string }[];
}

const AttributeFilter: React.FC<AttributeFilterProps> = ({
  label,
  paramKey,
  options,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selected, setSelected] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const current = searchParams.get(paramKey);
    if (current) {
      // Giả sử URL dạng: param=A,B,C
      setSelected(current.split(","));
    } else {
      setSelected([]);
    }
  }, [searchParams, paramKey, isOpen]);

  const toggleOption = (value: string) => {
    setSelected((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const handleApply = () => {
    setSearchParams((prev) => {
      if (selected.length > 0) {
        prev.set(paramKey, selected.join(","));
      } else {
        prev.delete(paramKey);
      }
      prev.set("page", "1");
      return prev;
    });
    setIsOpen(false);
  };

  const handleClear = () => {
    setSelected([]);
    setSearchParams((prev) => {
      prev.delete(paramKey);
      return prev;
    });
    setIsOpen(false);
  };

  const isActive = selected.length > 0;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "bg-white",
            isActive && "border-red-600 text-red-600 bg-red-50"
          )}
        >
          {label} {isActive ? `(${selected.length})` : ""}{" "}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3" align="start">
        <div className="space-y-3 ">
          <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto cursor-pointer">
            {options.map((opt) => (
              <div key={opt.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`${paramKey}-${opt.value}`}
                  checked={selected.includes(opt.value)}
                  onCheckedChange={() => toggleOption(opt.value)}
                />
                <label
                  htmlFor={`${paramKey}-${opt.value}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {opt.label}
                </label>
              </div>
            ))}
          </div>
          <div className="flex justify-between gap-2 pt-2 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={handleClear}
              className="w-1/2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 cursor-pointer"
            >
              Bỏ chọn
            </Button>
            <Button
              size="sm"
              onClick={handleApply}
              className="w-1/2 bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
            >
              Xem kết quả
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

interface ProductFilterBarProps {
  categoryName?: string;
}

export const ProductFilterBar: React.FC<ProductFilterBarProps> = ({
  categoryName = "",
}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const dynamicFilters = Object.keys(FILTER_CONFIG).find((key) =>
    categoryName.toLowerCase().includes(key.toLowerCase())
  )
    ? FILTER_CONFIG["Laptop"]
    : FILTER_CONFIG["default"];

  const handleResetAll = () => {
    setSearchParams((prev) => {
      const cat = prev.get("category");
      const newParams = new URLSearchParams();
      if (cat) newParams.set("category", cat);
      return newParams;
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4 p-2 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 mr-2">
        <span className="bg-white p-2 rounded-md border shadow-sm">Bộ lọc</span>
      </div>

      {/* 1. Tình trạng (Cố định) */}
      <AttributeFilter
        label="Tình trạng"
        paramKey="status"
        options={[
          { label: "Đang bán", value: "active" },
          { label: "Hết hàng", value: "out_of_stock" },
        ]}
      />

      {/* 2. Giá (Slider) */}
      <PriceFilter />

      {/* 3. Hãng (Hiện tại rỗng) */}
      <AttributeFilter label="Hãng" paramKey="brand" options={[]} />

      {/* 4. Filter Specifications */}
      {dynamicFilters.map((filter, index) => (
        <AttributeFilter
          key={index}
          label={filter.label}
          paramKey={filter.key}
          options={filter.options}
        />
      ))}

      {/* Xóa bộ lọc */}
      {Array.from(searchParams.keys()).some(
        (k) => k !== "category" && k !== "page" && k !== "sort"
      ) && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleResetAll}
          className="ml-auto text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <X className="w-4 h-4 mr-1" /> Xóa bộ lọc
        </Button>
      )}
    </div>
  );
};
