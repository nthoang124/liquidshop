import type { IProduct } from "@/services/api/admin/product";
import ProductCard from "@/components/admin/products/product-card"

interface ProductsDisplayProps {
  products: IProduct[] | null;
  onEdit: (id: string) => void;
  onDelete: (product: IProduct) => void;
}

export default function ProductsDisplay({ products, onEdit, onDelete }: ProductsDisplayProps) {
  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products?.map((p) => (
        <ProductCard key={p._id} onDelete={onDelete} onEdit={onEdit} product={p} />
      ))}
    </div>
  );
}