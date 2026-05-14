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
  { label: "Manifesto", href: "/manifesto" },
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
          "pointer-events-auto flex h-14 w-[min(92%,900px)] items-center justify-between rounded-full border border-white/[0.06] bg-[#0B0D1F]/80 px-2.5 shadow-2xl backdrop-blur-2xl transition-[width,background-color,border-color] duration-300 ease-out",
          scrolled && "w-[min(78%,720px)] border-white/[0.1] bg-[#0B0D1F]/90"
        )}
        aria-label="Main navigation"
      >
        <Link href="/" className="group flex items-center gap-2 pl-2">
          <Sparkles className="h-4 w-4 text-accent transition-transform group-hover:rotate-12" />
          <span className="text-lg font-bold tracking-tight text-white">
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

        <div className="flex items-center gap-2 pr-1">
          <Link
            href="/login"
            className="hidden rounded-full px-4 py-2 text-sm text-text-mid transition-colors hover:bg-white/5 hover:text-text-high sm:inline-flex"
          >
            Sign in
          </Link>
          <MagneticButton href="/login">
            <span className="btn-primary px-5 py-2.5 text-sm">Open Navi</span>
          </MagneticButton>
        </div>
      </nav>
    </div>
  );
}
