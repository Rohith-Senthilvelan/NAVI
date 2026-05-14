"use client";

import {
  motion,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const INTERACTIVE =
  'a, button, [role="button"], input, textarea, select, label, [data-cursor-hover]';

export function CustomCursor() {
  const pathname = usePathname();
  const isLanding = pathname === "/";
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const springX = useSpring(mouseX, { stiffness: 500, damping: 40, mass: 0.4 });
  const springY = useSpring(mouseY, { stiffness: 500, damping: 40, mass: 0.4 });
  const size = useSpring(hovering ? 36 : 6, { stiffness: 400, damping: 30 });

  useEffect(() => {
    if (!isLanding) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    if (prefersReduced || isCoarse) return;

    setVisible(true);
    document.documentElement.classList.add("cursor-none");

    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      setHovering(!!target?.closest(INTERACTIVE));
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);

    return () => {
      document.documentElement.classList.remove("cursor-none");
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
    };
  }, [isLanding, mouseX, mouseY]);

  if (!isLanding || !visible) return null;

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[9999] mix-blend-difference"
      style={{
        x: springX,
        y: springY,
        width: size,
        height: size,
        translateX: "-50%",
        translateY: "-50%",
      }}
    >
      <div className="h-full w-full rounded-full border border-accent/60 bg-accent/30 backdrop-blur-sm" />
    </motion.div>
  );
}
