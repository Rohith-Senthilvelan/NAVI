"use client";

import { setAuthCookie } from "@/lib/auth";
import { activatePitchMode } from "@/components/shared/pitch-orchestrator";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DemoPitchPage() {
  const router = useRouter();

  useEffect(() => {
    setAuthCookie();
    activatePitchMode();
    const t = window.setTimeout(() => router.replace("/dashboard"), 900);
    return () => window.clearTimeout(t);
  }, [router]);

  return (
    <motion.div
      className="flex min-h-screen flex-col items-center justify-center bg-primary px-6 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 ring-1 ring-accent/30"
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Sparkles className="h-8 w-8 text-accent" aria-hidden />
      </motion.div>
      <h1 className="text-3xl font-bold tracking-tight text-text-high">
        Navi pitch demo
      </h1>
      <p className="mt-3 max-w-md text-sm text-text-mid">
        Auto-playing a 90-second guided tour. Press{" "}
        <kbd className="rounded border border-white/15 bg-white/5 px-1.5 py-0.5 font-mono text-xs text-accent">
          SPACE
        </kbd>{" "}
        to pause anytime.
      </p>
      <p className="mt-6 text-xs text-text-mid/70">Launching dashboard…</p>
    </motion.div>
  );
}
