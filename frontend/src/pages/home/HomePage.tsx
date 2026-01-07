import { useLoaderData } from "react-router-dom";
import useDocumentTitle from "@/hooks/useDocumentTitle";
import Banner from "@/components/common/Banner";
import ServicePolicy from "@/pages/home/ServicePolicy";
import BottomCategory from "@/pages/home/BottomCategory";
import ProductListCarousel from "@/components/product/carousel/ProductListCarousel";
import MobileProductSlide from "@/components/product/carousel/MobileSlide";
import type { IHomeSection } from "./home.loader";

const HomePage = () => {
  useDocumentTitle("Trang Chủ");

  const { laptop, pc, keyboard, mouse, monitor } = useLoaderData() as {
    laptop: IHomeSection | null;
    pc: IHomeSection | null;
    keyboard: IHomeSection | null;
    mouse: IHomeSection | null;
    monitor: IHomeSection | null;
  };

  const RenderSection = ({ data }: { data: IHomeSection | null }) => {
    if (!data || data.products.length === 0) return null;
    return (
      <section className="p-0 mt-4">
        <div className="md:hidden">
          <MobileProductSlide
            title={data.title}
            products={data.products}
            brands={data.brands}
            viewAllLink={`/category/${data.categoryId}`}
          />
        </div>
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

  const PromotionBanner = ({ src }: { src: string }) => (
    <div className="group overflow-hidden rounded-lg border border-zinc-800 shadow-md">
      <img
        src={src}
        className="w-full h-[120px] object-cover cursor-pointer transition-transform duration-500 group-hover:scale-105 group-hover:brightness-110"
        alt="Promotion"
      />
    </div>
  );

  return (
    <div className="mx-auto px-2 sm:px-4 lg:px-8 space-y-1 py-3 bg-transparent">
      <Banner />
      <ServicePolicy />

      <RenderSection data={pc} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 my-4">
        <PromotionBanner src="https://file.hstatic.net/200000722513/file/banner_790x250_tai_nghe_6f6dcb17d3a54fcc88b3de96762d2d41.jpg" />
        <PromotionBanner src="https://file.hstatic.net/200000722513/file/bot_promotion_banner_small_2_2ad55c2345c64fbfb87dab4957b33914.png" />
        <PromotionBanner src="https://cdn.hstatic.net/files/200000722513/file/gearvn-man-hinh-t10-bot-promotion-big.jpg" />
      </div>

      <RenderSection data={keyboard} />
      <RenderSection data={mouse} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 my-4">
        <PromotionBanner src="https://gamelade.vn/wp-content/uploads/2025/06/call-of-duty-black-ops-7-announced.webp" />
        <PromotionBanner src="https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1238810/header.jpg?t=1747167586" />
        <PromotionBanner src="https://eu.redmagic.gg/cdn/shop/files/banner-pc_2x_db79e769-d48e-4beb-8bb9-26826e2a63c8.png?v=1679906718&width=2400" />
      </div>

      <RenderSection data={laptop} />
      <RenderSection data={monitor} />

      <BottomCategory />
    </div>
  );
};

export default HomePage;
