"use client";

import { Volume2, VolumeX } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "navi-sound";

function playSoftClick() {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = 720;
    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
    setTimeout(() => ctx.close(), 150);
  } catch {
    /* ignore */
  }
}

export function SoundToggle({ className }: { className?: string }) {
  const [enabled, setEnabled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setEnabled(localStorage.getItem(STORAGE_KEY) === "on");
  }, []);

  const toggle = useCallback(() => {
    setEnabled((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY, next ? "on" : "off");
      if (next) playSoftClick();
      return next;
    });
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest("button, a[href], [role='button']")) {
        playSoftClick();
      }
    };

    document.addEventListener("click", handler, true);
    return () => document.removeEventListener("click", handler, true);
  }, [enabled]);

  if (!mounted) return null;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={enabled ? "Disable sound effects" : "Enable sound effects"}
      className={cn(
        "fixed bottom-6 right-6 z-50 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-primary/90 text-text-mid shadow-lg backdrop-blur-xl transition-all hover:border-accent/40 hover:text-accent hover:shadow-[0_0_20px_-4px_rgba(110,86,255,0.5)]",
        className
      )}
    >
      {enabled ? (
        <Volume2 className="h-4 w-4" />
      ) : (
        <VolumeX className="h-4 w-4 opacity-60" />
      )}
    </button>
  );
}
