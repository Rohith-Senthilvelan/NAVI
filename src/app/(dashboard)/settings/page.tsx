"use client";

import { PageLoadingSkeleton } from "@/components/shared/card-skeleton";
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
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { usePageReady } from "@/hooks/use-page-ready";
import { resetDemoData } from "@/lib/demo-reset";
import { useToastStore, useUserStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { AlertTriangle, Building2, RefreshCw, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

function SettingsSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-xl">
      <h2 className="text-sm font-semibold text-text-high">{title}</h2>
      {description && (
        <p className="mt-1 text-sm text-text-mid">{description}</p>
      )}
      <div className="mt-5 space-y-4">{children}</div>
    </section>
  );
}

function NotificationRow({
  label,
  description,
  checked,
  onCheckedChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
      <div>
        <p className="text-sm font-medium text-text-high">{label}</p>
        <p className="text-xs text-text-mid">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}

const PLANS = [
  {
    id: "free" as const,
    name: "Free",
    price: "AED 0",
    blurb: "Core budgeting & savings",
  },
  {
    id: "plus" as const,
    name: "Plus",
    price: "AED 29/mo",
    blurb: "Advisor, insights & circles",
  },
  {
    id: "business" as const,
    name: "Business",
    price: "AED 99/mo",
    blurb: "SME coach & team seats",
  },
];

export default function SettingsPage() {
  const ready = usePageReady();
  const { toast } = useToastStore();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const {
    name,
    email,
    phone,
    currency,
    language,
    notifications,
    billingPlan,
    setUser,
    setPhone,
    setCurrency,
    setLanguage,
    setNotification,
    setBillingPlan,
  } = useUserStore();

  const [localName, setLocalName] = useState(name);
  const [localEmail, setLocalEmail] = useState(email);
  const [localPhone, setLocalPhone] = useState(phone);

  useEffect(() => setMounted(true), []);

  const saveProfile = () => {
    setUser(localName, localEmail);
    setPhone(localPhone);
    toast("Profile updated", "success");
  };

  if (!ready) {
    return <PageLoadingSkeleton />;
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8 pb-8">
      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-accent/80">
          Account
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-text-high">
          Settings
        </h1>
        <p className="mt-1 text-sm text-text-mid">
          Profile, preferences, and billing.
        </p>
      </div>

      <SettingsSection title="Profile" description="How Navi addresses you.">
        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <Input
            id="name"
            value={localName}
            onChange={(e) => setLocalName(e.target.value)}
            className="border-white/10 bg-white/[0.04]"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={localEmail}
            onChange={(e) => setLocalEmail(e.target.value)}
            className="border-white/10 bg-white/[0.04]"
          />
        </div>
        <motion.div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={localPhone}
            onChange={(e) => setLocalPhone(e.target.value)}
            className="border-white/10 bg-white/[0.04]"
          />
        </motion.div>
        <Button
          type="button"
          onClick={saveProfile}
          className="rounded-full bg-accent text-primary hover:bg-accent/90"
        >
          Save profile
        </Button>
      </SettingsSection>

      <SettingsSection title="Preferences">
        <div className="space-y-2">
          <Label htmlFor="currency">Currency</Label>
          <select
            id="currency"
            value={currency}
            onChange={(e) => {
              setCurrency(e.target.value);
              toast(`Currency set to ${e.target.value}`, "success");
            }}
            className="flex h-10 w-full rounded-md border border-white/10 bg-white/[0.04] px-3 text-sm text-text-high"
          >
            <option value="AED">AED — UAE Dirham</option>
            <option value="USD">USD — US Dollar</option>
            <option value="SAR">SAR — Saudi Riyal</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label>Language</Label>
          <motion.div className="flex gap-2">
            {(["en", "ar"] as const).map((lang) => (
              <button
                key={lang}
                type="button"
                aria-label={`Set language to ${lang === "en" ? "English" : "Arabic"}`}
                aria-pressed={language === lang}
                onClick={() => {
                  setLanguage(lang);
                  toast(`Language: ${lang === "en" ? "English" : "العربية"}`, "success");
                }}
                className={cn(
                  "flex-1 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors",
                  language === lang
                    ? "border-accent/40 bg-accent/10 text-accent"
                    : "border-white/10 text-text-mid hover:bg-white/[0.04]"
                )}
              >
                {lang === "en" ? "English" : "العربية"}
              </button>
            ))}
          </motion.div>
        </div>
        <div className="space-y-2">
          <Label>Theme</Label>
          <div className="flex gap-2">
            {(["dark", "light"] as const).map((t) => (
              <button
                key={t}
                type="button"
                aria-label={`Set theme to ${t}`}
                aria-pressed={mounted && theme === t}
                disabled={!mounted}
                onClick={() => {
                  setTheme(t);
                  toast(`Theme: ${t}`, "success");
                }}
                className={cn(
                  "flex-1 rounded-xl border px-4 py-2.5 text-sm font-medium capitalize transition-colors",
                  mounted && theme === t
                    ? "border-accent/40 bg-accent/10 text-accent"
                    : "border-white/10 text-text-mid hover:bg-white/[0.04]"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </SettingsSection>

      <SettingsSection title="Notifications">
        <NotificationRow
          label="Budget alerts"
          description="When a category crosses 80% of cap"
          checked={notifications.budgetAlerts}
          onCheckedChange={(v) => setNotification("budgetAlerts", v)}
        />
        <NotificationRow
          label="Savings milestones"
          description="Goal progress and streak rewards"
          checked={notifications.savingsMilestones}
          onCheckedChange={(v) => setNotification("savingsMilestones", v)}
        />
        <NotificationRow
          label="Subscription reminders"
          description="Unused subs and renewal dates"
          checked={notifications.subscriptionReminders}
          onCheckedChange={(v) => setNotification("subscriptionReminders", v)}
        />
        <NotificationRow
          label="Weekly digest"
          description="Sunday summary from Navi"
          checked={notifications.weeklyDigest}
          onCheckedChange={(v) => setNotification("weeklyDigest", v)}
        />
        <NotificationRow
          label="Product updates"
          description="New features and tips"
          checked={notifications.marketing}
          onCheckedChange={(v) => setNotification("marketing", v)}
        />
      </SettingsSection>

      <SettingsSection title="Billing" description="Mock plan selection.">
        <div className="grid gap-3 sm:grid-cols-3">
          {PLANS.map((plan) => (
            <button
              key={plan.id}
              type="button"
              aria-label={`Switch to ${plan.name} plan`}
              aria-pressed={billingPlan === plan.id}
              onClick={() => {
                setBillingPlan(plan.id);
                toast(`Switched to ${plan.name}`, "success");
              }}
              className={cn(
                "rounded-xl border p-4 text-left transition-all",
                billingPlan === plan.id
                  ? "border-accent/40 bg-accent/10 ring-1 ring-accent/20"
                  : "border-white/10 bg-white/[0.02] hover:border-white/20"
              )}
            >
              <div className="flex items-center gap-2">
                {plan.id === "business" ? (
                  <Building2 className="h-4 w-4 text-gold" />
                ) : (
                  <Sparkles className="h-4 w-4 text-accent" />
                )}
                <span className="font-semibold text-text-high">{plan.name}</span>
              </div>
              <p className="mt-1 font-mono text-sm text-accent">{plan.price}</p>
              <p className="mt-2 text-xs text-text-mid">{plan.blurb}</p>
            </button>
          ))}
        </div>
      </SettingsSection>

      <SettingsSection
        title="Demo mode"
        description="Restore factory mock data for live pitches and walkthroughs."
      >
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            resetDemoData({ skipTour: true });
            toast("Demo data reset — fresh mock state loaded", "success");
          }}
          className="gap-2 border-accent/30 text-accent hover:bg-accent/10"
          aria-label="Reset demo data to factory defaults"
        >
          <RefreshCw className="h-4 w-4" aria-hidden />
          Reset demo data
        </Button>
      </SettingsSection>

      <section className="rounded-2xl border border-red-500/20 bg-red-500/[0.04] p-6">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-red-400">
          <AlertTriangle className="h-4 w-4" />
          Danger zone
        </h2>
        <p className="mt-2 text-sm text-text-mid">
          Permanently delete your Navi account and all associated data. This cannot
          be undone.
        </p>
        <Separator className="my-4 bg-red-500/10" />
        <Button
          type="button"
          variant="outline"
          onClick={() => setDeleteOpen(true)}
          className="border-red-500/30 text-red-400 hover:bg-red-500/10"
        >
          Delete account
        </Button>
      </section>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="border-red-500/20 bg-surface/95">
          <DialogHeader>
            <DialogTitle>Delete account?</DialogTitle>
            <DialogDescription>
              This is a demo — no data will actually be removed. In production,
              you&apos;d confirm via email.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => {
                setDeleteOpen(false);
                toast("Account deletion requested (mock)", "error");
              }}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              Yes, delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
