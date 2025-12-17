import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Zap, ArrowLeftRight } from "lucide-react";

import { categoryService } from "@/services/api/customer/category.service";
import { productService } from "@/services/api/customer/product.service";
import { type ICategory } from "@/types/category";
import { type IProductListResponse, type IProduct } from "@/types/product";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import ProductCard from "@/components/product/ProductCard";

const DEFAULT_LIMIT = 20;

const CategoryDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const categoryNameParam = searchParams.get("category");

  // State
  const [categoryDetail, setCategoryDetail] = useState<ICategory | null>(null);
  const [productResponse, setProductResponse] =
    useState<IProductListResponse | null>(null);

  const [loadingCategory, setLoadingCategory] = useState<boolean>(true);
  const [loadingProducts, setLoadingProducts] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initData = async () => {
      let currentCategoryName = categoryNameParam || "";

      try {
        if (id) {
          setLoadingCategory(true);
          const catRes = await categoryService.getCategoryById(id);
          if (catRes.data) {
            setCategoryDetail(catRes.data);
            currentCategoryName = catRes.data.name;
          }
        } else if (categoryNameParam) {
          setCategoryDetail({
            _id: "temp",
            name: categoryNameParam,
            description: `Sản phẩm thuộc danh mục ${categoryNameParam}`,
            imageUrl: "",
          } as ICategory);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingCategory(false);
      }

      if (currentCategoryName) {
        fetchProducts(currentCategoryName, 1);
      } else {
        setError("Không xác định được danh mục.");
      }
    };

    initData();
  }, [id, categoryNameParam]);

  const fetchProducts = async (catName: string, page: number) => {
    setLoadingProducts(true);
    try {
      const res = await productService.getProducts({
        category: catName,
        page: page,
        limit: DEFAULT_LIMIT,
        sort: "-createdAt",
      });
      setProductResponse(res);
      setCurrentPage(page);
    } catch (err) {
      console.error(err);
      setError("Không thể tải danh sách sản phẩm.");
    } finally {
      setLoadingProducts(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (categoryDetail) {
      fetchProducts(categoryDetail.name, newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Chuyển đổi dữ liệu từ Backend (IProduct) sang định dạng ProductCard mong muốn
  const mapBackendToFrontendProduct = (backendProduct: IProduct): any => {
    return {
      ...backendProduct,
      id: backendProduct._id, // ProductCard dùng .id, Backend trả ._id
      // ProductCard link tới /product/categoryName/id, backend trả object category
      category:
        typeof backendProduct.category === "object"
          ? backendProduct.category.name
          : backendProduct.category,
      // ProductCard dùng discountRate, Backend trả discountPercentage
      discountRate: backendProduct.discountPercentage,
      image:
        backendProduct.images && backendProduct.images.length > 0
          ? backendProduct.images[0]
          : "",
      rating: backendProduct.averageRating || 5,
      hasGift: false, // Backend chưa có trường này, tạm để false
    };
  };

  // --- Render Loading ---
  if (loadingCategory) {
    return (
      <div className="py-10 container mx-auto">
        <Skeleton className="w-full h-48 rounded-xl" />
      </div>
    );
  }

  const products: IProduct[] = productResponse?.data?.products || [];
  const pagination = productResponse?.pagination;
  const totalPages = pagination?.totalPage || 1;

  return (
    <div className="py-8 min-h-screen container mx-auto px-4">
      {/* --- HEADER DANH MỤC --- */}
      {categoryDetail && (
        <Card className="mb-8 bg-white border-none shadow-sm overflow-hidden relative">
          {categoryDetail.imageUrl && (
            <div
              className="absolute inset-0 bg-cover bg-center opacity-10"
              style={{ backgroundImage: `url(${categoryDetail.imageUrl})` }}
            />
          )}
          <CardHeader className="relative z-10">
            <CardTitle className="text-3xl font-bold text-gray-800 flex items-center gap-3 border-l-4 border-red-600 pl-4">
              <Zap className="w-8 h-8 text-red-600 fill-red-600" />
              {categoryDetail.name.toUpperCase()}
            </CardTitle>
            <CardDescription className="text-gray-600 mt-2 text-lg pl-4">
              {categoryDetail.description ||
                `Khám phá các sản phẩm ${categoryDetail.name} chính hãng.`}
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* --- TOOLBAR --- */}
      <div className="mb-6 flex flex-col md:flex-row justify-between items-center text-gray-600 gap-4">
        <p className="font-medium">
          Tìm thấy{" "}
          <span className="text-red-600 font-bold">
            {pagination?.total || 0}
          </span>{" "}
          sản phẩm
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-gray-600 border-gray-300 hover:text-red-600"
          >
            Sắp xếp <ArrowLeftRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>

      {/* --- DANH SÁCH SẢN PHẨM --- */}
      {loadingProducts ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-lg p-3 border border-gray-200"
            >
              <Skeleton className="h-40 w-full mb-3" />
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
                // SỬ DỤNG COMPONENT PRODUCT CARD TẠI ĐÂY
                <div key={product._id} className="h-full">
                  <ProductCard product={mapBackendToFrontendProduct(product)} />
                </div>
              ))
            ) : (
              <div className="col-span-full py-16 flex flex-col items-center justify-center text-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                <p className="text-gray-500 text-lg mb-2">
                  Chưa có sản phẩm nào trong danh mục này.
                </p>
                <Button
                  variant="link"
                  onClick={() => (window.location.href = "/")}
                >
                  Quay lại trang chủ
                </Button>
              </div>
            )}
          </div>

          {/* --- PHÂN TRANG --- */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-12 gap-2">
              <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                Trước
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    variant={page === currentPage ? "default" : "outline"}
                    onClick={() => handlePageChange(page)}
                    className={
                      page === currentPage
                        ? "bg-red-600 hover:bg-red-700 border-red-600"
                        : ""
                    }
                  >
                    {page}
                  </Button>
                )
              )}
              <Button
                variant="outline"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
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
