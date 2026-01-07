import type { ColumnDef } from "@tanstack/react-table"
import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { IPromotion } from "@/types/promotion";
import { formatVND } from "@/utils/admin/formatMoney";

export const columns = (
    onOpenDetail: (promotion: IPromotion) => void,
    onDelete: (id: string) => void
): ColumnDef<IPromotion>[] => [
    {
        accessorKey: "code",
         header: () => (
            <span className="text-sm md:text-base">
                Mã
            </span>
        ),
        cell: ({ row }) => {
            const code = row.original.code
            const description = row.original.description
            
            return (
                <div className="flex flex-col whitespace-normal max-w-[250px]">
                    <span 
                        onClick={() => onOpenDetail(row.original)}
                        className="font-semibold text-sm md:text-[0.95rem] hover:underline cursor-pointer">
                        {code}
                    </span>
                    <span className="text-[0.9rem] text-muted-foreground">
                    {description}
                    </span>
                </div>
            )
        }
    },
    {
        accessorKey: "discountValue",
         header: () => (
            <span className="text-sm md:text-base">
                Mức giảm giá
            </span>
        ),
        cell: ({ row }) => {
            const value = row.original.discountValue;
            const type = row.original.discountType;
            return (
                <div className="flex flex-row">
                    <span
                        className="text-sm md:text-base font-semibold text-red-500"
                    >
                        {type === "percentage" ? value + "%" : formatVND(value)}
                    </span>
                </div>
            )
        }
    },
    {
        accessorKey: "usageLimit",
         header: () => (
            <span className="text-sm md:text-base">
                Số lượng
            </span>
        ),
        cell: ({ row }) => ( <div className="text-green-500 text:sm md:text-base font-semibold">{row.getValue("usageLimit")}</div>)
    },
    {
        accessorKey: "isActive",
         header: () => (
            <span className="text-sm md:text-base">
                Trạng thái
            </span>
        ),
        cell: ({ row }) => {
            const isActive = row.getValue("isActive") as boolean;
            return (
                <div 
                    className={`text-[0.8rem] rounded-sm px-2 py-1 w-fit border 
                        ${
                            isActive ? "bg-lime-50 border-lime-300 text-lime-600" : "bg-amber-50 text-amber-600 border-amber-300"
                        }    
                    `}
                >
                    {isActive ? "Hoạt động" : "Không hoạt động"}
                </div>
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
            const id = row.original._id;
            return (
            <Button
                className="text-red-500 p-0 rounded-lg bg-transparent hover:bg-zinc-200"
                size="icon"
                onClick={() => onDelete(id)}
            >
                <Trash strokeWidth={2.5} className="h-4 w-4 border-gray-200" />
            </Button>
            );
        },
    }
]