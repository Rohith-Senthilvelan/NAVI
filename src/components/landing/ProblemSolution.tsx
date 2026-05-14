"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { AlertTriangle, Tv, Plane } from "lucide-react";
import { SectionWrapper } from "@/components/landing/motion";
import { cn } from "@/lib/utils";

const cards = [
  {
    icon: AlertTriangle,
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    title: "You overspent on dining",
    body: "AED 340 over budget this week. Navi spotted 4 Talabat orders in 3 days.",
  },
  {
    icon: Tv,
    color: "text-accent",
    bg: "bg-accent/10",
    title: "Cancel unused Netflix?",
    body: "You haven't watched in 47 days. Save AED 39.99/mo — Navi can pause it for you.",
  },
  {
    icon: Plane,
    color: "text-gold",
    bg: "bg-gold/10",
    title: "Move AED 200 to Travel Goal",
    body: "You're 68% to Bali. One tap and Navi reallocates from your flexible spend.",
  },
];

function TypewriterCard({
  title,
  body,
  icon: Icon,
  color,
  bg,
  active,
}: (typeof cards)[0] & { active: boolean }) {
  const [text, setText] = useState("");
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView || !active) return;
    let i = 0;
    const full = title;
    setText("");
    const interval = setInterval(() => {
      if (i <= full.length) {
        setText(full.slice(0, i));
        i++;
      } else clearInterval(interval);
    }, 35);
    return () => clearInterval(interval);
  }, [inView, active, title]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={active ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0.3, scale: 0.98, y: 10 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-md",
        active && "border-accent/30 shadow-lg shadow-accent/5"
      )}
    >
      <div className={cn("mb-4 inline-flex rounded-xl p-2.5", bg)}>
        <Icon className={cn("h-5 w-5", color)} />
      </div>
      <h3 className="text-lg font-semibold text-text-high">
        {text}
        {active && text.length < title.length && (
          <span className="animate-blink text-accent">|</span>
        )}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-text-mid">{body}</p>
    </motion.div>
  );
}

export function ProblemSolution() {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, -rect.top / (rect.height - window.innerHeight)));
      const idx = Math.min(2, Math.floor(progress * 3));
      setActiveIndex(idx);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <SectionWrapper id="product" className="py-32">
      <div className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-2">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <p className="mb-4 text-sm font-medium uppercase tracking-widest text-accent">
            Problem → Solution
          </p>
          <h2 className="font-display text-4xl leading-tight text-text-high sm:text-5xl lg:text-6xl">
            Most apps just track.
            <br />
            <span className="text-text-mid">Yours should think.</span>
          </h2>
          <p className="mt-6 max-w-md text-text-mid">
            Navi doesn&apos;t wait for you to open a spreadsheet. It watches,
            suggests, and acts — like a CFO in your pocket.
          </p>
        </div>
        <div ref={containerRef} className="space-y-[40vh] py-12">
          {cards.map((card, i) => (
            <TypewriterCard key={card.title} {...card} active={activeIndex === i} />
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
