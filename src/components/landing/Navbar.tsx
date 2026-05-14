"use client";

import { Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MagneticButton } from "@/components/shared/magnetic-button";
import { cn } from "@/lib/utils";

const links = [
  { label: "Product", href: "#product" },
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Manifesto", href: "#manifesto" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-6 z-50 flex justify-center px-4">
      <nav
        className={cn(
          "pointer-events-auto flex w-[min(92%,900px)] items-center justify-between rounded-full border border-white/10 bg-primary/80 px-5 shadow-2xl transition-[width,padding,background-color,border-color] duration-300 ease-out",
          scrolled &&
            "w-[min(78%,720px)] border-white/20 bg-primary/90 shadow-accent/5"
        )}
        style={{ paddingTop: scrolled ? 10 : 16, paddingBottom: scrolled ? 10 : 16 }}
        aria-label="Main navigation"
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

        <div className="flex items-center gap-2">
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
        </div>
      </nav>
    </div>
  );
}
