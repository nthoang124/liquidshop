import type { ColumnDef } from "@tanstack/react-table"
import type { IUser } from "@/types/user"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"
import { RoleBadge } from "./role-badege"
import { AvatarFallback } from "@radix-ui/react-avatar"

export const columns: ColumnDef<IUser>[] = [
  {
    accessorKey: "avatarUrl",
    header: () => (
      <span className="text-sm md:text-base font-semibold">
        Avatar
      </span>
    ),
    cell: ({row}) => {
      const avatar = row.getValue("avatarUrl") as string || null;
      const fullName = row.getValue("fullName") as string;
      return (
         <Avatar className="h-10 w-10 sm:h-11 sm:w-11 relative border-2 border-white shadow-sm transition-transform group-hover:scale-105 duration-300 flex-shrink-0">
            <AvatarImage src={avatar || "/placeholder.svg"} alt={fullName} />
            <AvatarFallback className="bg-slate-100 inset-0 z-20 absolute text-slate-500 font-bold text-xs items-center justify-center flex">
              {fullName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
      )
    },
  },
  {
    accessorKey: "fullName",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-sm md:text-base font-semibold hover:bg-blue-200"
      >
        Họ tên
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row, table }) => (
      <button
        className="text-black hover:underline text-sm"
        onClick={() => table.options.meta?.onUserClick?.(row.original._id)}
      >
        {row.getValue("fullName")}
      </button>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-sm md:text-base font-semibold hover:bg-blue-200"
        >
          Email
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => <div className="lowercase text-sm text-blue-600">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "phoneNumber",
   header: () => (
      <span className="text-sm md:text-base font-semibold">
        Điện thoại
      </span>
    ),
    cell: ({ row }) => ( <div> {row.getValue("phoneNumber")}</div> )
  },
  {
    accessorKey: "role",
    header: () => (
      <span className="text-sm md:text-base font-semibold">
        Vai trò
      </span>
    ),
    cell: ({ row }) => { 
      const role = row.getValue("role") as "customer" | "admin" | string;
      const label = role === "admin" ? "Quản trị viên" : "Người dùng";
      return (
        <RoleBadge role={role} label={label}/>
      );
    }
  },
]