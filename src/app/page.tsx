"use client";

import dynamic from "next/dynamic";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Marquee } from "@/components/landing/Marquee";
import { SmoothScroll } from "@/components/shared/smooth-scroll";

const ProblemSolution = dynamic(
  () => import("@/components/landing/ProblemSolution").then((m) => m.ProblemSolution),
  { ssr: false }
);
const BentoGrid = dynamic(
  () => import("@/components/landing/BentoGrid").then((m) => m.BentoGrid),
  { ssr: false }
);
const AdvisorShowcase = dynamic(
  () => import("@/components/landing/AdvisorShowcase").then((m) => m.AdvisorShowcase),
  { ssr: false }
);
const HowItWorks = dynamic(
  () => import("@/components/landing/HowItWorks").then((m) => m.HowItWorks),
  { ssr: false }
);
const Pricing = dynamic(
  () => import("@/components/landing/Pricing").then((m) => m.Pricing),
  { ssr: false }
);
const Manifesto = dynamic(
  () => import("@/components/landing/Manifesto").then((m) => m.Manifesto),
  { ssr: false }
);
const Faq = dynamic(
  () => import("@/components/landing/Faq").then((m) => m.Faq),
  { ssr: false }
);
const CtaBlock = dynamic(
  () => import("@/components/landing/CtaBlock").then((m) => m.CtaBlock),
  { ssr: false }
);

export default function HomePage() {
  return (
    <SmoothScroll>
      <Navbar />
      <main className="overflow-x-hidden">
        <Hero />
        <Marquee />
        <ProblemSolution />
        <BentoGrid />
        <AdvisorShowcase />
        <HowItWorks />
        <Pricing />
        <Manifesto />
        <Faq />
        <CtaBlock />
      </main>
    </SmoothScroll>
  );
}
