import type { ColumnDef } from "@tanstack/react-table"
import type { IUser } from "@/types/user"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"

export const columns: ColumnDef<IUser>[] = [
  {
    accessorKey: "avatarUrl",
    header: () => (
      <span className="text-sm md:text-base font-semibold">
        Avatar
      </span>
    ),
    cell: ({row}) => (
        <Avatar>
            <AvatarImage src={row.getValue("avatarUrl")}/>
        </Avatar>
    ),
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
      const role = row.getValue("role");
      return (
      <div className={
        `w-20 px-1 py-1 rounded-md text-[0.8rem] text-white text-center ` + 
        (role === "admin" ? "bg-red-500" : "bg-green-500" )
        }>
          {row.getValue("role")}
      </div> 
      );
    }
  },
]