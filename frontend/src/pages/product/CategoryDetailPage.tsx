import React, { useEffect, useState } from "react";
import {
  useParams,
  useSearchParams,
  useNavigate,
  Link,
} from "react-router-dom";
import { Zap, ChevronRight, Home, LayoutGrid } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { categoryService } from "@/services/api/customer/category.service";
import { productService } from "@/services/api/customer/product.service";
import { type ICategory } from "@/types/category";
import { type IProductListResponse } from "@/types/product";

import { ProductFilterBar } from "@/components/product/filter/ProductFilter";
import { ProductSort } from "@/components/product/filter/ProductSort";
import ProductCard from "@/components/product/ProductCard";

const DEFAULT_LIMIT = 20;

const CategoryDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // --- 1. ĐỒNG BỘ DỮ LIỆU TỪ URL ---
  const pageFromUrl = Number(searchParams.get("page")) || 1;
  const sortOption = searchParams.get("sort") || "-createdAt";
  const categoryNameParam = searchParams.get("category");

  // --- 2. STATE ---
  const [categoryDetail, setCategoryDetail] = useState<ICategory | null>(null);
  const [productResponse, setProductResponse] =
    useState<IProductListResponse | null>(null);
  const [loadingCategory, setLoadingCategory] = useState<boolean>(true);
  const [loadingProducts, setLoadingProducts] = useState<boolean>(false);

  // --- 3. LẤY THÔNG TIN CATEGORY ---
  useEffect(() => {
    const fetchCategoryInfo = async () => {
      if (id) {
        setLoadingCategory(true);
        try {
          const catRes = await categoryService.getCategoryById(id);
          if (catRes.data) {
            setCategoryDetail(catRes.data);
          }
        } catch (err) {
          console.error("Lỗi tải danh mục:", err);
        } finally {
          setLoadingCategory(false);
        }
      } else if (categoryNameParam) {
        setCategoryDetail({
          _id: "temp",
          name: categoryNameParam,
          description: `Sản phẩm thuộc danh mục ${categoryNameParam}`,
          imageUrl: "",
        } as ICategory);
        setLoadingCategory(false);
      }
    };
    fetchCategoryInfo();
  }, [id, categoryNameParam]);

  // --- 4. LẤY DANH SÁCH SẢN PHẨM VÀ BỘ LỌC ---
  useEffect(() => {
    const fetchProducts = async () => {
      if (!categoryDetail?.name) return;

      setLoadingProducts(true);
      try {
        const params: any = {
          category: categoryDetail.name,
          page: pageFromUrl,
          limit: DEFAULT_LIMIT,
          sort: sortOption,
          fields:
            "name,price,originalPrice,discountPercentage,images,averageRating,soldCount,category,specifications,status,slug",
        };

        // Đẩy tất cả filter động (price[gte], specifications...) từ URL vào params API
        searchParams.forEach((value, key) => {
          if (["page", "limit", "sort", "category"].includes(key)) return;
          params[key] = value;
        });

        const res = await productService.getProducts(params);
        setProductResponse(res);
      } catch (err) {
        console.error("Lỗi tải sản phẩm", err);
      } finally {
        setLoadingProducts(false);
      }
    };

    if (categoryDetail) {
      fetchProducts();
    }
  }, [categoryDetail, pageFromUrl, sortOption, searchParams]);

  // --- 5. HANDLERS ---
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

  const products = productResponse?.data?.products || [];
  const pagination = productResponse?.pagination;
  const totalPages = pagination?.totalPage || 1;

  if (loadingCategory) {
    return (
      <div className="py-10 container mx-auto px-4">
        <Skeleton className="w-full h-48 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="py-4 min-h-screen container mx-auto px-4">
      {/* BREADCRUMB */}
      <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4 bg-white p-3 rounded-lg shadow-sm">
        <Link
          to="/"
          className="flex items-center hover:text-red-600 transition-colors"
        >
          <Home className="w-4 h-4 mr-1" /> Trang chủ
        </Link>
        {categoryDetail && (
          <>
            <ChevronRight className="w-4 h-4 text-gray-300" />
            <span className="text-gray-900 font-semibold">
              {categoryDetail.name}
            </span>
          </>
        )}
      </nav>

      {/* HEADER CARD */}
      {categoryDetail && (
        <Card className="mb-6 bg-white border-none shadow-sm overflow-hidden relative border-l-4 border-red-600">
          <CardHeader className="relative z-10 py-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-red-50 rounded-lg">
                <Zap className="w-6 h-6 text-red-600 fill-red-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-800 uppercase tracking-tight">
                {categoryDetail.name}
              </CardTitle>
            </div>
            <CardDescription className="text-gray-600 text-base max-w-3xl">
              {categoryDetail.description ||
                `Hệ thống phân phối ${categoryDetail.name} chính hãng với giá ưu đãi nhất.`}
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* FILTER BAR */}
      <ProductFilterBar categoryName={categoryDetail?.name} />

      {/* TOOLBAR: RESULT COUNT & SORT */}
      <div className="mb-6 flex flex-col md:flex-row justify-between items-center bg-white p-3 rounded-lg shadow-sm gap-4">
        <div className="flex items-center text-gray-700 font-medium">
          <LayoutGrid className="w-5 h-5 mr-2 text-red-600" />
          Tìm thấy{" "}
          <span className="text-red-600 font-bold mx-1">
            {pagination?.total || 0}
          </span>{" "}
          sản phẩm
        </div>

        <ProductSort value={sortOption} onValueChange={handleSortChange} />
      </div>

      {/* PRODUCT LIST GRID */}
      {loadingProducts ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-lg p-3 border border-gray-100 shadow-sm"
            >
              <Skeleton className="h-44 w-full mb-3 rounded-md" />
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {products.length > 0 ? (
              products.map((product) => (
                <div key={product._id} className="h-full">
                  <ProductCard product={product} />
                </div>
              ))
            ) : (
              <div className="col-span-full py-20 flex flex-col items-center justify-center bg-white rounded-xl border-2 border-dashed border-gray-200">
                <div className="bg-gray-50 p-4 rounded-full mb-4">
                  <LayoutGrid className="w-12 h-12 text-gray-300" />
                </div>
                <p className="text-gray-500 text-lg font-medium">
                  Không tìm thấy sản phẩm nào khớp với bộ lọc.
                </p>
                <Button
                  variant="link"
                  onClick={() => navigate("/")}
                  className="text-red-600"
                >
                  Quay lại trang chủ
                </Button>
              </div>
            )}
          </div>

          {/* PAGINATION CONTROL */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-12 gap-2 pb-8">
              <Button
                variant="outline"
                disabled={pageFromUrl === 1}
                onClick={() => handlePageChange(pageFromUrl - 1)}
                className="hover:border-red-600 hover:text-red-600"
              >
                Trước
              </Button>
              <div className="flex gap-1 hidden sm:flex">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <Button
                      key={p}
                      variant={p === pageFromUrl ? "default" : "outline"}
                      onClick={() => handlePageChange(p)}
                      className={
                        p === pageFromUrl
                          ? "bg-red-600 hover:bg-red-700 text-white border-red-600"
                          : "hover:border-red-600 hover:text-red-600"
                      }
                    >
                      {p}
                    </Button>
                  )
                )}
              </div>
              <span className="sm:hidden text-sm font-medium">
                Trang {pageFromUrl} / {totalPages}
              </span>
              <Button
                variant="outline"
                disabled={pageFromUrl === totalPages}
                onClick={() => handlePageChange(pageFromUrl + 1)}
                className="hover:border-red-600 hover:text-red-600"
              >
                Sau
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CategoryDetailPage;
