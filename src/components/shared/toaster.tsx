"use client";

import { useToastStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Info, X } from "lucide-react";

export function Toaster() {
  const { toasts, dismissToast } = useToastStore();

  return (
    <motion.div
      className="pointer-events-none fixed bottom-6 right-6 z-[100] flex w-full max-w-sm flex-col gap-2 sm:bottom-8 sm:right-8"
      aria-live="polite"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 24, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "pointer-events-auto flex items-start gap-3 rounded-xl border border-white/10 bg-surface/95 p-4 shadow-2xl backdrop-blur-xl",
              toast.variant === "success" && "border-accent/20",
              toast.variant === "error" && "border-red-500/30"
            )}
          >
            {toast.variant === "success" ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
            ) : (
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-text-mid" />
            )}
            <p className="flex-1 text-sm text-text-high">{toast.message}</p>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              className="shrink-0 rounded-md p-0.5 text-text-mid transition-colors hover:text-text-high"
              aria-label="Dismiss"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
