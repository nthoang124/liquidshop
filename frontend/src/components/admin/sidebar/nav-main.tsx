import { Link, useLocation } from "react-router-dom"
import { type LucideIcon , ChevronRight} from "lucide-react"

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    items?: 
      {
        title: string
        url: string
      }[];
  }[]
}) {
  const { pathname } = useLocation()

  return (
    <SidebarGroup>
      <SidebarMenu className="gap-1">
        {items.map((item) => {
          const isActive = pathname === item.url
          // const isParentActive = pathname.startsWith(item.url)
          const isParentActive = pathname === item.url || pathname.startsWith(item.url + "/");

          if(item.items){
            return (
              <Collapsible
                key={item.title}
                asChild
                defaultOpen={isParentActive}
                className="group/collapsible"
              >
                <SidebarMenuItem >
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      isActive={isParentActive}
                    >
                      <div className="flex items-center justify-between gap-2">
                          {item.icon && <item.icon className="!h-5.5 !w-5.5" strokeWidth={1.75}/>}
                          <span className="text-[0.95rem] data-[active=true]:text-blue-400">{item.title}</span>
                          <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </div>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub className="flex flex-col gap-3">
                      {item.items?.map((subItem) => {
                        const isSubActive = pathname === subItem.url;
                        return (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton 
                              asChild
                              isActive={isSubActive}
                              className="group data-[active=true]:bg-blue-100
                                  data-[active=true]:text-blue-500
                                  data-[active=true]:font-bold
                                  data-[active=true]:border
                                  data-[active=true]:border-blue-400"
                              >
                              <Link to={subItem.url} className="text-[0.95rem] text-black ml-2">
                                {subItem.title}
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        )}
                      )}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            )
          }

          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                isActive={isActive}
                className="data-[active=true]:bg-blue-100
                          data-[active=true]:border-l-4
                          data-[active=true]:border-blue-400
                          data-[active=true]:text-blue-500
                          data-[active=true]:font-bold
                          data-[active=true]:border"

              >
                <Link to={item.url} className="flex items-center gap-2">
                  {item.icon && <item.icon className="!h-5.5 !w-5.5" strokeWidth={1.75}/>}
                  <span className="text-[0.95rem] data-[active=true]:text-blue-400">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
