"use client";

import { AdvisorDrawer } from "@/components/advisor/AdvisorDrawer";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-primary">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="relative flex-1 overflow-y-auto">
          <div
            className="pointer-events-none absolute inset-x-0 top-0 z-10 h-28 bg-gradient-to-b from-primary via-primary/60 to-transparent"
            aria-hidden
          />
          <div className="relative mx-auto max-w-[1400px] px-6 py-8 lg:px-10 lg:py-10">
            {children}
          </div>
        </main>
      </div>
      <AdvisorDrawer />
    </div>
  );
}
