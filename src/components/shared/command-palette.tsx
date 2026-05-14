"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { useFinanceStore, useToastStore, useUIStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import {
  MessageSquare,
  PiggyBank,
  Receipt,
  Search,
  Wallet,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

type CommandAction = {
  id: string;
  label: string;
  hint?: string;
  icon: React.ComponentType<{ className?: string }>;
  run: () => void;
};

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { setAdvisorDrawerOpen } = useUIStore();
  const { subscriptions, cancelSubscription } = useFinanceStore();
  const { toast } = useToastStore();

  const actions: CommandAction[] = useMemo(() => {
    const unusedSub = subscriptions.find(
      (s) => s.active && (s.status === "unused" || s.lastUsed)
    );

    return [
      {
        id: "budget",
        label: "Go to Budget",
        hint: "View & edit budgets",
        icon: Wallet,
        run: () => router.push("/budget"),
      },
      {
        id: "ask-navi",
        label: "Ask Navi",
        hint: "Open AI coach",
        icon: MessageSquare,
        run: () => setAdvisorDrawerOpen(true),
      },
      {
        id: "new-goal",
        label: "New Goal",
        hint: "Savings goals",
        icon: PiggyBank,
        run: () => router.push("/savings"),
      },
      {
        id: "cancel-sub",
        label: "Cancel Sub",
        hint: unusedSub ? `Pause ${unusedSub.name}` : "Subscriptions",
        icon: Receipt,
        run: () => {
          if (unusedSub) {
            cancelSubscription(unusedSub.id);
            toast("Subscription cancelled", "success");
          } else {
            router.push("/subscriptions");
          }
        },
      },
    ];
  }, [router, setAdvisorDrawerOpen, subscriptions, cancelSubscription, toast]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return actions;
    return actions.filter(
      (a) =>
        a.label.toLowerCase().includes(q) ||
        a.hint?.toLowerCase().includes(q)
    );
  }, [actions, query]);

  const runAction = useCallback((action: CommandAction) => {
    setOpen(false);
    setQuery("");
    action.run();
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("navi:open-command-palette", handler);
    return () => window.removeEventListener("navi:open-command-palette", handler);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="gap-0 overflow-hidden border-white/10 bg-surface/95 p-0 backdrop-blur-2xl sm:max-w-lg">
        <DialogTitle className="sr-only">Command palette</DialogTitle>
        <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
          <Search className="h-4 w-4 shrink-0 text-text-mid" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search actions…"
            className="flex-1 bg-transparent text-sm text-text-high outline-none placeholder:text-text-mid"
            autoFocus
          />
          <kbd className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-text-mid">
            esc
          </kbd>
        </div>
        <ul className="max-h-72 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <li className="px-3 py-8 text-center text-sm text-text-mid">
              No matching actions
            </li>
          ) : (
            filtered.map((action) => {
              const Icon = action.icon;
              return (
                <li key={action.id}>
                  <button
                    type="button"
                    onClick={() => runAction(action)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors",
                      "hover:bg-white/[0.06] focus:bg-white/[0.06] focus:outline-none"
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0 text-accent" />
                    <span className="flex-1 font-medium text-text-high">
                      {action.label}
                    </span>
                    {action.hint && (
                      <span className="text-xs text-text-mid">{action.hint}</span>
                    )}
                  </button>
                </li>
              );
            })
          )}
        </ul>
      </DialogContent>
    </Dialog>
  );
}
