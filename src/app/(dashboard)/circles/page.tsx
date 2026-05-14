"use client";

import { EmptyState } from "@/components/shared/empty-state";
import { GridCardSkeleton } from "@/components/shared/card-skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { usePageReady } from "@/hooks/use-page-ready";
import type { MockCircle } from "@/lib/mock-data";
import { useFinanceStore, useToastStore } from "@/lib/store";
import { cn, formatAED } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Calendar,
  ChevronRight,
  Plus,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";

function ProgressRing({
  progress,
  size = 72,
}: {
  progress: number;
  size?: number;
}) {
  const stroke = 4;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(progress, 100) / 100) * circumference;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#00E0B8"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-mono text-xs font-semibold text-text-high">
          {Math.round(progress)}%
        </span>
      </div>
    </div>
  );
}

function MemberStack({ members }: { members: MockCircle["members"] }) {
  const visible = members.slice(0, 4);
  const extra = members.length - visible.length;

  return (
    <div className="flex -space-x-2">
      {visible.map((m) => (
        <Avatar
          key={m.name}
          className="h-8 w-8 border-2 border-primary ring-0"
        >
          <AvatarFallback className="bg-accent/15 text-[10px] font-semibold text-accent">
            {m.initials}
          </AvatarFallback>
        </Avatar>
      ))}
      {extra > 0 && (
        <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary bg-white/10 text-[10px] font-medium text-text-mid">
          +{extra}
        </div>
      )}
    </div>
  );
}

function CircleCard({
  circle,
  onOpen,
}: {
  circle: MockCircle;
  onOpen: () => void;
}) {
  const progress = (circle.totalSaved / circle.target) * 100;

  return (
    <motion.button
      type="button"
      onClick={onOpen}
      whileHover={{ y: -2 }}
      className="group w-full rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 text-left backdrop-blur-xl transition-colors hover:border-accent/20 hover:bg-white/[0.05]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold text-text-high">{circle.name}</h3>
          <p className="mt-1 text-xs text-text-mid">
            {formatAED(circle.monthlyContribution)}/mo each
          </p>
        </div>
        <ProgressRing progress={progress} />
      </div>
      <div className="mt-4 flex items-center justify-between">
        <MemberStack members={circle.members} />
        <div className="text-right">
          <p className="font-mono text-sm font-semibold text-text-high">
            {formatAED(circle.totalSaved)}
          </p>
          <p className="text-[10px] text-text-mid">
            of {formatAED(circle.target)}
          </p>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-1 text-xs text-accent opacity-0 transition-opacity group-hover:opacity-100">
        View details <ChevronRight className="h-3.5 w-3.5" />
      </div>
    </motion.button>
  );
}

