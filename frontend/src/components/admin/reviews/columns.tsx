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
        header: "Sản phẩm",
        cell: ({ row }) => {
            const product = row.original.productId;
            return (
                <div className="flex flex-col whitespace-normal max-w-[300px]">
                    <span className="font-medium block">{product.name}</span>
                    <img className="w-17 h-15" src={product?.images?.[0]} alt="product image" />
                </div>
            )
        }
    },
    {
        accessorKey: "userId",
        header: "Khách hàng",
        cell: ({ row }) => {
            const user = row.original.userId;
            return (
                <div className="flex flex-col">
                    <span className="font-medium">{user.fullName}</span>
                </div>
            )
        }
    },
    {
        accessorKey: "comment",
        header: "Bình luận",
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
                            font-bold
                            text-black
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
        header: "Đánh giá",
        cell: ({ row }) => (<div className="flex flex-row gap-1 font-bold">{row.getValue("rating")} <Star fill="yellow" color="#deed0c"/> </div>)
    },
    {
        accessorKey: "status",
        header: "Trạng thái",
        cell: ({ row }) => { 
            const status = row.getValue("status") as 
                | "pending"
                | "approved"
                | "rejected";
            return (
               <span
                    className={`px-2 py-1 rounded text-white font-semibold
                        ${
                        status === "approved"
                            ? "bg-green-500"
                            : status === "pending"
                            ? "bg-yellow-500"
                            : "bg-red-500"
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
        header: "xóa",
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