import React from "react";

interface ProductSpecsTableProps {
  specs?: Record<string, string | number | any>;
}

// Từ điển map key từ API sang Tiếng Việt hiển thị
const SPEC_KEYS_MAP: Record<string, string> = {
  color: "Màu sắc",
  storage: "Dung lượng lưu trữ",
  screen: "Màn hình",
  chip: "Vi xử lý (Chip)",
  battery: "Dung lượng Pin",
  ram: "RAM",
  camera: "Camera",
  weight: "Trọng lượng",
  material: "Chất liệu",
  os: "Hệ điều hành",
  sim: "Thẻ SIM",
  // thêm các trường khác tùy ý
};

const ProductSpecsTable: React.FC<ProductSpecsTableProps> = ({ specs }) => {
  if (!specs || Object.keys(specs).length === 0) {
    return <p className="text-gray-500 italic">Chưa có thông số kỹ thuật.</p>;
  }

  const specEntries = Object.entries(specs);

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200">
      <table className="w-full text-sm text-left">
        <tbody className="divide-y divide-gray-200">
          {specEntries.map(([key, value], index) => {
            const displayLabel =
              SPEC_KEYS_MAP[key] || key.charAt(0).toUpperCase() + key.slice(1);

            return (
              <tr
                key={key}
                className={`transition-colors hover:bg-gray-50 ${
                  index % 2 === 0 ? "bg-gray-50/50" : "bg-white"
                }`}
              >
                <td className="w-1/3 px-4 py-3 font-medium text-gray-600 bg-gray-100/50">
                  {displayLabel}
                </td>
                <td className="px-4 py-3 font-semibold text-gray-900">
                  {value}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ProductSpecsTable;
