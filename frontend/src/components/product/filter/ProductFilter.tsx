import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { ChevronDown, X, Filter } from "lucide-react";
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

import { brandService } from "@/services/api/customer/brand.service";
import { categoryService } from "@/services/api/customer/category.service";
import { formatVND } from "@/utils/admin/formatMoney";

import {
  FILTER_BLACKLIST,
  FILTER_BLACKLIST_PATTERNS,
} from "@/constants/filterBlackList";

const PriceFilter = () => {
  const MIN_PRICE = 0;
  const MAX_PRICE = 100_000_000;
  const STEP = 500_000;

  const [searchParams, setSearchParams] = useSearchParams();
  const [range, setRange] = useState([MIN_PRICE, MAX_PRICE]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const gte = Number(searchParams.get("price[gte]")) || 0;
    const lte = Number(searchParams.get("price[lte]")) || 100000000;
    setRange([gte, lte]);
  }, [searchParams, isOpen]);

  const handleApply = () => {
    setSearchParams((prev) => {
      prev.set("price[gte]", range[0].toString());
      prev.set("price[lte]", range[1].toString());
      prev.set("page", "1");
      return prev;
    });
    setIsOpen(false);
  };

  const isActive =
    searchParams.has("price[gte]") || searchParams.has("price[lte]");

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "bg-zinc-900 border-zinc-800 text-gray-300 rounded text-xs h-9",
            isActive && "border-red-600 text-red-500 bg-red-600/10"
          )}
        >
          Giá {isActive && `(${formatVND(range[0])} - ${formatVND(range[1])})`}
          <ChevronDown className="ml-2 h-3 w-3" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="w-80 rounded-xl border-zinc-800 bg-[#1a1a1c] p-4"
      >
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-white">Khoảng giá</h4>

          {/* INPUT */}
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min={MIN_PRICE}
              max={range[1]}
              step={STEP}
              value={range[0]}
              onChange={(e) => {
                const value = Number(e.target.value);
                setRange([Math.min(value, range[1]), range[1]]);
              }}
              className="h-9 bg-zinc-900 border-zinc-700 text-white text-xs"
              placeholder="Từ"
            />

            <span className="text-zinc-500">–</span>

            <Input
              type="number"
              min={range[0]}
              max={MAX_PRICE}
              step={STEP}
              value={range[1]}
              onChange={(e) => {
                const value = Number(e.target.value);
                setRange([range[0], Math.max(value, range[0])]);
              }}
              className="h-9 bg-zinc-900 border-zinc-700 text-white text-xs"
              placeholder="Đến"
            />
          </div>

          {/* SLIDER */}
          <Slider
            value={range}
            min={MIN_PRICE}
            max={MAX_PRICE}
            step={STEP}
            onValueChange={setRange}
            className="py-2"
          />

          {/* ACTION */}
          <Button
            size="sm"
            onClick={handleApply}
            className="w-full bg-red-600 text-white hover:bg-red-700"
          >
            Áp dụng
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

