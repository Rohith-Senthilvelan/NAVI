"use client";

import dynamic from "next/dynamic";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { LogoMarquee } from "@/components/landing/LogoMarquee";

const BigStatStrip = dynamic(
  () => import("@/components/landing/BigStatStrip").then((m) => m.BigStatStrip),
  { ssr: false }
);
const ProductShowcase = dynamic(
  () => import("@/components/landing/ProductShowcase").then((m) => m.ProductShowcase),
  { ssr: false }
);
const BentoFeatures = dynamic(
  () => import("@/components/landing/BentoFeatures").then((m) => m.BentoFeatures),
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
const Testimonials = dynamic(
  () => import("@/components/landing/Testimonials").then((m) => m.Testimonials),
  { ssr: false }
);
const Pricing = dynamic(
  () => import("@/components/landing/Pricing").then((m) => m.Pricing),
  { ssr: false }
);
const Faq = dynamic(
  () => import("@/components/landing/Faq").then((m) => m.Faq),
  { ssr: false }
);
const BigCta = dynamic(
  () => import("@/components/landing/BigCta").then((m) => m.BigCta),
  { ssr: false }
);
const Footer = dynamic(
  () => import("@/components/landing/Footer").then((m) => m.Footer),
  { ssr: false }
);

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="overflow-x-hidden">
        <Hero />
        <LogoMarquee />
        <BigStatStrip />
        <ProductShowcase />
        <BentoFeatures />
        <AdvisorShowcase />
        <HowItWorks />
        <Testimonials />
        <Pricing />
        <Faq />
        <BigCta />
        <Footer />
      </main>
    </>
  );
}
