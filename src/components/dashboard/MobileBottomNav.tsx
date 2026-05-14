"use client";

import {
  LayoutDashboard,
  MessageSquare,
  PiggyBank,
  Settings,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const MOBILE_NAV = [
  { label: "Home", href: "/dashboard", icon: LayoutDashboard },
  { label: "Budget", href: "/budget", icon: Wallet },
  { label: "Savings", href: "/savings", icon: PiggyBank },
  { label: "Advisor", href: "/advisor", icon: MessageSquare },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-primary/95 backdrop-blur-xl lg:hidden"
      aria-label="Mobile navigation"
    >
      <div className="mx-auto flex max-w-lg items-stretch justify-around px-2 pb-[env(safe-area-inset-bottom)]">
        {MOBILE_NAV.map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium transition-colors",
                active ? "text-accent" : "text-text-mid"
              )}
            >
              <Icon
                className={cn(
                  "h-5 w-5",
                  active && "drop-shadow-[0_0_8px_rgba(0,224,184,0.5)]"
                )}
              />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