interface AttributeFilterProps {
  label: string;
  paramKey: string;
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
    const currentValues = searchParams.getAll(paramKey);
    // Logic fallback cho dấu phẩy
    if (currentValues.length === 1 && currentValues[0].includes(",")) {
      setSelected(currentValues[0].split(","));
    } else {
      setSelected(currentValues);
    }
  }, [searchParams, paramKey]);

  const handleApply = () => {
    setSearchParams((prev) => {
      prev.delete(paramKey);
      selected.forEach((val) => prev.append(paramKey, val));
      prev.set("page", "1");
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
            "h-9 max-w-[200px] gap-2 px-3 text-xs rounded border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800/50",
            isActive && "border-red-600 bg-red-600/10 text-red-500"
          )}
        >
          <span className="truncate">{label}</span>

          {isActive && (
            <span className="ml-auto rounded-full bg-red-600 px-1.5 py-0.5 text-[10px] font-medium text-white">
              {selected.length}
            </span>
          )}

          <ChevronDown className="h-3.5 w-3.5 opacity-70" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="w-72 rounded-xl border border-zinc-800 bg-[#1a1a1c] p-3 shadow-xl"
      >
        {/* Header */}
        <div className="mb-3 flex items-center justify-between">
          <div className="text-sm font-semibold text-white">{label}</div>

          {selected.length > 0 && (
            <button
              onClick={() => setSelected([])}
              className="text-xs text-zinc-400 hover:text-red-500"
            >
              Bỏ chọn
            </button>
          )}
        </div>

        {/* Options */}
        <div className="max-h-60 space-y-1 overflow-y-auto pr-1 custom-scrollbar">
          {options.map((opt) => {
            const checked = selected.includes(opt.value);

            return (
              <div
                key={opt.value}
                onClick={() =>
                  setSelected((prev) =>
                    checked
                      ? prev.filter((x) => x !== opt.value)
                      : [...prev, opt.value]
                  )
                }
                className={cn(
                  "flex items-center gap-3 rounded px-2 py-2 cursor-pointer transition",
                  checked ? "bg-red-600/10" : "hover:bg-zinc-800/60"
                )}
              >
                <Checkbox
                  checked={checked}
                  className="border-zinc-600 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                />

                <span
                  className={cn(
                    "text-sm",
                    checked ? "text-white" : "text-zinc-300"
                  )}
                >
                  {opt.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-3 flex gap-2 border-t border-zinc-800 pt-3">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 flex-1 text-zinc-400 hover:text-white"
            onClick={() => setIsOpen(false)}
          >
            Đóng
          </Button>

          <Button
            size="sm"
            className="h-8 flex-1 bg-red-600 text-white hover:bg-red-700"
            onClick={handleApply}
          >
            Áp dụng
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

interface ProductFilterBarProps {
  categoryName?: string;
}

const formatKeyToLabel = (key: string): string => {
  const map: Record<string, string> = {
    cpu: "Vi xử lý",
    ram: "RAM",
    vga: "Card đồ họa",
    ssd: "Ổ cứng",
    screen: "Màn hình",
    color: "Màu sắc",
    keyboard_switch: "Switch",
    dpi: "DPI",
    loai_ket_noi: "Loại kết nối",
    tan_so_quet: "Tần số quét",
  };
  if (map[key]) return map[key];
  const text = key.replace(/_/g, " ");
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export const ProductFilterBar: React.FC<ProductFilterBarProps> = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [brands, setBrands] = useState<{ label: string; value: string }[]>([]);
  const [dynamicSpecs, setDynamicSpecs] = useState<any[]>([]);

  const { id: pathCategoryId } = useParams();
  const currentCategoryId = pathCategoryId;

  // 1. Fetch Brands
  useEffect(() => {
    const fetchBrands = async () => {
      if (!currentCategoryId) return;
      try {
        const res = await brandService.getBrandsByCategory(currentCategoryId);
        if (res.brands) {
          setBrands(
            res.brands.map((b: any) => ({ label: b.name, value: b.name }))
          );
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchBrands();
  }, [currentCategoryId]);

  // 2. Fetch Dynamic Specs
  useEffect(() => {
    const fetchSpecs = async () => {
      if (!currentCategoryId) {
        setDynamicSpecs([]);
        return;
      }

      try {
        const res = await categoryService.getSpecsByCategoryId(
          currentCategoryId
        );

        if (res.data) {
          console.log("Fetched Specs:", res.data);
          const specFilters = Object.entries(res.data)
            .filter(([key]) => {
              if (key.length <= 2) return false;

              if (FILTER_BLACKLIST.includes(key)) return false;

              if (
                FILTER_BLACKLIST_PATTERNS.some((pattern) =>
                  key.includes(pattern)
                )
              )
                return false;

              return true;
            })
            .map(([key, values]) => {
              const optionsArray = Array.isArray(values)
                ? (values as unknown as string[])
                : [];

              return {
                label: formatKeyToLabel(key),
                key: `specifications.${key}`,
                options: optionsArray.map((val) => ({
                  label: val,
                  value: val,
                })),
              };
            });

          setDynamicSpecs(specFilters);
        }
      } catch (e) {
        console.error("Lỗi lấy thông số:", e);
      }
    };
    fetchSpecs();
  }, [currentCategoryId]);

  const handleResetAll = () => {
    const newParams = new URLSearchParams();
    if (searchParams.get("category"))
      newParams.set("category", searchParams.get("category")!);
    if (searchParams.get("keyword"))
      newParams.set("keyword", searchParams.get("keyword")!);
    newParams.set("page", "1");
    setSearchParams(newParams);
  };

  const hasFilter = Array.from(searchParams.keys()).some(
    (k) => !["page", "sort", "limit", "category", "keyword"].includes(k)
  );

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6 p-2 bg-transparent border-b border-zinc-800/50">
      <div className="flex items-center gap-2 text-[11px] font-bold text-zinc-400 uppercase bg-zinc-900/50 px-2 py-1.5 rounded border border-zinc-800 mr-2">
        <Filter className="w-5 h-5"></Filter> Bộ lọc
      </div>

      <AttributeFilter
        label="Tình trạng"
        paramKey="status"
        options={[
          { label: "Sẵn hàng", value: "active" },
          { label: "Hết hàng", value: "out_of_stock" },
        ]}
      />

      <PriceFilter />

      {brands.length > 0 && (
        <AttributeFilter
          label="Thương hiệu"
          paramKey="brand"
          options={brands}
        />
      )}

      {dynamicSpecs.map((spec) => (
        <AttributeFilter
          key={spec.key}
          label={spec.label}
          paramKey={spec.key}
          options={spec.options}
        />
      ))}

      {hasFilter && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleResetAll}
          className="ml-auto text-xs text-red-500 hover:text-red-400 hover:bg-zinc-900"
        >
          <X className="w-3 h-3 mr-1" /> Xóa lọc
        </Button>
      )}
    </div>
  );
};
