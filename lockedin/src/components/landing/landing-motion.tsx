"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function LandingMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches || !root.current) return;
    const styles = getComputedStyle(root.current);
    const duration = parseFloat(styles.getPropertyValue("--motion-reveal")) || 650;
    const easing = styles.getPropertyValue("--ease-out").trim() || "ease-out";
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        if (!reducedMotion.matches) {
          entry.target.animate([{ opacity: 0, transform: "translateY(24px)" }, { opacity: 1, transform: "translateY(0)" }], { duration, easing });
        }
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08 });
    root.current.querySelectorAll("main > section > div").forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);
  return <div ref={root} className="landing-shell">{children}</div>;
}
