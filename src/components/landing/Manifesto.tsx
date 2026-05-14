"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { SectionWrapper } from "@/components/landing/motion";

const words = [
  "We", "believe", "money", "should", "be",
  "clear,", "kind,", "and", "on", "your", "side.",
];

const highlights = new Set(["clear,", "kind,", "and", "on", "your", "side."]);

function ManifestoWord({
  word,
  index,
  total,
  progress,
}: {
  word: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const start = index / total;
  const end = (index + 1) / total;
  const opacity = useTransform(progress, [start * 0.6, end * 0.6 + 0.1], [0.15, 1]);

  return (
    <motion.span
      style={{ opacity }}
      className={`font-display text-4xl sm:text-6xl lg:text-7xl ${
        highlights.has(word) ? "text-accent" : "text-text-high"
      }`}
    >
      {word}
    </motion.span>
  );
}

export function Manifesto() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  return (
    <SectionWrapper id="manifesto" className="py-40">
      <div ref={ref} className="mx-auto max-w-6xl px-6">
        <p className="mb-12 text-center text-sm font-medium uppercase tracking-widest text-accent">
          Manifesto
        </p>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
          {words.map((word, i) => (
            <ManifestoWord
              key={`${word}-${i}`}
              word={word}
              index={i}
              total={words.length}
              progress={scrollYProgress}
            />
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
