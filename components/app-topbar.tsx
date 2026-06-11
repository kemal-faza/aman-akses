"use client";

import { usePathname } from "next/navigation";
import { Settings, Bell } from "lucide-react";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { navItems } from "./nav-items";

export function AppTopbar() {
  const pathname = usePathname();
  const currentItem = navItems.find(
    (item) =>
      item.url === "/" ? pathname === "/" : pathname.startsWith(item.url)
  );
  const title = currentItem?.title ?? "AmanAkses";

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-background px-8">
      <div className="flex items-center gap-3">
        <SidebarTrigger />
        <h1 className="text-[36px] font-bold tracking-[-1px] text-foreground leading-display-lg">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => console.log("Not implemented: Settings")}
          aria-label="Pengaturan"
        >
          <Settings className="size-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => console.log("Not implemented: Notifications")}
          aria-label="Notifikasi"
        >
          <Bell className="size-5" />
        </Button>
        <Avatar className="size-9 rounded-full ml-2">
          <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground text-sm font-medium">
            P
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
