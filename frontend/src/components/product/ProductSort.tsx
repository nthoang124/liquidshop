import React from "react";
import {
  ArrowLeftRight,
  ArrowDownWideNarrow,
  ArrowUpNarrowWide,
  ArrowDownAZ,
  ArrowUpAZ,
  Star,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface ProductSortProps {
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
}

export const ProductSort: React.FC<ProductSortProps> = ({
  value,
  onValueChange,
  className,
}) => {
  const getLabel = () => {
    switch (value) {
      case "-createdAt":
        return "Mới nhất";
      case "-averageRating":
        return "Nổi bật nhất";
      case "price":
        return "Giá tăng dần";
      case "-price":
        return "Giá giảm dần";
      case "name":
        return "Tên A - Z";
      case "-name":
        return "Tên Z - A";
      default:
        return "Sắp xếp";
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn("gap-2 min-w-[140px] justify-between", className)}
        >
          <span>{getLabel()}</span>
          <ArrowLeftRight className="w-4 h-4 text-gray-500" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[180px]">
        {/* Mới nhất */}
        <DropdownMenuItem onClick={() => onValueChange("-createdAt")}>
          <Clock className="w-4 h-4 mr-2 text-gray-500" />
          Mới nhất
        </DropdownMenuItem>

        {/* Nổi bật */}
        <DropdownMenuItem onClick={() => onValueChange("-averageRating")}>
          <Star className="w-4 h-4 mr-2 text-yellow-500" />
          Nổi bật nhất
        </DropdownMenuItem>

        {/* Giá */}
        <div className="my-1 border-t border-gray-100" />
        <DropdownMenuItem onClick={() => onValueChange("price")}>
          <ArrowUpNarrowWide className="w-4 h-4 mr-2 text-gray-500" />
          Giá tăng dần
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onValueChange("-price")}>
          <ArrowDownWideNarrow className="w-4 h-4 mr-2 text-gray-500" />
          Giá giảm dần
        </DropdownMenuItem>

        {/* Tên */}
        <div className="my-1 border-t border-gray-100" />
        <DropdownMenuItem onClick={() => onValueChange("name")}>
          <ArrowDownAZ className="w-4 h-4 mr-2 text-gray-500" />
          Tên A - Z
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onValueChange("-name")}>
          <ArrowUpAZ className="w-4 h-4 mr-2 text-gray-500" />
          Tên Z - A
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
