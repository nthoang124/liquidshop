import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { Search, Home, ChevronRight, FilterX } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ProductFilterBar } from "@/components/product/filter/ProductFilter";
import { ProductSort } from "@/components/product/filter/ProductSort";
import ProductCard from "@/components/product/ProductCard";

import PaginationCustom from "@/components/common/Pagination";

import { productService } from "@/services/api/customer/product.service";
import { type IProductListResponse } from "@/types/product";

const DEFAULT_LIMIT = 20;

const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const keyword = searchParams.get("keyword") || "";
  const pageFromUrl = Number(searchParams.get("page")) || 1;
  const sortOption = searchParams.get("sort") || "-createdAt";

  const [productResponse, setProductResponse] =
    useState<IProductListResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        const params: any = {
          page: pageFromUrl,
          limit: DEFAULT_LIMIT,
          sort: sortOption,
          fields:
            "name,price,originalPrice,specifications,images,averageRating,soldCount,category,brand",
        };

        if (keyword) {
          params.keyword = keyword;
        }

        searchParams.forEach((value, key) => {
          if (["page", "limit", "sort", "keyword"].includes(key)) return;
          if (params[key]) {
            if (Array.isArray(params[key])) {
              params[key].push(value);
            } else {
              params[key] = [params[key], value];
            }
          } else {
            params[key] = value;
          }
        });

        const res = await productService.getProducts(params);
        setProductResponse(res);
      } catch (err) {
        console.error("Search error: ", err);
        setProductResponse(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [keyword, pageFromUrl, sortOption, searchParams]);

  const handlePageChange = (newPage: number) => {
    setSearchParams((prev) => {
      prev.set("page", newPage.toString());
      return prev;
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSortChange = (newSort: string) => {
    setSearchParams((prev) => {
      prev.set("sort", newSort);
      prev.set("page", "1");
      return prev;
    });
  };

  const clearFilters = () => {
    navigate("/search");
  };

  const products = productResponse?.data?.products || [];
  const pagination = productResponse?.pagination;
  const totalPages = pagination?.totalPage || 1;
  const totalResults = pagination?.total || 0;

  return (
    <div className="py-6 min-h-screen container mx-auto px-4 bg-gray-50/50">
      {/* BREADCRUMB */}
      <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
        <Link
          to="/"
          className="flex items-center hover:text-red-600 transition-colors"
        >
          <Home className="w-4 h-4 mr-1" /> Trang chủ
        </Link>
        <ChevronRight className="w-4 h-4 text-gray-300" />
        <span className="text-gray-900 font-semibold">Tìm kiếm</span>
      </nav>

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Search className="w-6 h-6 text-red-600" />
          {keyword ? (
            <>
              Kết quả tìm kiếm cho:{" "}
              <span className="text-red-600">"{keyword}"</span>
            </>
          ) : (
            <span>Tất cả sản phẩm</span>
          )}
        </h1>
      </div>

      {/* TOOLBAR */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <ProductFilterBar categoryName="" />
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto justify-between md:justify-end">
          <span className="text-sm text-gray-600 font-medium whitespace-nowrap">
            Tìm thấy <strong className="text-gray-900">{totalResults}</strong>{" "}
            sản phẩm
          </span>
          <div className="w-full sm:w-48">
            <ProductSort value={sortOption} onValueChange={handleSortChange} />
          </div>
        </div>
      </div>

      {/* CONTENT */}
      {loading ? (
        // Loading Skeleton
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-lg p-3 border border-gray-100 shadow-sm space-y-3"
            >
              <Skeleton className="h-44 w-full rounded-md" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : products.length > 0 ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {products.map((product) => (
              <div key={product._id} className="h-full">
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-8">
            <PaginationCustom
              currentPage={pageFromUrl}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      ) : (
        // Empty State
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-xl border border-gray-200 border-dashed text-center px-4">
          <div className="bg-gray-50 p-6 rounded-full mb-6">
            <FilterX className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Không tìm thấy kết quả nào
          </h3>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            Không tìm thấy sản phẩm nào khớp với từ khóa
            <span className="font-semibold text-gray-700"> "{keyword}"</span>.
          </p>
          <div className="flex gap-4">
            <Button variant="outline" onClick={clearFilters}>
              Xóa bộ lọc
            </Button>
            <Button
              onClick={() => navigate("/")}
              className="bg-red-600 hover:bg-red-700"
            >
              Về trang chủ
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
