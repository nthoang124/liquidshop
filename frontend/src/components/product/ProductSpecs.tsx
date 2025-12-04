import React from "react";
import type { ProductSpecs } from "@/types/product";

interface ProductSpecsTableProps {
  specs: ProductSpecs;
}

const ProductSpecsTable: React.FC<ProductSpecsTableProps> = ({ specs }) => {
  // Ép kiểu ProductSpecs thành kiểu generic object để dễ dàng truy cập các key động (*Unit)
  const specObject = specs as unknown as Record<
    string,
    string | number | undefined
  >;

  const formatKey = (key: string) => {
    const upperKeys = [
      "cpu",
      "ram",
      "vga",
      "ssd",
      "hdd",
      "psu",
      "dpi",
      "led",
      "rgb",
    ];
    if (upperKeys.includes(key.toLowerCase())) {
      return key.toUpperCase();
    }
    return key.charAt(0).toUpperCase() + key.slice(1);
  };

  const displaySpecs = Object.entries(specObject)
    .filter(([key]) => !key.endsWith("Unit"))
    .map(([key, value]) => {
      if (value === undefined || value === null) return null;

      const unitKey = `${key}Unit`;
      const unit = specObject[unitKey] || ""; // Lấy đơn vị tương ứng (ví dụ: 'DPI')

      let displayValue = String(value);

      // Nếu có đơn vị, ghép giá trị và đơn vị lại (ví dụ: 30000 + DPI = "30000 DPI")
      if (unit) {
        displayValue = `${value} ${unit}`;
      }

      // Nếu giá trị là số và lớn, format số cho dễ đọc (ví dụ: 30000 -> 30.000)
      if (typeof value === "number" && value > 1000) {
        displayValue =
          new Intl.NumberFormat("vi-VN").format(value) +
          (unit ? ` ${unit}` : "");
      }

      return {
        key: key,
        displayValue: displayValue,
      };
    })
    .filter(
      (item): item is { key: string; displayValue: string } => item !== null
    );

  return (
    <div className="w-full rounded-lg border border-gray-200 bg-white text-sm">
      {/* Header của bảng */}
      <div className="overflow-x-auto scrollbar-hide">
        <div className="min-w-[500px] grid grid-cols-12 bg-gray-100 p-3 font-bold text-gray-700 border-b border-gray-200">
          <div className="col-span-3 md:col-span-2">Linh kiện</div>
          <div className="col-span-6 md:col-span-8">Thông tin sản phẩm</div>
          <div className="col-span-3 md:col-span-2 text-center">Bảo hành</div>
        </div>
        {/* Nội dung bảng */}
        <div className="divide-y divide-gray-100">
          {displaySpecs.map((item) => (
            <div
              key={item.key}
              className="min-w-[500px] grid grid-cols-12 p-3 hover:bg-gray-50 transition-colors items-center"
            >
              {/* Tên linh kiện */}
              <div className="col-span-3 md:col-span-2 font-bold text-gray-800">
                {formatKey(item.key)}
              </div>

              {/* Giá trị đã được ghép (ví dụ: "30.000 DPI") */}
              <div className="col-span-6 md:col-span-8 text-blue-500 font-medium">
                {item.displayValue}
              </div>

              {/* Bảo hành */}
              <div className="col-span-3 md:col-span-2 text-center text-gray-500">
                [...]
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductSpecsTable;
