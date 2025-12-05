import ProductCard from "@/components/product/ProductCard";
import type { Product } from "@/types/product";

export default function ProductsDisplay({ products }: { products: Product[] }) {
  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}