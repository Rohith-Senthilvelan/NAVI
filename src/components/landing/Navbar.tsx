"use client";

import { Sparkles } from "lucide-react";
import Link from "next/link";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { useState } from "react";
import { MagneticButton } from "@/components/shared/magnetic-button";
import { cn } from "@/lib/utils";

const links = [
  { label: "Product", href: "#product" },
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Manifesto", href: "#manifesto" },
];

export function Navbar() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const width = useTransform(scrollY, [0, 80], ["92%", "78%"]);
  const padding = useTransform(scrollY, [0, 80], [16, 10]);

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 40));

  return (
    <div className="pointer-events-none fixed inset-x-0 top-6 z-50 flex justify-center px-4">
      <motion.nav
        style={{ width, paddingTop: padding, paddingBottom: padding }}
        className={cn(
          "pointer-events-auto flex items-center justify-between rounded-full border border-white/10 bg-white/[0.04] px-5 shadow-2xl backdrop-blur-[24px] transition-colors duration-300",
          scrolled && "border-white/20 bg-white/[0.06] shadow-accent/5"
        )}
      >
        <Link href="/" className="group flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-accent transition-transform group-hover:rotate-12" />
          <span className="bg-gradient-to-r from-accent via-accent-secondary to-white bg-clip-text text-lg font-semibold tracking-tight text-transparent">
            Navi
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-text-mid transition-colors hover:text-text-high"
            >
              {link.label}
            </a>
          ))}
        </div>

        <motion.div className="flex items-center gap-2">
          <Link
            href="/login"
            className="hidden rounded-full px-4 py-2 text-sm text-text-mid transition-colors hover:bg-white/5 hover:text-text-high sm:inline-flex"
          >
            Sign in
          </Link>
          <MagneticButton href="/login">
            <span className="inline-flex items-center rounded-full bg-gradient-to-r from-accent to-white px-5 py-2.5 text-sm font-semibold text-primary shadow-lg shadow-accent/20 transition-shadow hover:shadow-accent/40">
              Open Navi
            </span>
          </MagneticButton>
        </motion.div>
      </motion.nav>
    </div>
  );
}
