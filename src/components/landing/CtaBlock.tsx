"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MagneticButton } from "@/components/shared/magnetic-button";
import { SectionWrapper, fadeUp, staggerContainer } from "@/components/landing/motion";

const footerLinks = [
  { label: "Product", href: "#product" },
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Manifesto", href: "/manifesto" },
  { label: "Privacy", href: "#" },
  { label: "Terms", href: "#" },
];

export function CtaBlock() {
  return (
    <SectionWrapper className="pb-12 pt-8">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="card-glass-hero relative overflow-hidden bg-gradient-hero p-12 text-center sm:p-20"
        >
          <motion.div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(110,86,255,0.2),transparent_60%)]" />
          <motion.h2 variants={fadeUp} className="type-h2 relative">
            Your money deserves a coach.
          </motion.h2>
          <motion.p variants={fadeUp} className="relative mx-auto mt-4 max-w-lg text-text-mid">
            Join thousands of UAE residents who&apos;ve stopped guessing and started growing.
          </motion.p>
          <motion.div variants={fadeUp} className="relative mt-8">
            <MagneticButton href="/login">
              <span className="btn-primary px-8 py-4 text-base">Open Navi</span>
            </MagneticButton>
          </motion.div>
        </motion.div>

        <footer className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-white/[0.06] pt-8 sm:flex-row">
          <p className="text-lg font-bold text-white">
            Navi
          </p>
          <nav className="flex flex-wrap justify-center gap-6">
            {footerLinks.map((link) => (
              <Link key={link.label} href={link.href} className="text-sm text-text-mid transition-colors hover:text-text-high">
                {link.label}
              </Link>
            ))}
          </nav>
          <p className="text-xs text-text-mid">© 2026 Navi. Built in the UAE.</p>
        </footer>
      </div>
    </SectionWrapper>
  );
}
