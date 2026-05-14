"use client";

import { useEffect, useState } from "react";

export function usePageReady(delayMs = 450) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), delayMs);
    return () => clearTimeout(t);
  }, [delayMs]);

  return ready;
}
