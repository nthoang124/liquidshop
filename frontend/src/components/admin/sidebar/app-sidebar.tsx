"use client"

import * as React from "react"
import {
  Home,
  Package,
  ShoppingCart,
  Users,
  Warehouse,
  Gift,
  FileText,
  Image,
  Settings,
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
          title: "danh sách",
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
      items: [
        {
          title: "Danh sách",
          url: "/admin/categories/list"
        },
        {
          title: "Thêm danh mục",
          url: "/admin/categories/add-new"
        },
      ]
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
      title: "Kho hàng",
      url: "/admin/inventory",
      icon: Warehouse,
    },
    {
      title: "Khuyến mãi",
      url: "/admin/promotions",
      icon: Gift,
    },
    {
      title: "Bài viết",
      url: "/admin/posts",
      icon: FileText,
    },
    {
      title: "Banner & Media",
      url: "/admin/media",
      icon: Image,
    },
    {
      title: "Cài đặt hệ thống",
      url: "/admin/settings",
      icon: Settings,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props} >
      <SidebarHeader>
        <LogoSidebar/>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
