"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { SectionWrapper, fadeUp, staggerContainer } from "@/components/landing/motion";

const TESTIMONIALS = [
  {
    initials: "LM",
    color: "bg-accent",
    name: "Layla M.",
    role: "26, designer in Dubai",
    quote:
      "Navi caught three subscriptions I forgot about. I'm saving AED 180 a month without changing how I live.",
  },
  {
    initials: "KA",
    color: "bg-cyan",
    name: "Karim A.",
    role: "Founder, SaaS startup",
    quote:
      "Business Advisor mode flagged runway risk before I did. It's like having a CFO who actually texts back.",
  },
  {
    initials: "AR",
    color: "bg-pink",
    name: "Aisha R.",
    role: "University student, Sharjah",
    quote:
      "I asked if I could afford a trip home for Eid. Navi showed me exactly what to move — and I made it happen.",
  },
];

function TiltCard({
  children,
}: {
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), { stiffness: 200, damping: 20 });

  function onMove(e: React.MouseEvent) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function onLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      className="card-glass h-full p-7"
    >
      {children}
    </motion.div>
  );
}

export function Testimonials() {
  return (
    <SectionWrapper className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mb-12 text-center"
        >
          <p className="type-eyebrow mb-3">Testimonials</p>
          <h2 className="type-h2">Trusted across the UAE</h2>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid gap-6 md:grid-cols-3"
        >
          {TESTIMONIALS.map((t) => (
            <motion.div key={t.name} variants={fadeUp}>
              <TiltCard>
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white ${t.color}`}
                  >
                    {t.initials}
                  </span>
                  <div>
                    <p className="font-semibold text-text-high">{t.name}</p>
                    <p className="text-xs text-text-low">{t.role}</p>
                  </div>
                </div>
                <p className="mt-5 text-sm leading-relaxed text-text-mid">&ldquo;{t.quote}&rdquo;</p>
              </TiltCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
