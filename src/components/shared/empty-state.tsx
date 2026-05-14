"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-14 text-center",
        className
      )}
    >
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-accent/10 to-transparent"
      >
        <Icon className="h-7 w-7 text-accent/80" strokeWidth={1.5} />
      </motion.div>
      <p className="text-sm font-medium text-text-high">{title}</p>
      <p className="mt-1 max-w-xs text-sm text-text-mid">{description}</p>
      {actionLabel && onAction && (
        <Button
          type="button"
          onClick={onAction}
          className="mt-5 rounded-full bg-accent text-primary hover:bg-accent/90"
        >
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
}
