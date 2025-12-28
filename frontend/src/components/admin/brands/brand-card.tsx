// src/components/admin/brand/brand-card.tsx
import { Edit, Trash } from "lucide-react"
import type { IBrand } from "@/types/brand"
import { Button } from "@/components/ui/button"

interface BrandCardProps {
  brand: IBrand
  onEdit: (brand: IBrand) => void
  onDelete: (brand: IBrand) => void
}

export default function BrandCard({ brand, onEdit, onDelete }: BrandCardProps) {
  return (
    <div
      className="
        group
        bg-white
        rounded-xl
        border
        shadow-xs
        transition-all
        duration-200
        overflow-hidden
        cursor-pointer
      "
    >
      {/* Ảnh thương hiệu */}
      <div className="relative w-full h-32 bg-slate-100">
        <img
          src={brand.logoUrl || "https://placehold.co/200x200?text=No+Image"}
          alt={brand.name}
          className="
            w-full h-full object-contain
            p-4
            transition-transform
            duration-300
          "
        />
      </div>

      <div className="p-3 flex flex-col items-center justify-between gap-2">
        <h3 className="font-medium text-sm md:text-base line-clamp-1">
          {brand.name}
        </h3>

        <div className="flex items-center gap-1">
          <Button
            size="icon"
            variant="outline"
            className="h-7 w-7 hover:bg-blue-50 hover:text-blue-600"
            onClick={() => onEdit(brand)}
          >
            <Edit className="h-3 w-3" />
          </Button>

          <Button
            size="icon"
            variant="outline"
            className="h-7 w-7 hover:bg-red-50 hover:text-red-600"
            onClick={() => onDelete(brand)}
          >
            <Trash color="red" className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  )
}
