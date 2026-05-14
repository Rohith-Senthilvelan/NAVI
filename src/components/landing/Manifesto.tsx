"use client";

import { SectionWrapper } from "@/components/landing/motion";

const highlights = new Set(["clear,", "kind,", "and", "on", "your", "side."]);

export function Manifesto() {
  const words = [
    "We", "believe", "money", "should", "be",
    "clear,", "kind,", "and", "on", "your", "side.",
  ];

  return (
    <SectionWrapper id="manifesto" className="py-40">
      <div className="mx-auto max-w-6xl px-6">
        <p className="type-eyebrow mb-12 text-center">Manifesto</p>
        <h2 className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-center">
          {words.map((word, i) => (
            <span
              key={`${word}-${i}`}
              className={`text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl ${
                highlights.has(word)
                  ? "bg-gradient-to-r from-[#6E56FF] to-[#9B7BFF] bg-clip-text text-transparent"
                  : "text-text-high"
              }`}
            >
              {word}
            </span>
          ))}
        </h2>
      </div>
    </SectionWrapper>
  );
}
