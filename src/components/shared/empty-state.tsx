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
  title?: string;
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
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-10 text-center",
        className
      )}
    >
      <div className="relative mb-4 flex h-14 w-14 items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-accent/[0.12]" />
        <Icon className="relative h-6 w-6 text-accent" strokeWidth={1.5} />
      </div>
      {title && (
        <p className="text-sm font-medium text-text-high">{title}</p>
      )}
      <p className={cn("max-w-xs text-sm text-text-mid", title && "mt-1")}>
        {description}
      </p>
      {actionLabel && onAction && (
        <Button
          type="button"
          onClick={onAction}
          className="mt-4 rounded-full bg-gradient-button px-5 text-primary hover:opacity-90"
        >
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
}
