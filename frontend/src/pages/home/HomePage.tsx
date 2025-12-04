import useDocumentTitle from "@/hooks/useDocumentTitle";

import Banner from "@/components/common/Banner";
import BottomCategory from "@/features/BottomCategory";

import ProductListCarousel from "@/components/common/carousel/ProductListCarousel";

import pcData from "@/data/pcs.json";
import mouseData from "@/data/mice.json";
import keyboardData from "@/data/keyboards.json";

import type { Product } from "@/types/product";

const HomePage = () => {
  return (
    <>
      {useDocumentTitle("Trang Chủ")}
      <div className="mx-auto px-2 sm:px-4 lg:px-8 space-y-3 py-4 sm:py-4 bg-[#ececec]">
        {/* PC Carousel */}
        <Banner />
        <section className="p-0">
          <ProductListCarousel
            title="PC Gaming Bán Chạy"
            products={pcData as Product[]}
            viewAllLink="/category/pc"
            autoplay={true}
          />
        </section>

        {/* Mouse Carousel */}
        <section className="p-0">
          <ProductListCarousel
            title="Chuột Gaming Giá Rẻ"
            products={mouseData as Product[]}
            viewAllLink="/category/mouse"
            autoplay={true}
          />
        </section>

        {/* KeyBoard Carousel */}
        <section className="p-0">
          <ProductListCarousel
            title="Bàn Phím Cơ Mới Về"
            products={keyboardData as Product[]}
            viewAllLink="/category/keyboard"
            autoplay={true}
          />
        </section>

        <BottomCategory />
      </div>
    </>
  );
};

export default HomePage;
