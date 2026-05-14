"use client";

import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";
import { CustomCursor } from "@/components/shared/custom-cursor";
import { SmoothScroll } from "@/components/shared/smooth-scroll";
import { SoundToggle } from "@/components/shared/sound-toggle";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <SmoothScroll>
        <CustomCursor />
        <SoundToggle />
        {children}
      </SmoothScroll>
    </ThemeProvider>
  );
}
