import type { ColumnDef } from "@tanstack/react-table"
import type { IUser } from "@/types/user"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, MoreHorizontal, PenLineIcon, Trash2Icon } from "lucide-react"

export const columns: ColumnDef<IUser>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="border-gray-400"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="border-gray-400"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "avatarUrl",
    header: "Avatar",
    cell: ({row}) => (
        <Avatar>
            <AvatarImage src={row.getValue("avatarUrl")}/>
        </Avatar>
    ),
  },
  {
    accessorKey: "fullName",
    header: ({column}) => {
        return (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className="text-md sm:tex-lg font-bold hover:bg-blue-200"
            >
                Name
                <ArrowUpDown />
            </Button>
        )
    }
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-md sm:text-lg font-bold hover:bg-blue-200"
        >
          Email
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "phoneNumber",
    header: ("Phone"),
    cell: ({ row }) => ( <div>{row.getValue("phoneNumber")}</div> )
  },
  {
    id: "actions",
    enableHiding: false,
    cell: () => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem > <PenLineIcon />Edit</DropdownMenuItem>
            <DropdownMenuItem 
                className="bg-red-500 text-white focus:bg-red-600 focus:text-white"
            >
                <Trash2Icon color="white"/>
                Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]