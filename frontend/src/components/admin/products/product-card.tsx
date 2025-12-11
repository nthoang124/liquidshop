import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import type { IProduct } from "@/services/api/admin/product";

interface ProductCardProps {
  product: IProduct;
  onEdit: (id: string) => void;
  onDelete: (product: IProduct) => void;
}

export default function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
  return (
    <div className="w-full max-w-md bg-white shadow-sm rounded-xl border border-gray-200 p-4 flex flex-col gap-4 hover:shadow-md transition">
      
      {/* Image */}
      <img 
        src={product.images?.[0] || "/placeholder.png"} 
        alt={product.name} 
        className="w-full h-48 object-cover rounded-lg border"
      />

      {/* Name + SKU */}
      <div>
        <p className="text-lg font-semibold line-clamp-1">{product.name}</p>
        <p className="text-sm text-gray-500">SKU: {product.sku}</p>
      </div>

      {/* Price */}
      <div className="flex items-center gap-2">
        <p className="text-xl font-bold text-red-600">
          {product.price.toLocaleString()}₫
        </p>

        {product.originalPrice && product.originalPrice > product.price && (
          <p className="text-sm line-through text-gray-400">
            {product.originalPrice.toLocaleString()}₫
          </p>
        )}
      </div>

      {/* Category – Brand */}
      <div className="text-sm text-gray-600 flex flex-col">
        <span>Danh mục: <b>{product.category?.name}</b></span>
        <span>Thương hiệu: <b>{product.brand?.name || "Không có"}</b></span>
      </div>

      {/* Status + stock */}
      <div className="flex items-center justify-between">
        <span
          className={`
            px-3 py-1 rounded-full text-xs font-semibold 
            ${product.status === "active" ? "bg-green-100 text-green-700" : ""}
            ${product.status === "inactive" ? "bg-gray-200 text-gray-700" : ""}
            ${product.status === "out_of_stock" ? "bg-red-100 text-red-700" : ""}
          `}
        >
          {product.status === "active" && "Đang bán"}
          {product.status === "inactive" && "Ngừng bán"}
          {product.status === "out_of_stock" && "Hết hàng"}
        </span>

        <span className="text-sm text-gray-600">
          Tồn kho: <b>{product.stockQuantity}</b>
        </span>
      </div>

      {/* Buttons */}
      <div className="flex justify-between gap-3 mt-2">
        <Button 
          variant="outline" 
          className="w-1/2 flex items-center gap-2"
          onClick={() => onEdit(product._id)}
        >
          <Pencil size={18} />
          Sửa
        </Button>

        <Button 
          variant="destructive" 
          className="w-1/2 flex items-center gap-2"
          onClick={() => onDelete(product)}
        >
          <Trash2 size={18} />
          Xóa
        </Button>
      </div>
    </div>
  );
}
