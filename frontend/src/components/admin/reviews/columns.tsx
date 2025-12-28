import type { ColumnDef } from "@tanstack/react-table"
import type { IReview } from "@/types/review";
import { Star, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";

const REVIEW_STATUS_LABEL: Record<
  "pending" | "approved" | "rejected",
  string
> = {
  pending: "Chờ duyệt",
  approved: "Đã duyệt",
  rejected: "Từ chối",
};

export const columns = (
    onOpenDetail: (review: IReview) => void,
    onDelete: (id: string) => void
): ColumnDef<IReview>[] => [
    {
        accessorKey: "productId",
        header: () => (
            <span className="text-sm md:text-base">
                Sản phẩm
            </span>
        ),
        cell: ({ row }) => {
            const product = row.original.productId;
            return (
                <div className="flex flex-col whitespace-normal max-w-[300px]">
                    <span className="font-medium block text-sm md:text-[0.95rem]">{product.name}</span>
                    <img className="w-17 h-15" src={product?.images?.[0]} alt="product image" />
                </div>
            )
        }
    },
    {
        accessorKey: "userId",
        header: () => (
            <span className="text-sm md:text-base">
                Khách hàng
            </span>
        ),
        cell: ({ row }) => {
            const user = row.original.userId;
            return (
                <div className="flex flex-col">
                    <span className="font-medium text-[0.875rem] md:text-[1rem]">{user.fullName}</span>
                    <span className="text-[0.85rem] md:text-sm text-blue-400">{user.email}</span>
                </div>
            )
        }
    },
    {
        accessorKey: "comment",
         header: () => (
            <span className="text-sm md:text-base">
                Bình luận
            </span>
        ),
        cell: ({ row }) => {
            const review = row.original;
            return (
                <div 
                    onClick={() => onOpenDetail(review)}
                    className="whitespace-normal max-w-[300px]"
                >
                    <span
                        className="
                            block
                            wrap-break-word 
                            line-clamp-3
                            text-black
                            text-sm
                            hover:underline
                            cursor-pointer"
                    >
                        {review.comment}
                    </span>
                </div>
            );
        },
    },
    {
        accessorKey: "rating",
         header: () => (
            <span className="text-sm md:text-base">
                Đánh giá
            </span>
        ),
        cell: ({ row }) => (<div className="flex flex-row gap-1 font-semibold text-base">{row.getValue("rating")} <Star fill="yellow" color="#edf028"/> </div>)
    },
    {
        accessorKey: "status",
         header: () => (
            <span className="text-sm md:text-base">
                Trạng thái
            </span>
        ),
        cell: ({ row }) => { 
            const status = row.getValue("status") as 
                | "pending"
                | "approved"
                | "rejected";
            return (
               <span
                    className={`text-[0.8rem] md:text[0.85rem] font-semibold px-2 py-1 rounded-md border w-fit
                        ${
                        status === "approved"
                            ? "bg-lime-50 text-lime-600 border-lime-300"
                            : status === "pending"
                            ? "bg-amber-50 text-amber-600 border-amber-300"
                            : "bg-red-100 text-red-600 border-red-300"
                        }
                    `}
                    >
                    {REVIEW_STATUS_LABEL[status]}
                </span>
            )
        }
    },
    {
        id: "actions",
         header: () => (
            <span className="text-sm md:text-base">
                Xóa
            </span>
        ),
        cell: ({ row }) => {
            const review_id = row.original._id;
            return (
            <Button
                className="text-red-500 p-0 rounded-lg bg-transparent hover:bg-zinc-200"
                size="icon"
                onClick={() => onDelete(review_id)}
            >
                <Trash strokeWidth={2.5} className="h-4 w-4 border-gray-200" />
            </Button>
            );
        },
    }
]