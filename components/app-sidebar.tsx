"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { navItems } from "./nav-items";

export function AppSidebar() {
  const pathname = usePathname();
  const { open } = useSidebar();

  return (
    <Sidebar collapsible="icon">
      {/* Header: Logo + Brand */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link href="/" />}>
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Shield className="size-4" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="text-lg font-semibold">AmanAkses</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Content: Navigation items */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className="gap-0.5">
            {navItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  render={<Link href={item.url} />}
                  isActive={
                    item.url === "/"
                      ? pathname === "/"
                      : pathname.startsWith(item.url)
                  }
                  tooltip={item.title}
                >
                  <item.icon className="size-5" />
                  <span className="text-sm font-medium group-data-[active=true]:font-semibold">
                    {item.title}
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer: User profile placeholder */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <Avatar className="size-9 rounded-full">
                <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground text-sm font-medium">
                  P
                </AvatarFallback>
              </Avatar>
              {open && (
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Pengguna</span>
                  <span className="text-xs text-muted-foreground">
                    pengguna@email.com
                  </span>
                </div>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
