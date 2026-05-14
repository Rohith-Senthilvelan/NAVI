"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import { cn } from "@/lib/utils";

const RADIUS = 40;
const MAX_PULL = 6;

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
}

export function MagneticButton({
  children,
  className,
  href,
  onClick,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 18 });
  const springY = useSpring(y, { stiffness: 200, damping: 18 });

  function handleMouseMove(e: React.MouseEvent) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;
    const dist = Math.hypot(dx, dy);

    if (dist > RADIUS || dist === 0) {
      x.set(0);
      y.set(0);
      return;
    }

    const pull = (1 - dist / RADIUS) * MAX_PULL;
    x.set((dx / dist) * pull);
    y.set((dy / dist) * pull);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  const inner = (
    <motion.div
      style={{ x: springX, y: springY }}
      className={cn("inline-flex", className)}
    >
      {children}
    </motion.div>
  );

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="inline-flex"
    >
      {href ? (
        <Link href={href} onClick={onClick} data-cursor-hover>
          {inner}
        </Link>
      ) : (
        <button type="button" onClick={onClick} className="inline-flex" data-cursor-hover>
          {inner}
        </button>
      )}
    </div>
  );
}
