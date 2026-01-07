import * as React from "react"
import {
  Home,
  Package,
  ShoppingCart,
  Users,
  Gift,
  FileText,
  Layers,
  BadgeCheck,
} from "lucide-react"

import { NavMain } from "@/components/admin/sidebar/nav-main"
import { NavUser } from "@/components/admin/sidebar/nav-user"
import { LogoSidebar } from "@/components/admin/sidebar/logo-sidebar"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useAuth } from "@/context/AdminAuthContext"

// This is sample data.
const data = {
  user: {
    name: "LiquidShop",
    email: "liquid@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: Home,
      // isActive: true,
    },
    {
      title: "Sản phẩm",
      icon: Package,
      url: "/admin/products",
      items: [
        {
          title: "Danh sách",
          url: "/admin/products/list"
        },
        {
          title: "Thêm sản phẩm",
          url: "/admin/products/add-new"
        },
      ]
    },
    {
      title: "Danh mục",
      icon: Layers,
      url: "/admin/categories",
    },
    {
      title: "Thương hiệu",
      url: "/admin/brands",
      icon: BadgeCheck,
    },
    {
      title: "Đơn hàng",
      url: "/admin/orders",
      icon: ShoppingCart,
    },
    {
      title: "Khách hàng",
      url: "/admin/users",
      icon: Users,
    },
    {
      title: "Bình luận & đánh giá",
      url: "/admin/reviews",
      icon: FileText,
    },
    {
      title: "Khuyến mãi",
      url: "/admin/promotions",
      icon: Gift,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const {user} = useAuth();

  return (
    <Sidebar collapsible="icon" {...props} >
      <SidebarHeader>
        <LogoSidebar/>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
