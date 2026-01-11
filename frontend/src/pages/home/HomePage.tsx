import { useLoaderData } from "react-router-dom";
import useDocumentTitle from "@/hooks/useDocumentTitle";
import Banner from "@/components/common/Banner";
import ServicePolicy from "@/pages/home/ServicePolicy";
import BottomCategory from "@/pages/home/BottomCategory";
import ProductListCarousel from "@/components/product/carousel/ProductListCarousel";
import MobileProductSlide from "@/components/product/carousel/MobileSlide";
import type { IHomeSection } from "./home.loader";

const PromotionBannerItem = ({ src }: { src: string }) => (
  <div className="group min-w-[85%] md:min-w-0 snap-center overflow-hidden rounded-lg border border-zinc-800 shadow-md">
    <img
      src={src}
      alt="Promotion"
      className="w-full h-[120px] object-cover cursor-pointer"
    />
  </div>
);

const PromotionBannerRow = ({ images }: { images: string[] }) => {
  if (!images || images.length === 0) return null;

  return (
    <div className="my-4 flex gap-2 overflow-x-auto snap-x snap-mandatory md:grid md:grid-cols-3 md:overflow-visible">
      {images.map((src, index) => (
        <PromotionBannerItem key={index} src={src} />
      ))}
    </div>
  );
};

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
            autoplay
            brands={data.brands}
          />
        </div>
      </section>
    );
  };

  return (
    <div className="mx-auto px-2 sm:px-4 lg:px-8 space-y-1 py-3 bg-transparent">
      <Banner />
      <ServicePolicy />

      <RenderSection data={pc} />

      <PromotionBannerRow
        images={[
          "https://file.hstatic.net/200000722513/file/banner_790x250_tai_nghe_6f6dcb17d3a54fcc88b3de96762d2d41.jpg",
          "https://file.hstatic.net/200000722513/file/bot_promotion_banner_small_2_2ad55c2345c64fbfb87dab4957b33914.png",
          "https://cdn.hstatic.net/files/200000722513/file/gearvn-man-hinh-t10-bot-promotion-big.jpg",
        ]}
      />

      <RenderSection data={keyboard} />
      <RenderSection data={mouse} />

      <PromotionBannerRow
        images={[
          "https://gamelade.vn/wp-content/uploads/2025/06/call-of-duty-black-ops-7-announced.webp",
          "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1238810/header.jpg?t=1747167586",
          "https://eu.redmagic.gg/cdn/shop/files/banner-pc_2x_db79e769-d48e-4beb-8bb9-26826e2a63c8.png?v=1679906718&width=2400",
        ]}
      />

      <RenderSection data={laptop} />
      <RenderSection data={monitor} />

      <BottomCategory />
    </div>
  );
};

export default HomePage;
