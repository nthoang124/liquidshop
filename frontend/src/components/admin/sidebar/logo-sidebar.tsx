"use client"

import { Link } from "react-router-dom"

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import logoshop from "@/assets/icons/TL-Logo.png"

export function LogoSidebar() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          tooltip="Trang chủ"
          className="group active:bg-transparent hover:bg-transparent hover:text-inherit flex pl-0" 
        >
          <Link to="/admin">
            <div className="flex items-center gap-3">
              
              {/* LOGO */}
              <div
                className="
                  flex items-center justify-center
                  size-14               /* normal */
                  rounded-lg
                  ml-0
                  group-data-[collapsible=icon]:size-10
                  group-data-[collapsible=icon]:-ml-3
                "
              >
                <img
                  src={logoshop}
                  alt="logoshop"
                  className="
                    w-full h-full object-contain
                    group-data-[collapsible=icon]:p-1
                  "
                />
              </div>

              {/* TEXT - ẨN KHI COLLAPSED */}
              <div
                className="
                  flex flex-col text-xl font-medium text-white leading-tight
                  group-data-[collapsible=icon]:hidden
                "
              >
                <span className="truncate">Liquid shop</span>
              </div>

            </div>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
