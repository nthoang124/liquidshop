import ProductListCarousel from "@/components/common/carousel/ProductListCarousel";

import pcData from "@/data/pcs.json";
import mouseData from "@/data/mice.json";
import keyboardData from "@/data/keyboards.json";

import type { Product } from "@/types/product";

const HomePage = () => {
  return (
    <div className="container bg-[#ececec] mx-auto px-4 space-y-3 py-8">
      {/*  PC */}
      <ProductListCarousel
        title="PC Gaming Bán Chạy"
        products={pcData as Product[]}
        viewAllLink="/category/pc"
        autoplay={false}
      />

      {/* Mouse */}
      <ProductListCarousel
        title="Chuột Gaming Giá Rẻ"
        products={mouseData as Product[]}
        viewAllLink="/category/mouse"
        autoplay={true}
        className="bg-gray-50 p-4"
      />

      {/* KeyBoard */}
      <ProductListCarousel
        title="Bàn Phím Cơ Mới Về"
        products={keyboardData as Product[]}
        viewAllLink="/category/keyboard"
      />
    </div>
  );
};

export default HomePage;
