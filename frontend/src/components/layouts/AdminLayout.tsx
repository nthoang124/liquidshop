import { AppSidebar } from "@/components/admin/sidebar/app-sidebar"
import { Outlet } from "react-router-dom";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import Header from "../admin/sidebar/header"

export default function AdminLayout() {
  return (
    <SidebarProvider >
      <AppSidebar />
      <SidebarInset className="bg-[#F7F9FC]">
        <Header/>
        <Outlet/>
      </SidebarInset>
    </SidebarProvider>
  )
}
