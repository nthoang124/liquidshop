import { useEffect, useState } from "react";
import useDocumentTitle from "@/hooks/useDocumentTitle";

import Banner from "@/components/common/Banner";
import ServicePolicy from "@/pages/home/ServicePolicy";
import BottomCategory from "@/pages/home/BottomCategory";
import ProductListCarousel from "@/components/product/carousel/ProductListCarousel";
import MobileProductSlide from "@/components/product/carousel/MobileSlide";
import { Skeleton } from "@/components/ui/skeleton";

import { productService } from "@/services/api/customer/product.service";
import { categoryService } from "@/services/api/customer/category.service";
import { brandService } from "@/services/api/customer/brand.service";
import type { IProduct } from "@/types/product";
import type { IBrand } from "@/types/brand";

interface IHomeSection {
  title: string;
  categoryId: string;
  products: IProduct[];
  brands: IBrand[];
}

const HomePage = () => {
  useDocumentTitle("Trang Chủ");

  const [laptopSection, setLaptopSection] = useState<IHomeSection | null>(null);
  const [phoneSection, setPhoneSection] = useState<IHomeSection | null>(null);
  const [keyboardSection, setKeyboardSection] = useState<IHomeSection | null>(
    null
  );
  const [mouseSection, setMouseSection] = useState<IHomeSection | null>(null);

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      setLoading(true);
      try {
        const categoryRes = await categoryService.getAllCategories();

        if (categoryRes.success && categoryRes.data) {
          const allCategories = categoryRes.data;

          const getCategoryData = async (
            keyword: string
          ): Promise<IHomeSection | null> => {
            const cat = allCategories.find((c) =>
              c.name.toLowerCase().includes(keyword.toLowerCase())
            );

            if (!cat) return null;

            const [productRes, brandRes] = await Promise.all([
              productService.getProducts({
                category: cat.name,
                limit: 10,
                fields:
                  "name,price,images,originalPrice,averageRating,specifications,soldCount",
              }),
              brandService.getBrandsByCategory(cat._id),
            ]);

            return {
              title: cat.name,
              categoryId: cat._id,
              products: productRes.data?.products || [],
              brands: brandRes.brands || [],
            };
          };

          const [laptopData, phoneData, keyboardData, mouseData] =
            await Promise.all([
              getCategoryData("Laptop"),
              getCategoryData("Điện thoại"),
              getCategoryData("Bàn phím"),
              getCategoryData("Chuột"),
            ]);

          setLaptopSection(laptopData);
          setPhoneSection(phoneData);
          setKeyboardSection(keyboardData);
          setMouseSection(mouseData);
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu trang chủ:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const RenderSection = ({ data }: { data: IHomeSection | null }) => {
    if (!data || data.products.length === 0) return null;
    return (
      <section className="p-0">
        {/* MOBILE VIEW */}
        <div className="md:hidden">
          <MobileProductSlide
            title={data.title}
            products={data.products}
            brands={data.brands}
            viewAllLink={`/category/${data.categoryId}`}
          />
        </div>

        {/* DESKTOP VIEW */}
        <div className="hidden md:block">
          <ProductListCarousel
            title={data.title}
            products={data.products}
            viewAllLink={`/category/${data.categoryId}`}
            autoplay={true}
            brands={data.brands}
          />
        </div>
      </section>
    );
  };

  return (
    <div className="mx-auto px-2 sm:px-4 lg:px-8 space-y-4 py-4 bg-[#ececec]">
      <Banner />
      <ServicePolicy />

      {loading ? (
        // Skeleton Loading
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white p-4 rounded-md">
              <Skeleton className="h-8 w-40 mb-4" />
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[1, 2, 3, 4].map((j) => (
                  <Skeleton key={j} className="h-40 w-full" />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <RenderSection data={laptopSection} />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 my-4">
            <img
              src="https://file.hstatic.net/200000722513/file/banner_790x250_tai_nghe_6f6dcb17d3a54fcc88b3de96762d2d41.jpg"
              className="w-full rounded h-[100px] cursor-pointer"
            />
            <img
              src="https://file.hstatic.net/200000722513/file/bot_promotion_banner_small_2_2ad55c2345c64fbfb87dab4957b33914.png"
              className="w-full rounded h-[100px] cursor-pointer"
            />
            <img
              src="https://cdn.hstatic.net/files/200000722513/file/gearvn-man-hinh-t10-bot-promotion-big.jpg"
              className="w-full rounded h-[100px] cursor-pointer"
            />
          </div>

          <RenderSection data={phoneSection} />
          <RenderSection data={keyboardSection} />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 my-4">
            <img
              src="data:image/jpeg;base64,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"
              className="w-full rounded h-[100px] cursor-pointer"
            />
            <img
              src="https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1238810/header.jpg?t=1747167586"
              className="w-full rounded h-[100px] cursor-pointer"
            />
            <img
              src="https://eu.redmagic.gg/cdn/shop/files/banner-pc_2x_db79e769-d48e-4beb-8bb9-26826e2a63c8.png?v=1679906718&width=2400"
              className="w-full rounded h-[100px] cursor-pointer"
            />
          </div>

          <RenderSection data={mouseSection} />
        </>
      )}

      <BottomCategory />
    </div>
  );
};

export default HomePage;
