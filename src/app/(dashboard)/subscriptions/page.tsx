"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { Subscription } from "@/lib/mock-data";
import { useFinanceStore, useToastStore } from "@/lib/store";
import { cn, formatAED } from "@/lib/utils";
import { motion, useSpring, useTransform } from "framer-motion";
import {
  AlertTriangle,
  BellOff,
  Check,
  Copy,
  ExternalLink,
  HandCoins,
  Mail,
  Sparkles,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";

const REF_DATE = new Date("2026-05-14");

const KPI_DISPLAY = {
  total: 487,
  unused: 142,
  negotiable: 211,
};

const STATUS_STYLES: Record<
  Subscription["status"],
  { label: string; className: string }
> = {
  active: {
    label: "Active",
    className: "border-accent/30 bg-accent/10 text-accent",
  },
  unused: {
    label: "Unused",
    className: "border-red-500/30 bg-red-500/10 text-red-400",
  },
  trial: {
    label: "Trial",
    className: "border-blue-400/30 bg-blue-400/10 text-blue-300",
  },
  negotiable: {
    label: "Negotiable",
    className: "border-amber-400/30 bg-amber-400/10 text-amber-300",
  },
};

function AnimatedKpi({ value }: { value: number }) {
  const spring = useSpring(0, { stiffness: 60, damping: 18 });
  const display = useTransform(spring, (v) =>
    new Intl.NumberFormat("en-AE", { maximumFractionDigits: 0 }).format(
      Math.round(v)
    )
  );
  spring.set(value);
  return <motion.span className="font-mono tabular-nums">{display}</motion.span>;
}

function formatLastUsed(lastUsed: string) {
  if (lastUsed.toLowerCase().includes("not used")) {
    return { text: lastUsed, stale: true };
  }
  const used = new Date(lastUsed);
  const diff = Math.round(
    (REF_DATE.getTime() - used.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (diff <= 0) return { text: "Today", stale: false };
  if (diff === 1) return { text: "1 day ago", stale: false };
  return { text: `${diff} days ago`, stale: diff > 14 };
}

function buildNegotiationEmail(
  sub: Subscription,
  lang: "en" | "ar"
): string {
  const competitor = sub.competitor ?? "a competitor";
  const competitorPrice = sub.competitorPrice ?? 19;

  if (lang === "ar") {
    return `السلام عليكم،

أنا عميل لدى ${sub.name} منذ ${sub.customerMonths} شهراً وأدفع حالياً ${formatAED(sub.amount)} شهرياً على خطة ${sub.plan}.

أفكر بالانتقال إلى ${competitor} بسعر ${formatAED(competitorPrice)} شهرياً. هل يمكنكم مطابقة هذا السعر أو تقديم خصم ولاء؟

شكراً لكم،
رهيث`;
  }

  return `Hello ${sub.name} Support,

I've been a customer for ${sub.customerMonths} months on the ${sub.plan} plan at ${formatAED(sub.amount)}/month.

I'm considering switching to ${competitor} at ${formatAED(competitorPrice)}/month. Could you match this rate or offer a loyalty discount?

Thank you,
Rohith`;
}

export default function SubscriptionsPage() {
  const { subscriptions, cancelSubscription, snoozeSubscription } =
    useFinanceStore();
  const { toast } = useToastStore();

  const [cancelTarget, setCancelTarget] = useState<Subscription | null>(null);
  const [negotiateTarget, setNegotiateTarget] = useState<Subscription | null>(
    null
  );
  const [emailLang, setEmailLang] = useState<"en" | "ar">("en");
  const [copied, setCopied] = useState(false);

  const unusedSubs = useMemo(
    () => subscriptions.filter((s) => s.status === "unused" && s.active),
    [subscriptions]
  );
  const unusedMonthly = useMemo(
    () => Math.round(unusedSubs.reduce((sum, s) => sum + s.amount, 0)),
    [unusedSubs]
  );

  const emailBody = negotiateTarget
    ? buildNegotiationEmail(negotiateTarget, emailLang)
    : "";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(emailBody);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleMailClient = () => {
    if (!negotiateTarget) return;
    const subject = encodeURIComponent(
      `${negotiateTarget.name} — Loyalty rate request`
    );
    const body = encodeURIComponent(emailBody);
    window.open(`mailto:?subject=${subject}&body=${body}`, "_blank");
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-accent/80">
          Recurring spend
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-text-high">
          Subscriptions
        </h1>
      </motion.div>

      {/* KPI strip */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          {
            label: "Total monthly subs",
            value: KPI_DISPLAY.total,
            accent: "text-text-high",
          },
          {
            label: "Unused",
            value: KPI_DISPLAY.unused,
            accent: "text-red-400",
          },
          {
            label: "Negotiable",
            value: KPI_DISPLAY.negotiable,
            accent: "text-amber-300",
          },
        ].map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 backdrop-blur-xl"
          >
            <p className="text-[11px] font-medium uppercase tracking-wider text-text-mid">
              {kpi.label}
            </p>
            <p className={cn("mt-2 text-2xl font-semibold", kpi.accent)}>
              AED <AnimatedKpi value={kpi.value} />
            </p>
          </motion.div>
        ))}
      </div>

      {/* Subscriptions table */}
      <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl">
        <motion.div
          className="hidden border-b border-white/[0.06] px-5 py-3 text-[11px] font-medium uppercase tracking-wider text-text-mid md:grid md:grid-cols-[1.4fr_1fr_1fr_0.8fr_1.2fr]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <span>Service</span>
          <span>Cost</span>
          <span>Last used</span>
          <span>Status</span>
          <span className="text-right">Actions</span>
        </motion.div>

        <motion.div
          className="divide-y divide-white/[0.06]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {subscriptions.map((sub, i) => {
            const lastUsed = formatLastUsed(sub.lastUsed);
            const statusStyle = STATUS_STYLES[sub.status];
            const initial = sub.name.charAt(0).toUpperCase();

            return (
              <motion.div
                key={sub.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 + i * 0.03 }}
                className={cn(
                  "flex flex-col gap-4 px-5 py-4 md:grid md:grid-cols-[1.4fr_1fr_1fr_0.8fr_1.2fr] md:items-center",
                  (!sub.active || sub.snoozed) && "opacity-50"
                )}
              >
                {/* Name + logo */}
                <div className="flex items-center gap-3">
                  <motion.div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-primary"
                    style={{ backgroundColor: sub.logoColor }}
                  >
                    {initial}
                  </motion.div>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-text-high">
                      {sub.name}
                      {sub.snoozed && (
                        <span className="ml-2 text-[10px] text-text-mid">
                          (snoozed)
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-text-mid">{sub.plan}</p>
                  </div>
                </div>

                {/* Cost */}
                <div>
                  <p className="font-mono text-sm text-text-high">
                    {formatAED(sub.amount)}
                    <span className="text-text-mid">/mo</span>
                  </p>
                  <p className="text-[11px] capitalize text-text-mid">
                    {sub.billingCycle}
                  </p>
                </div>

                {/* Last used */}
                <p
                  className={cn(
                    "text-sm",
                    lastUsed.stale ? "font-medium text-red-400" : "text-text-mid"
                  )}
                >
                  {lastUsed.text}
                </p>

                {/* Status */}
                <span
                  className={cn(
                    "inline-flex w-fit rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                    statusStyle.className
                  )}
                >
                  {statusStyle.label}
                </span>

                {/* Actions */}
                <div className="flex flex-wrap gap-2 md:justify-end">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 border-white/10 px-2.5 text-[11px] hover:border-red-400/30 hover:bg-red-500/10 hover:text-red-400"
                    disabled={!sub.active}
                    onClick={() => setCancelTarget(sub)}
                  >
                    <XCircle className="mr-1 h-3 w-3" />
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 border-white/10 px-2.5 text-[11px] hover:border-amber-400/30 hover:bg-amber-400/10 hover:text-amber-300"
                    disabled={!sub.active || sub.status === "unused"}
                    onClick={() => {
                      setNegotiateTarget(sub);
                      setEmailLang("en");
                      setCopied(false);
                    }}
                  >
                    <HandCoins className="mr-1 h-3 w-3" />
                    Negotiate
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 px-2.5 text-[11px] text-text-mid hover:text-text-high"
                    disabled={!sub.active}
                    onClick={() => snoozeSubscription(sub.id)}
                  >
                    <BellOff className="mr-1 h-3 w-3" />
                    {sub.snoozed ? "Unsnooze" : "Snooze"}
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Unused Detector banner */}
      {unusedSubs.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="flex flex-col gap-4 rounded-2xl border border-red-500/25 bg-gradient-to-r from-red-500/10 to-transparent p-6 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-red-500/30 bg-red-500/10">
              <AlertTriangle className="h-5 w-5 text-red-400" />
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-sm font-semibold text-text-high">
                Unused Detector
              </p>
              <p className="mt-1 text-sm leading-relaxed text-text-mid">
                You&apos;re paying{" "}
                <span className="font-medium text-red-300">
                  {formatAED(unusedMonthly)}/mo
                </span>{" "}
                for services you haven&apos;t opened in 30+ days. Cancel{" "}
                {Math.min(2, unusedSubs.length)} to save{" "}
                <span className="font-medium text-accent">
                  {formatAED(
                    Math.round(
                      unusedSubs
                        .slice(0, 2)
                        .reduce((s, u) => s + u.amount, 0) * 12
                    )
                  )}
                  /year
                </span>
                .
              </p>
            </motion.div>
          </div>
          <Button
            className="shrink-0 bg-red-500/90 text-white hover:bg-red-500"
            onClick={() => {
              unusedSubs.slice(0, 2).forEach((s) => cancelSubscription(s.id));
            }}
          >
            Cancel top 2 unused
          </Button>
        </motion.div>
      )}

      {/* Cancel confirmation */}
      <Dialog
        open={!!cancelTarget}
        onOpenChange={(open) => !open && setCancelTarget(null)}
      >
        <DialogContent className="border-white/10 bg-primary sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-text-high">
              Cancel {cancelTarget?.name}?
            </DialogTitle>
            <DialogDescription>
              You&apos;ll stop paying {formatAED(cancelTarget?.amount ?? 0)}
              /month. This takes effect at the end of the current billing period.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              className="border-white/10"
              onClick={() => setCancelTarget(null)}
            >
              Keep subscription
            </Button>
            <Button
              className="bg-red-500 text-white hover:bg-red-600"
              onClick={() => {
                if (cancelTarget) {
                  cancelSubscription(cancelTarget.id);
                  toast("Subscription cancelled", "success");
                }
                setCancelTarget(null);
              }}
            >
              Confirm cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AI Negotiator panel */}
      <Sheet
        open={!!negotiateTarget}
        onOpenChange={(open) => !open && setNegotiateTarget(null)}
      >
        <SheetContent
          side="right"
          className="flex w-full flex-col border-white/10 bg-primary sm:max-w-lg"
        >
          {negotiateTarget && (
            <>
              <SheetHeader className="text-left">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-accent" />
                  <SheetTitle>
                    Negotiate with {negotiateTarget.name}
                  </SheetTitle>
                </div>
                <SheetDescription>
                  Navi drafted a rate-match email you can send today.
                </SheetDescription>
              </SheetHeader>

              <div className="mt-4 flex rounded-xl border border-white/10 bg-white/[0.02] p-1">
                {(["en", "ar"] as const).map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setEmailLang(lang)}
                    className={cn(
                      "flex-1 rounded-lg py-2 text-xs font-medium transition-colors",
                      emailLang === lang
                        ? "bg-accent/15 text-accent"
                        : "text-text-mid hover:text-text-high"
                    )}
                  >
                    {lang === "en" ? "English" : "العربية"}
                  </button>
                ))}
              </div>

              <div
                className={cn(
                  "mt-4 flex-1 overflow-y-auto rounded-xl border border-white/[0.08] bg-white/[0.03] p-4 text-sm leading-relaxed text-text-high",
                  emailLang === "ar" && "text-right"
                )}
                dir={emailLang === "ar" ? "rtl" : "ltr"}
              >
                <pre className="whitespace-pre-wrap font-sans">{emailBody}</pre>
              </div>

              <div className="mt-4 flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 border-white/10"
                  onClick={handleCopy}
                >
                  {copied ? (
                    <>
                      <Check className="mr-2 h-4 w-4 text-accent" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy email
                    </>
                  )}
                </Button>
                <Button
                  className="flex-1 bg-accent text-primary hover:bg-accent-secondary"
                  onClick={handleMailClient}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Open mail client
                  <ExternalLink className="ml-1 h-3 w-3 opacity-60" />
                </Button>
              </div>

              {negotiateTarget.alternatives &&
                negotiateTarget.alternatives.length > 0 && (
                  <div className="mt-6 border-t border-white/[0.06] pt-6">
                    <p className="mb-3 text-xs font-medium uppercase tracking-wider text-text-mid">
                      Cheaper alternatives
                    </p>
                    <div className="space-y-2">
                      {negotiateTarget.alternatives.map((alt) => {
                        const saving =
                          negotiateTarget.amount - alt.price;
                        return (
                          <div
                            key={alt.name}
                            className="flex items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-3"
                          >
                            <div>
                              <p className="text-sm font-medium text-text-high">
                                {alt.name}
                              </p>
                              <p className="text-xs text-text-mid">
                                {formatAED(alt.price)}/mo
                              </p>
                            </div>
                            <span
                              className={cn(
                                "font-mono text-xs",
                                saving > 0 ? "text-accent" : "text-text-mid"
                              )}
                            >
                              {saving > 0
                                ? `Save ${formatAED(saving)}/mo`
                                : "Free tier"}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
