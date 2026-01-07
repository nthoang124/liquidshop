import {
  ChevronsUpDown,
  LogOut,
  UserRoundPen,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useAuth } from "@/context/AdminAuthContext"
import { Link, useNavigate } from "react-router-dom"
import type { IUserLoginResponse } from "@/types/user"
import { RoleBadge } from "../users/role-badege"

export function NavUser({
  user,
}: {
  user: IUserLoginResponse
}) {
  const { isMobile } = useSidebar();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); 
    navigate("/admin/login", { replace: true });
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem className="bg-gray-200 rounded-md">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground h-14"
            >
              <Avatar className="h-10 w-10 rounded-3xl group-data-[collapsible=icon]:h-8! group-data-[collapsible=icon]:w-8!">
                <AvatarFallback className="rounded-lg
                  bg-linear-to-br from-red-500 to-black
                  text-white font-semibold
                  text-sm"
                >
                  {user?.fullName
                    ? user.fullName.replace(/\s/g, "").slice(0, 2).toUpperCase()
                    : "?"}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.fullName}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg border-2 border-red-500 bg-white"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left">
                <Avatar className="h-10 w-10 rounded-3xl">
                  <AvatarFallback className="rounded-lg
                    bg-linear-to-br from-red-500 to-black
                    text-white font-semibold
                    text-sm"
                  >
                    {user?.fullName
                      ? user.fullName.replace(/\s/g, "").slice(0, 2).toUpperCase()
                      : "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.fullName}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
              <div className="mt-1 px-1">
                <RoleBadge role={user.role} label="Quản trị viên"/>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="cursor-pointer">
                <Link to={`/admin/users/${user.id}`} className="w-full flex items-center gap-2">
                  <UserRoundPen size={18}/>
                  Hồ sơ
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="font-medium text-md cursor-pointer"
              >
              <LogOut color="black"/>
              <span>Đăng xuất</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
