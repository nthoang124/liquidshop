import React, { useEffect, useState } from "react";
import { productService } from "@/services/api/customer/product.service";
import ProductCard from "@/components/product/ProductCard";
import type { IProduct } from "@/types/product";
import { Loader2 } from "lucide-react";

interface ChatProductGridProps {
  productIds: string[];
}

const ChatProductGrid: React.FC<ChatProductGridProps> = ({ productIds }) => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchProducts = async () => {
      if (!productIds || productIds.length === 0) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const productPromises = productIds.map((id) =>
          productService.getProductDetail(id)
        );
        const results = await Promise.all(productPromises);
        if (isMounted) {
          setProducts(results.filter((p): p is IProduct => p !== null));
        }
      } catch (error) {
        console.error("Lỗi tải sản phẩm trong chat:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchProducts();
    return () => {
      isMounted = false;
    };
  }, [JSON.stringify(productIds)]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-xs text-gray-500 py-2 pl-1">
        <Loader2 className="w-3 h-3 animate-spin" /> Đang chuẩn bị danh sách...
      </div>
    );
  }

  if (products.length === 0) return null;

  return (
    <div className="mt-3 flex flex-col gap-3">
      {products.map((product) => (
        <div
          key={product._id}
          className="w-full animate-in fade-in slide-in-from-top-2 duration-300"
        >
          <ProductCard
            product={product}
            className="w-full shadow-sm border border-gray-100 sm:hover:shadow-md"
          />
        </div>
      ))}
    </div>
  );
};

export default ChatProductGrid;
