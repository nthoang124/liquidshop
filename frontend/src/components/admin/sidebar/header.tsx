import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import AutoBreadcrumb from "./autoBreadCumb";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function Header() {
    return (
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <AutoBreadcrumb/>   
          </div>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
                placeholder="Tìm kiếm..."
                className="pl-8 h-9 max-w-80 w-full bg-white"
            />
          </div>
        </header>
    )
}