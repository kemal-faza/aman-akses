"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function Home() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex flex-1 items-center justify-center">
        <div className="text-center">
          <SidebarTrigger className="mb-4" />
          <h1 className="text-display-lg font-bold text-primary-text">
            AmanAkses
          </h1>
        </div>
      </main>
    </SidebarProvider>
  );
}
