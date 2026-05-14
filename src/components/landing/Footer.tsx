"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";

const PRODUCT_LINKS = [
  { label: "Features", href: "#features" },
  { label: "AI Advisor", href: "#advisor" },
  { label: "Pricing", href: "#pricing" },
  { label: "How it works", href: "#how-it-works" },
];

const COMPANY_LINKS = [
  { label: "About", href: "/manifesto" },
  { label: "Manifesto", href: "/manifesto" },
  { label: "Careers", href: "#" },
  { label: "Contact", href: "#" },
];

const LEGAL_LINKS = [
  { label: "Privacy", href: "#" },
  { label: "Terms", href: "#" },
  { label: "Security", href: "#" },
];

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#05060F] py-16">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-text-low">
              Product
            </p>
            <ul className="space-y-2.5">
              {PRODUCT_LINKS.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-text-low transition-colors hover:text-text-mid">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-text-low">
              Company
            </p>
            <ul className="space-y-2.5">
              {COMPANY_LINKS.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-text-low transition-colors hover:text-text-mid">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-text-low">
              Legal
            </p>
            <ul className="space-y-2.5">
              {LEGAL_LINKS.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-text-low transition-colors hover:text-text-mid">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-text-low">
              Stay updated
            </p>
            <p className="mb-3 text-sm text-text-low">
              Product updates and money tips, monthly.
            </p>
            <form
              className="flex gap-2"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="you@email.com"
                className="h-10 flex-1 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 text-sm text-text-high placeholder:text-text-low focus:border-accent/40 focus:outline-none"
              />
              <button type="submit" className="btn-primary shrink-0 px-4 py-2 text-xs">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-6 border-t border-white/[0.06] pt-8 sm:flex-row">
          <div className="flex items-center gap-2 text-text-low">
            <Sparkles className="h-4 w-4 text-accent" />
            <span className="text-sm font-semibold text-text-mid">Navi</span>
          </div>
          <p className="text-xs text-text-low">© 2026 Navi. Built in the UAE.</p>
          <div className="flex items-center gap-4">
            <a href="#" aria-label="X" className="text-text-low transition-colors hover:text-text-mid">
              <XIcon className="h-4 w-4" />
            </a>
            <a href="#" aria-label="Instagram" className="text-text-low transition-colors hover:text-text-mid">
              <InstagramIcon className="h-4 w-4" />
            </a>
            <a href="#" aria-label="LinkedIn" className="text-text-low transition-colors hover:text-text-mid">
              <LinkedInIcon className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