export default function CirclesPage() {
  const ready = usePageReady();
  const { circles, addCircle } = useFinanceStore();
  const { toast } = useToastStore();
  const [selected, setSelected] = useState<MockCircle | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [monthly, setMonthly] = useState("");
  const [invites, setInvites] = useState("");

  const sortedCircles = useMemo(
    () => [...circles].sort((a, b) => b.totalSaved - a.totalSaved),
    [circles]
  );

  const handleCreate = () => {
    const targetNum = Number(target);
    const monthlyNum = Number(monthly);
    if (!name.trim() || !targetNum || !monthlyNum) return;

    addCircle({
      name: name.trim(),
      target: targetNum,
      monthlyContribution: monthlyNum,
      members: [],
      inviteEmails: invites
        .split(/[,;\s]+/)
        .map((e) => e.trim())
        .filter(Boolean),
    });

    toast(`Circle "${name.trim()}" created`, "success");
    setDialogOpen(false);
    setName("");
    setTarget("");
    setMonthly("");
    setInvites("");
  };

  if (!ready) {
    return (
      <div className="space-y-8">
        <div className="h-16 animate-pulse rounded-xl bg-white/[0.04]" />
        <GridCardSkeleton count={2} />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-accent/80">
            Together
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-text-high">
            Circles — save together
          </h1>
          <p className="mt-1 text-sm text-text-mid">
            Pool money with friends and family toward shared goals.
          </p>
        </div>
        <Button
          type="button"
          onClick={() => setDialogOpen(true)}
          className="rounded-full bg-accent text-primary hover:bg-accent/90"
        >
          <Plus className="mr-1.5 h-4 w-4" />
          New Circle
        </Button>
      </div>

      {sortedCircles.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No circles yet"
          description="Start a shared pot with people you trust."
          actionLabel="Create your first circle"
          onAction={() => setDialogOpen(true)}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {sortedCircles.map((circle, i) => (
            <motion.div
              key={circle.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <CircleCard circle={circle} onOpen={() => setSelected(circle)} />
            </motion.div>
          ))}
        </div>
      )}

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="w-full overflow-y-auto border-white/10 bg-surface/95 sm:max-w-lg">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle className="text-text-high">{selected.name}</SheetTitle>
                <SheetDescription>
                  {selected.members.length} members ·{" "}
                  {formatAED(selected.totalSaved)} saved of{" "}
                  {formatAED(selected.target)}
                </SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                <section>
                  <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-text-mid">
                    Members
                  </h3>
                  <ul className="space-y-2">
                    {selected.members.map((m) => (
                      <li
                        key={m.name}
                        className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2.5"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-accent/10 text-xs text-accent">
                              {m.initials}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-text-high">{m.name}</span>
                        </div>
                        {m.contributed != null && (
                          <span className="font-mono text-xs text-text-mid">
                            {formatAED(m.contributed)}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </section>

                <section>
                  <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-text-mid">
                    Contribution history
                  </h3>
                  {selected.contributionHistory.length === 0 ? (
                    <p className="rounded-xl border border-dashed border-white/10 py-8 text-center text-sm text-text-mid">
                      No contributions yet — first deposit on the 1st.
                    </p>
                  ) : (
                    <ul className="space-y-2">
                      {selected.contributionHistory.map((c) => (
                        <li
                          key={c.id}
                          className="flex items-center justify-between rounded-xl bg-white/[0.03] px-3 py-2 text-sm"
                        >
                          <span className="text-text-high">{c.memberName}</span>
                          <span className="font-mono text-accent">
                            +{formatAED(c.amount)}
                          </span>
                          <span className="text-xs text-text-mid">
                            {new Date(c.date).toLocaleDateString("en-AE", {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>

                <section>
                  <h3 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-text-mid">
                    <Calendar className="h-3.5 w-3.5" />
                    Payout schedule
                  </h3>
                  <ul className="space-y-2">
                    {selected.payoutSchedule.map((p) => (
                      <li
                        key={p.id}
                        className={cn(
                          "flex items-center justify-between rounded-xl border px-3 py-2.5",
                          p.status === "completed"
                            ? "border-accent/20 bg-accent/5"
                            : "border-white/[0.06] bg-white/[0.03]"
                        )}
                      >
                        <div>
                          <p className="text-sm font-medium text-text-high">
                            {p.label}
                          </p>
                          <p className="text-xs text-text-mid">
                            {new Date(p.date).toLocaleDateString("en-AE", {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-mono text-sm text-text-high">
                            {formatAED(p.amount)}
                          </p>
                          <p className="text-[10px] capitalize text-text-mid">
                            {p.status}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="border-white/10 bg-surface/95 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle>New Circle</DialogTitle>
            <DialogDescription>
              Set a shared goal and invite members by email (mock).
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <motion.div className="space-y-2">
              <Label htmlFor="circle-name">Circle name</Label>
              <Input
                id="circle-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="E.g. Wedding fund"
                className="border-white/10 bg-white/[0.04]"
              />
            </motion.div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="circle-target">Target (AED)</Label>
                <Input
                  id="circle-target"
                  type="number"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  placeholder="10000"
                  className="border-white/10 bg-white/[0.04]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="circle-monthly">Monthly amount (AED)</Label>
                <Input
                  id="circle-monthly"
                  type="number"
                  value={monthly}
                  onChange={(e) => setMonthly(e.target.value)}
                  placeholder="500"
                  className="border-white/10 bg-white/[0.04]"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="circle-invites">Invite emails</Label>
              <Input
                id="circle-invites"
                value={invites}
                onChange={(e) => setInvites(e.target.value)}
                placeholder="friend@email.com, cousin@email.com"
                className="border-white/10 bg-white/[0.04]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setDialogOpen(false)}
              className="text-text-mid"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleCreate}
              className="rounded-full bg-accent text-primary hover:bg-accent/90"
            >
              Create circle
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
