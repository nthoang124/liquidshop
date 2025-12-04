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

  renderItem: (item: T, index: number) => React.ReactNode;

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
  autoplayDelay = 7000,
  showNavigation = true,
}: // setApi,
CarouselTemplateProps<T>) {
  const plugin = React.useRef(
    Autoplay({ delay: autoplayDelay, stopOnInteraction: false })
  );

  return (
    <Carousel
      // setApi={setApi}
      plugins={[plugin.current]}
      opts={{
        align: "start",
        loop: true,
      }}
      onMouseEnter={autoplay ? () => plugin.current.stop() : undefined}
      onMouseLeave={autoplay ? () => plugin.current.play() : undefined}
      className={cn("w-full relative group", className)}
    >
      <CarouselContent className="-ml-2 md:-ml-4">
        {data.map((item, index) => (
          <CarouselItem
            key={index}
            className={cn("pl-2 md:pl-4", itemClassName)}
          >
            {renderItem(item, index)}
          </CarouselItem>
        ))}
      </CarouselContent>

      {showNavigation && (
        <>
          <CarouselPrevious className="hidden bg-gray-200 border-none md:flex absolute left-0 translate-y-[10%] h-10 w-10 z-10 translate-x-[-30%] cursor-pointer" />
          <CarouselNext className="hidden bg-gray-200 border-none md:flex absolute right-0 translate-y-[10%] h-10 w-10 z-10 translate-x-[30%] cursor-pointer" />{" "}
        </>
      )}
    </Carousel>
  );
}

export default CarouselTemplate;
