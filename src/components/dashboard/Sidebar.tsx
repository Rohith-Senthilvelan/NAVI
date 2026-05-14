"use client";

import {
  ChevronUp,
  LayoutDashboard,
  LineChart,
  Lock,
  LogOut,
  MessageSquare,
  PiggyBank,
  Receipt,
  Search,
  Settings,
  Sparkles,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { clearAuthCookie } from "@/lib/auth";
import { useUserStore } from "@/lib/store";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  online?: boolean;
  locked?: boolean;
};

type NavGroup = {
  title: string;
  items: NavItem[];
};

const NAV_GROUPS: NavGroup[] = [
  {
    title: "Overview",
    items: [{ label: "Dashboard", href: "/dashboard", icon: LayoutDashboard }],
  },
  {
    title: "Money",
    items: [
      { label: "Budget", href: "/budget", icon: Wallet },
      { label: "Savings", href: "/savings", icon: PiggyBank },
      { label: "Insights", href: "/insights", icon: LineChart },
      { label: "Subscriptions", href: "/subscriptions", icon: Receipt },
    ],
  },
  {
    title: "Grow",
    items: [
      { label: "Invest", href: "/invest", icon: TrendingUp },
      { label: "Circles", href: "/circles", icon: Users },
    ],
  },
  {
    title: "Coach",
    items: [
      {
        label: "Advisor",
        href: "/advisor",
        icon: MessageSquare,
        online: true,
      },
    ],
  },
  {
    title: "Business",
    items: [
      {
        label: "Business Advisor",
        href: "#",
        icon: Lock,
        locked: true,
      },
    ],
  },
];

function useCollapsedSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1099px)");
    const update = () => setCollapsed(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return collapsed;
}

function NavLink({
  item,
  active,
  collapsed,
}: {
  item: NavItem;
  active: boolean;
  collapsed: boolean;
}) {
  const Icon = item.icon;

  if (item.locked) {
    return (
      <div
        title={collapsed ? item.label : undefined}
        className={cn(
          "group relative flex cursor-not-allowed items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-text-mid/70",
          collapsed && "justify-center px-2"
        )}
      >
        <Icon className="h-[18px] w-[18px] shrink-0 text-gold/80" />
        {!collapsed && (
          <span className="flex flex-1 items-center justify-between gap-2">
            <span>{item.label}</span>
            <span className="rounded-full border border-gold/20 bg-gold/5 px-2 py-0.5 text-[10px] font-medium text-gold">
              Unlock with Plus
            </span>
          </span>
        )}
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      title={collapsed ? item.label : undefined}
      className={cn(
        "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200",
        collapsed && "justify-center px-2",
        active
          ? "bg-gradient-to-r from-accent/10 via-accent/5 to-transparent text-text-high"
          : "text-text-mid hover:bg-white/[0.04] hover:text-text-high"
      )}
    >
      {active && (
        <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-accent shadow-[0_0_12px_rgba(0,224,184,0.6)]" />
      )}
      <span className="relative flex shrink-0 items-center">
        <Icon
          className={cn(
            "h-[18px] w-[18px] transition-colors",
            active ? "text-accent" : "text-text-mid group-hover:text-text-high"
          )}
        />
        {item.online && (
          <span className="absolute -right-0.5 -top-0.5 flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
        )}
      </span>
      {!collapsed && <span className="truncate">{item.label}</span>}
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const collapsed = useCollapsedSidebar();
  const { name, email, initials } = useUserStore();

  const handleLogout = () => {
    clearAuthCookie();
    router.push("/login");
  };

  return (
    <aside
      className={cn(
        "sticky top-0 flex h-screen shrink-0 flex-col border-r border-white/10 bg-white/[0.03] backdrop-blur-[24px] transition-[width] duration-300 ease-out",
        collapsed ? "w-[72px]" : "w-[260px]"
      )}
    >
      <div
        className={cn(
          "flex items-center gap-2.5 border-b border-white/5 px-4 py-5",
          collapsed && "justify-center px-2"
        )}
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06]">
          <Sparkles className="h-4 w-4 text-accent" />
        </div>
        {!collapsed && (
          <div className="flex min-w-0 items-center gap-2">
            <span className="truncate text-base font-semibold tracking-tight text-text-high">
              Navi
            </span>
            <span className="shrink-0 rounded-full border border-accent/20 bg-accent/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-accent">
              Beta
            </span>
          </div>
        )}
      </div>

      <div className={cn("px-3 py-4", collapsed && "px-2")}>
        <button
          type="button"
          className={cn(
            "flex w-full items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-text-mid transition-colors hover:border-white/15 hover:bg-white/[0.05]",
            collapsed && "justify-center px-2"
          )}
          title="Search (⌘K)"
        >
          <Search className="h-4 w-4 shrink-0" />
          {!collapsed && (
            <>
              <span className="flex-1 text-left">Search…</span>
              <kbd className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-text-mid">
                ⌘K
              </kbd>
            </>
          )}
        </button>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 pb-4">
        {NAV_GROUPS.map((group) => (
          <div key={group.title}>
            {!collapsed && (
              <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-text-mid/60">
                {group.title}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <NavLink
                  key={item.label}
                  item={item}
                  collapsed={collapsed}
                  active={
                    !item.locked &&
                    (pathname === item.href ||
                      (item.href !== "/dashboard" &&
                        pathname.startsWith(item.href)))
                  }
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className={cn("border-t border-white/5 p-3", collapsed && "px-2")}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className={cn(
                "flex w-full items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-2.5 text-left transition-colors hover:bg-white/[0.06]",
                collapsed && "justify-center p-2"
              )}
            >
              <Avatar className="h-9 w-9 border border-accent/20">
                <AvatarFallback className="bg-accent/10 text-xs font-semibold text-accent">
                  {initials}
                </AvatarFallback>
              </Avatar>
              {!collapsed && (
                <>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-text-high">
                      {name}
                    </p>
                    <p className="truncate text-xs text-text-mid">{email}</p>
                  </div>
                  <ChevronUp className="h-4 w-4 shrink-0 text-text-mid" />
                </>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" side="top" className="w-52">
            <DropdownMenuItem asChild>
              <Link href="/settings" className="cursor-pointer">
                <Settings className="h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer text-red-400 focus:text-red-400"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}
