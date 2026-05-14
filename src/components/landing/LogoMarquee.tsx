"use client";

const PILLS = [
  "Smart Budgeting",
  "Round-Up Savings",
  "AI Bill Negotiator",
  "Spending Insights",
  "Investment Coach",
  "Business Advisor",
  "Grow Plans",
  "Circles",
];

function Pill({ label }: { label: string }) {
  return (
    <span className="mx-3 inline-flex shrink-0 items-center gap-2.5 rounded-full border border-white/[0.06] bg-white/[0.02] px-5 py-2.5 text-sm font-medium tracking-wide text-white/40">
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
      {label}
    </span>
  );
}

export function LogoMarquee() {
  const items = [...PILLS, ...PILLS];

  return (
    <section
      aria-label="Features"
      className="group relative h-16 overflow-hidden border-y border-white/[0.06] bg-[#05060F]/80"
    >
      <div className="flex h-full items-center">
        <div className="gpu-layer flex min-w-full shrink-0 animate-marquee items-center group-hover:[animation-play-state:paused]">
          {items.map((label, i) => (
            <Pill key={`${label}-${i}`} label={label} />
          ))}
        </div>
        <div
          aria-hidden
          className="gpu-layer flex min-w-full shrink-0 animate-marquee items-center group-hover:[animation-play-state:paused]"
        >
          {items.map((label, i) => (
            <Pill key={`dup-${label}-${i}`} label={label} />
          ))}
        </div>
      </div>
    </section>
  );
}
