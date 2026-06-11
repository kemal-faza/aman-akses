"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { AppTopbar } from "@/components/app-topbar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "260px",
          "--sidebar-width-icon": "3rem",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <main className="flex flex-1 flex-col">
        <AppTopbar />
        <div className="flex-1 p-8 max-w-[1200px] w-full mx-auto">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}
