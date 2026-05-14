"use client";

import { motion } from "framer-motion";
import { MagneticButton } from "@/components/shared/magnetic-button";
import { SectionWrapper, fadeUp, staggerContainer } from "@/components/landing/motion";

export function BigCta() {
  return (
    <SectionWrapper className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="relative overflow-hidden rounded-3xl border border-white/[0.06] bg-primary p-12 text-center sm:p-20"
        >
          <div
            className="absolute inset-0 bg-gradient-to-br from-[#6E56FF]/22 via-[#9B7BFF]/12 to-transparent"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.04] mix-blend-overlay"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            }}
            aria-hidden
          />
          <motion.h2 variants={fadeUp} className="type-h2 relative">
            Your money deserves a coach.
          </motion.h2>
          <motion.p variants={fadeUp} className="relative mx-auto mt-4 max-w-lg text-text-mid">
            Join thousands of UAE residents who&apos;ve stopped guessing and started growing.
          </motion.p>
          <motion.div variants={fadeUp} className="relative mt-8">
            <MagneticButton href="/login">
              <span className="btn-primary px-8 py-4 text-base">Open Navi free</span>
            </MagneticButton>
          </motion.div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
