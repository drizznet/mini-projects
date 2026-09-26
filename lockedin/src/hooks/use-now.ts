"use client";

import { useEffect, useState } from "react";

/**
 * Ticking timestamp for live timers and time-sensitive analytics.
 *
 * Pass a coarse interval for dashboards (30s) and 1s only for the running
 * session clock — every tick re-renders the subtree that reads it.
 *
 * Only call this from components mounted after store hydration; the initial
 * value comes from the client clock and would not match a server render.
 *
 * @example
 * const now = useNow(1000);
 */
export function useNow(intervalMs = 1000): number {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (intervalMs <= 0) return;
    const id = window.setInterval(() => setNow(Date.now()), intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs]);

  return now;
}
