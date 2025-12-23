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
    const siblingCount = 2;

    items.push(
      <PaginationItem key={1}>
        <PaginationLink
          onClick={() => onPageChange(1)}
          isActive={currentPage === 1}
          className={`px-3 py-2 rounded-md border text-sm font-semibold transition-all
            ${
              currentPage === 1
                ? "bg-red-600 text-white border-red-600 shadow-md"
                : "bg-white text-black border-gray-300 hover:bg-black hover:text-white"
            }
          `}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );

    if (currentPage > siblingCount + 2) {
      items.push(
        <PaginationItem key="ellipsis-start">
          <PaginationEllipsis className="text-gray-400" />
        </PaginationItem>
      );
    }

    const startPage = Math.max(2, currentPage - siblingCount);
    const endPage = Math.min(totalPages - 1, currentPage + siblingCount);

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={() => onPageChange(i)}
            isActive={currentPage === i}
            className={`px-3 py-2 rounded-md border text-sm font-semibold transition-all
              ${
                currentPage === i
                  ? "bg-red-600 text-white border-red-600 shadow-md"
                  : "bg-white text-black border-gray-300 hover:bg-black hover:text-white"
              }
            `}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (currentPage < totalPages - siblingCount - 1) {
      items.push(
        <PaginationItem key="ellipsis-end">
          <PaginationEllipsis className="text-gray-400" />
        </PaginationItem>
      );
    }

    if (totalPages > 1) {
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            onClick={() => onPageChange(totalPages)}
            isActive={currentPage === totalPages}
            className={`px-3 py-2 rounded-md border text-sm font-semibold transition-all
              ${
                currentPage === totalPages
                  ? "bg-red-600 text-white border-red-600 shadow-md"
                  : "bg-white text-black border-gray-300 hover:bg-black hover:text-white"
              }
            `}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  return (
    <Pagination className="mt-10 flex justify-center">
      <PaginationContent className="flex items-center gap-1">
        <PaginationItem>
          <PaginationPrevious
            onClick={() => onPageChange(currentPage - 1)}
            className={`px-3 py-2 rounded-md border text-sm font-semibold transition-all
              ${
                currentPage === 1
                  ? "opacity-40 pointer-events-none bg-gray-100 text-gray-400 border-gray-400"
                  : "bg-white text-black border-gray-300 hover:bg-black hover:text-white"
              }
            `}
          />
        </PaginationItem>

        {renderPaginationItems()}

        <PaginationItem>
          <PaginationNext
            onClick={() => onPageChange(currentPage + 1)}
            className={`px-3 py-2 rounded-md border text-sm font-semibold transition-all
              ${
                currentPage === totalPages
                  ? "opacity-40 pointer-events-none bg-gray-100 text-gray-400 border-gray-400"
                  : "bg-white text-black border-gray-300 hover:bg-black hover:text-white"
              }
            `}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationCustom;
