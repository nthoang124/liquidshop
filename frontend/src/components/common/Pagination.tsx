import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationCustomProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PaginationCustom: React.FC<PaginationCustomProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const renderPaginationItems = () => {
    const items = [];
    const siblingCount = 3; // Số lượng trang hiển thị bên cạnh trang hiện tại

    // Luôn hiển thị trang đầu
    items.push(
      <PaginationItem key={1}>
        <PaginationLink
          onClick={() => onPageChange(1)}
          isActive={currentPage === 1}
          className={
            currentPage === 1
              ? "bg-red-600 border-none text-white hover:bg-red-700 hover:text-white cursor-pointer"
              : "text-neutral-400 hover:bg-neutral-800 hover:text-white border-neutral-700 cursor-pointer"
          }
        >
          1
        </PaginationLink>
      </PaginationItem>
    );

    // Dấu ba chấm đầu tiên
    if (currentPage > siblingCount + 2) {
      items.push(
        <PaginationItem key="ellipsis-start">
          <PaginationEllipsis className="text-neutral-600" />
        </PaginationItem>
      );
    }

    // Các trang ở giữa
    const startPage = Math.max(2, currentPage - siblingCount);
    const endPage = Math.min(totalPages - 1, currentPage + siblingCount);

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={() => onPageChange(i)}
            isActive={currentPage === i}
            className={
              currentPage === i
                ? "bg-red-600 border-none text-white hover:bg-red-700 hover:text-white cursor-pointer"
                : "text-neutral-400 hover:bg-neutral-800 hover:text-white border-neutral-700 cursor-pointer"
            }
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Dấu ba chấm cuối cùng
    if (currentPage < totalPages - siblingCount - 1) {
      items.push(
        <PaginationItem key="ellipsis-end">
          <PaginationEllipsis className="text-neutral-600" />
        </PaginationItem>
      );
    }

    // Trang cuối
    if (totalPages > 1) {
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            onClick={() => onPageChange(totalPages)}
            isActive={currentPage === totalPages}
            className={
              currentPage === totalPages
                ? "bg-red-600 border-none text-white hover:bg-red-700 hover:text-white cursor-pointer"
                : "text-neutral-400 hover:bg-neutral-800 hover:text-white border-neutral-700 cursor-pointer"
            }
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  return (
    <Pagination className="mt-8 py-4">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => onPageChange(currentPage - 1)}
            className={`text-neutral-400 hover:bg-neutral-800 hover:text-white border-neutral-700 cursor-pointer ${
              currentPage === 1 ? "opacity-30 pointer-events-none" : ""
            }`}
          />
        </PaginationItem>

        {renderPaginationItems()}

        <PaginationItem>
          <PaginationNext
            onClick={() => onPageChange(currentPage + 1)}
            className={`text-neutral-400 hover:bg-neutral-800 hover:text-white border-neutral-700 cursor-pointer ${
              currentPage === totalPages ? "opacity-30 pointer-events-none" : ""
            }`}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationCustom;
