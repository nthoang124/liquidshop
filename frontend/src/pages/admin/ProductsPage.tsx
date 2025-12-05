import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"

import { Button } from "@/components/ui/button"
import { useState } from "react"
import ProductsDisplay from "@/components/admin/products/products-view"

import mouses from "@/data/mice.json"
import keyboards from "@/data/keyboards.json"
import pcs from "@/data/pcs.json"

import type { Product } from "@/types/product"
import type { ProductCategory } from "@/types/product"

export default function ProductsPage() {
  // Gộp tất cả sản phẩm thành 1 list
  const allProducts: Product[] = [
  ...mouses.map((p) => ({ ...p, category: p.category as ProductCategory })),
  ...keyboards.map((p) => ({ ...p, category: p.category as ProductCategory })),
  ...pcs.map((p) => ({ ...p, category: p.category as ProductCategory })),
];

  // ===== STATES =====
  const [selectedType, setSelectedType] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)

  // ===== FILTER =====
  const filteredProducts: Product[] =
    selectedType === "all"
      ? allProducts
      : allProducts.filter((item) => item.category === selectedType)

  // ===== PAGINATION =====
  const itemsPerPage = 6
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage

  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  )

  return (
    <div className="space-y-6">

      {/* Header: Count + Sort + View toggle */}
      <div className="flex flex-col lg:flex-row gap-3 lg:gap-0 items-start justify-start lg:justify-between px-2">
        <Button>add Product</Button>

        <div className="flex flex-col md:flex-row items-center justify-start gap-3">

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm sm:text-md">Category</span>
            <Select
              onValueChange={(v) => {
                setSelectedType(v)
                setCurrentPage(1) // Reset pagination khi đổi category
              }}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Products</SelectItem>
                <SelectItem value="mouse">Mouse</SelectItem>
                <SelectItem value="keyboard">Keyboard</SelectItem>
                <SelectItem value="pc">PC</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <span className="text-sm">Sort by:</span>
            <Select>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Price" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price-asc">Price (Low → High)</SelectItem>
                <SelectItem value="price-desc">Price (High → Low)</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Toggle Grid/List */}
          {/* <Button variant="outline" size="icon">
            <LayoutGridIcon className="size-4" />
          </Button> */}

        </div>
      </div>

      {/* Product Grid */}
      <ProductsDisplay products={paginatedProducts} />

      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-8">
        <Button
          variant="outline"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
        >
          Prev
        </Button>

        {[...Array(totalPages)].map((_, idx) => (
          <Button
            key={idx}
            variant={currentPage === idx + 1 ? "default" : "outline"}
            onClick={() => setCurrentPage(idx + 1)}
          >
            {idx + 1}
          </Button>
        ))}

        <Button
          variant="outline"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
