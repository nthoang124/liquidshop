import React, { useEffect, useState } from "react";
import useDocumentTitle from "@/hooks/useDocumentTitle";

import Banner from "@/components/common/Banner";
import BottomCategory from "@/features/BottomCategory";
import ProductListCarousel from "@/components/common/carousel/ProductListCarousel";
import { Skeleton } from "@/components/ui/skeleton";

import { productService } from "@/services/api/customer/product.service";
import { categoryService } from "@/services/api/customer/category.service";
import type { IProduct } from "@/types/product";

// Định nghĩa cấu trúc dữ liệu cho mỗi hàng Carousel
interface IHomeSection {
  title: string;
  categoryId: string;
  products: IProduct[];
}

const HomePage = () => {
  useDocumentTitle("Trang Chủ");

  const [sections, setSections] = useState<IHomeSection[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      setLoading(true);
      try {
        // 1. Lấy tất cả danh mục giống như trong BottomCategory.tsx
        const categoryRes = await categoryService.getAllCategories();

        // Backend trả về { success: true, data: [...] }
        if (categoryRes.success && categoryRes.data) {
          const allCategories = categoryRes.data;

          // 2. Lọc ra 4 danh mục bạn muốn hiển thị trên Home
          const targetNames = ["Laptop", "Điện thoại", "Bàn phím", "Chuột"];
          const selectedCats = allCategories.filter((cat) =>
            targetNames.some((name) =>
              cat.name.toLowerCase().includes(name.toLowerCase())
            )
          );

          // 3. Với mỗi danh mục, lấy 10 sản phẩm giống logic fetchProducts của CategoryDetailPage.tsx
          const sectionPromises = selectedCats.slice(0, 4).map(async (cat) => {
            const productRes = await productService.getProducts({
              category: cat._id, // Lọc theo ID danh mục để chính xác nhất
              limit: 10,
            });

            console.log("jajajajja", productRes);

            // API Product trả về cấu trúc { data: { products: [] } }
            return {
              title: cat.name,
              categoryId: cat._id,
              products: productRes.data?.products || [],
            };
          });

          const results = await Promise.all(sectionPromises);
          setSections(results);
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu trang chủ:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <div className="mx-auto px-2 sm:px-4 lg:px-8 space-y-4 py-4 bg-[#ececec]">
      <Banner />

      {loading ? (
        // Hiển thị Skeleton khi đang tải dữ liệu
        <div className="space-y-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white p-4 rounded-md">
              <Skeleton className="h-8 w-64 mb-4" />
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[1, 2, 3, 4, 5].map((j) => (
                  <Skeleton key={j} className="h-60 w-full" />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Hiển thị các Carousel sản phẩm
        sections.map(
          (section) =>
            section.products.length > 0 && (
              <section key={section.categoryId} className="p-0">
                <ProductListCarousel
                  title={section.title}
                  products={section.products as any}
                  viewAllLink={`/category/${section.categoryId}`} // Link tới trang chi tiết danh mục
                  autoplay={true}
                />
              </section>
            )
        )
      )}

      <BottomCategory />
    </div>
  );
};

export default HomePage;
