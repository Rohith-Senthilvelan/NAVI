"use client";

import { Bell, ChevronRight, Moon, Sparkles, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useUIStore, useUserStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const ROUTE_LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  budget: "Budget",
  savings: "Savings",
  insights: "Insights",
  subscriptions: "Subscriptions",
  invest: "Invest",
  circles: "Circles",
  advisor: "Advisor",
  settings: "Settings",
};

function getGreeting(hour: number, name: string) {
  const first = name.split(" ")[0];
  if (hour < 12) return `Good morning, ${first}`;
  if (hour < 17) return `Good afternoon, ${first}`;
  return `Good evening, ${first}`;
}

export function Topbar() {
  const pathname = usePathname();
  const { name } = useUserStore();
  const { setAdvisorDrawerOpen } = useUIStore();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [hour, setHour] = useState(12);

  useEffect(() => {
    setMounted(true);
    setHour(new Date().getHours());
  }, []);

  const crumbs = useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);
    return segments.map((seg, i) => ({
      label: ROUTE_LABELS[seg] ?? seg,
      href: "/" + segments.slice(0, i + 1).join("/"),
      isLast: i === segments.length - 1,
    }));
  }, [pathname]);

  const greeting = getGreeting(hour, name);

  return (
    <header className="sticky top-0 z-30 flex h-[72px] shrink-0 items-center gap-4 border-b border-white/5 bg-primary/80 px-6 backdrop-blur-xl lg:px-8">
      {/* Breadcrumbs */}
      <nav
        aria-label="Breadcrumb"
        className="hidden min-w-0 flex-1 items-center gap-1 text-sm md:flex"
      >
        {crumbs.map((crumb, i) => (
          <span key={crumb.href} className="flex min-w-0 items-center gap-1">
            {i > 0 && (
              <ChevronRight className="h-3.5 w-3.5 shrink-0 text-text-mid/50" />
            )}
            <span
              className={cn(
                "truncate",
                crumb.isLast
                  ? "font-medium text-text-high"
                  : "text-text-mid"
              )}
            >
              {crumb.label}
            </span>
          </span>
        ))}
      </nav>

      {/* Center greeting */}
      <div className="hidden flex-1 flex-col items-center text-center lg:flex">
        <p className="text-sm font-medium text-text-high">{greeting}</p>
        <p className="text-xs text-text-mid">
          <span className="text-accent/80">AED 12,480</span> available across
          accounts
        </p>
      </div>

      {/* Actions */}
      <div className="ml-auto flex shrink-0 items-center gap-2">
        <button
          type="button"
          className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-text-mid transition-colors hover:bg-white/[0.06] hover:text-text-high"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-red-500 ring-2 ring-primary" />
        </button>

        <button
          type="button"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-text-mid transition-colors hover:bg-white/[0.06] hover:text-text-high"
          aria-label="Toggle theme"
        >
          {mounted && theme === "dark" ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setAdvisorDrawerOpen(true)}
          className="flex items-center gap-2 rounded-full border border-accent/25 bg-gradient-to-r from-accent/15 to-accent/5 px-4 py-2 text-sm font-medium text-accent transition-all hover:border-accent/40 hover:from-accent/25 hover:to-accent/10"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Ask Navi</span>
        </button>
      </div>
    </header>
  );
}
