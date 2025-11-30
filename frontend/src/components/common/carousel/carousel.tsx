import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import { cn } from "@/lib/utils";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  // CarouselApi,
} from "@/components/ui/carousel";

// --- DEFINE GENERIC PROPS ---
interface CarouselTemplateProps<T> {
  data: T[];

  // Hàm render giao diện cho từng item
  renderItem: (item: T, index: number) => React.ReactNode;

  // Cấu hình Responsive
  itemClassName?: string;

  className?: string;

  autoplay?: boolean;
  autoplayDelay?: number;

  showNavigation?: boolean;

  // Lấy API của carousel ra ngoài nếu cần điều khiển từ cha
  // setApi?: (api: CarouselApi) => void;
}

function CarouselTemplate<T>({
  data,
  renderItem,
  itemClassName = "basis-full", // Mặc định 1 item 1 hàng
  className,
  autoplay = false,
  autoplayDelay = 3000,
}: // setApi,
CarouselTemplateProps<T>) {
  const plugins = React.useMemo(() => {
    return autoplay
      ? [Autoplay({ delay: autoplayDelay, stopOnInteraction: true })]
      : [];
  }, [autoplay, autoplayDelay]);

  return (
    <Carousel
      // setApi={setApi}
      plugins={plugins}
      opts={{
        align: "start",
        loop: true,
      }}
      className={cn("w-full relative group", className)}
    >
      <CarouselContent className="-ml-2 md:-ml-4">
        {data.map((item, index) => (
          <CarouselItem
            key={index}
            className={cn("pl-2 md:pl-4", itemClassName)}
          >
            {/* RENDER */}
            {renderItem(item, index)}
          </CarouselItem>
        ))}
      </CarouselContent>

      <CarouselPrevious className="hidden bg-gray-200 border-none md:flex absolute left-0 translate-y-[10%] h-10 w-10 z-10 translate-x-[-30%] cursor-pointer" />
      <CarouselNext className="hidden bg-gray-200 border-none md:flex absolute right-0 translate-y-[10%] h-10 w-10 z-10 translate-x-[30%] cursor-pointer" />
    </Carousel>
  );
}

export default CarouselTemplate;
