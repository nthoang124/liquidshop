import CarouselTemplate from "@/components/product/carousel/carousel";

import { useAuth } from "@/context/CustomerAuthContext";

const subBanners = [
  { id: 2, name: "Banner 2", height: "h-[160px]", className: "bg-blue-100" },
  { id: 3, name: "Banner 3", height: "h-[160px]", className: "bg-green-100" },
  { id: 4, name: "Banner 4", height: "h-[180px]", className: "bg-yellow-100" },
  { id: 5, name: "Banner 5", height: "h-[180px]", className: "bg-red-100" },
  { id: 6, name: "Banner 6", height: "h-[180px]", className: "bg-purple-100" },
  { id: 7, name: "Banner 7", height: "h-[180px]", className: "bg-orange-100" },
];

function Banner() {
  const { user } = useAuth();

  return (
    <section className="flex flex-col gap-2 ">
      <div
        className="flex items-center w-full h-[200px] mx-auto px-4 bg-gradient-to-r
        from-black to-red-700 rounded-sm"
      >
        <div className="flex flex-col">
          {user ? (
            <p className="text-3xl md:text-5xl text-white font-bold">
              Xin chào {user.fullName}!
            </p>
          ) : (
            <>
              <p className="text-3xl md:text-5xl text-white font-bold">
                Chào mừng bạn đến với LiquidShop!
              </p>
              <p className="text-sm text-white mt-3">
                Hãy đăng nhập hoặc đăng ký để trải nghiệm mua sắm tuyệt vời
              </p>
            </>
          )}
        </div>
      </div>

      <div className="block md:hidden mt-2">
        <CarouselTemplate
          data={subBanners}
          autoplay={true}
          autoplayDelay={3000}
          itemClassName="basis-full"
          renderItem={(item) => (
            <div className="p-1">
              {/* Render Banner Item */}
              <div
                className={`flex items-center justify-center w-full rounded-md shadow-sm border border-gray-200 ${item.className}`}
                style={{ height: "120px" }}
              >
                <p className="font-bold text-gray-600">{item.name}</p>
              </div>
            </div>
          )}
        />
      </div>

      <div className="hidden md:flex flex-col gap-2">
        <div className="flex gap-2">
          {subBanners.slice(0, 2).map((banner) => (
            <div
              key={banner.id}
              className="flex h-[180px] w-1/2 items-center justify-center mx-auto px-4 bg-gray-300 rounded-sm"
            >
              {banner.name}
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          {subBanners.slice(2).map((banner) => (
            <div
              key={banner.id}
              className="flex h-[180px] w-1/4 items-center justify-center mx-auto px-4 bg-gray-300 rounded-sm"
            >
              {banner.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Banner;
