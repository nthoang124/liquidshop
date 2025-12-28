import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

interface PaginationProps {
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
}

export default function Pagination({
  page,
  setPage,
  totalPages,
}: PaginationProps) {
  const setPages = () => {
    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, page + 2);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const baseBtn =
    "bg-transparent text-black border rounded-sm border-gray-400 hover:bg-zinc-200 w-7 h-7 sm:w-8 sm:h-8";

  return (
    <div className="flex flex-wrap justify-center sm:justify-between items-center gap-1 mt-6">
      <span className="text-sm">
        page {page} of {totalPages}
      </span>
      <div className="flex items-center gap-0.5">
        {/* First */}
        <Button
          size="icon"
          onClick={() => setPage(1)}
          disabled={page === 1}
          className={`${baseBtn} ${totalPages < 6 ? "hidden" : ""}`}
        >
          <ChevronsLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </Button>

        {/* Prev */}
        <Button
          size="icon"
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className={baseBtn}
        >
          <ChevronLeft className="w-3 h-3 sm:w-5 sm:h-5" />
        </Button>

        {/* Pages */}
        {setPages().map((p) => (
          <Button
            key={p}
            size="sm"
            onClick={() => setPage(p)}
            className={`min-w-7 h-7 rounded-sm sm:w-8 sm:h-8 px-1 sm:px-3
              ${
                p === page
                  ? "bg-[#3385F0] text-white hover:bg-[#2B71CC]"
                  : "bg-transparent border border-gray-400 text-black hover:bg-zinc-200"
              }
            `}
          >
            {p}
          </Button>
        ))}

        {/* Next */}
        <Button
          size="icon"
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
          className={baseBtn}
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </Button>

        {/* Last */}
        <Button
          size="icon"
          onClick={() => setPage(totalPages)}
          disabled={page === totalPages}
          className={`${baseBtn} ${totalPages < 6 ? "hidden" : ""}`}
        >
          <ChevronsRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </Button>
      </div>
    </div>
  );
}
