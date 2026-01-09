import React from "react";
import { useSearchParams, Link, useLoaderData } from "react-router-dom";
import { Zap, ChevronRight, Home, LayoutGrid } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ProductFilterBar } from "@/components/product/filter/ProductFilter";
import { ProductSort } from "@/components/product/filter/ProductSort";
import ProductCard from "@/components/product/ProductCard";
import PaginationCustom from "@/components/common/Pagination";
import useDocumentTitle from "@/hooks/useDocumentTitle";

const CategoryDetailPage: React.FC = () => {
  const { categoryDetail, productResponse } = useLoaderData() as any;
  const [searchParams, setSearchParams] = useSearchParams();

  const pageFromUrl = Number(searchParams.get("page")) || 1;
  const sortOption = searchParams.get("sort") || "-createdAt";

  if (!categoryDetail)
    return <div className="p-10 text-white">Không tìm thấy danh mục</div>;

  useDocumentTitle(categoryDetail?.name || "Danh mục sản phẩm");

  return (
    <div className="py-4 min-h-screen container mx-auto px-4 bg-[#1a1a1a]">
      <nav className="flex items-center space-x-2 text-sm text-gray-400 mb-6 bg-[#151517]/80 p-3 rounded border border-zinc-800">
        <Link to="/" className="flex items-center hover:text-red-500">
          <Home className="w-4 h-4 mr-1" /> Trang chủ
        </Link>
        <ChevronRight className="w-4 h-4 text-zinc-700" />
        <span className="text-white font-semibold">{categoryDetail?.name}</span>
      </nav>

      <Card className="mb-6 bg-gradient-to-r from-red-600/20 to-zinc-900/90 border-zinc-800 rounded border-l-4 border-l-red-600">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <Zap className="w-6 h-6 text-red-500 fill-red-500" />
            <CardTitle className="text-2xl font-bold text-white uppercase tracking-tight">
              {categoryDetail?.name}
            </CardTitle>
          </div>
          <CardDescription className="text-gray-400">
            {categoryDetail?.description}
          </CardDescription>
        </CardHeader>
      </Card>

      <ProductFilterBar categoryName={categoryDetail?.name} />

      <div className="mb-6 flex flex-col md:flex-row justify-between items-center bg-[#151517]/90 p-4 rounded border border-zinc-800 gap-4">
        <div className="flex items-center text-gray-300">
          <LayoutGrid className="w-5 h-5 mr-2 text-red-500" />
          Tìm thấy{" "}
          <span className="text-red-500 font-black mx-1">
            {productResponse?.pagination?.total || 0}
          </span>{" "}
          sản phẩm
        </div>
        <ProductSort
          value={sortOption}
          onValueChange={(val) =>
            setSearchParams((p) => {
              p.set("sort", val);
              p.set("page", "1");
              return p;
            })
          }
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {productResponse?.data?.products.map((p: any) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>

      {productResponse?.pagination?.totalPages > 1 && (
        <PaginationCustom
          currentPage={pageFromUrl}
          totalPages={productResponse.pagination.totalPages}
          onPageChange={(page) =>
            setSearchParams((prev) => {
              prev.set("page", page.toString());
              return prev;
            })
          }
        />
      )}
    </div>
  );
};
export default CategoryDetailPage;
