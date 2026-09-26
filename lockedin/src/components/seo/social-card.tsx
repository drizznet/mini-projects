import type { CSSProperties } from "react";

import { BRAND } from "@/lib/brand";

const styles = {
  frame: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: "72px 82px",
    background: "#faf9f5",
    color: "#211d22",
    fontFamily: "Arial, sans-serif",
  } satisfies CSSProperties,
  eyebrow: {
    display: "flex",
    alignItems: "center",
    gap: 18,
    color: "#410d4b",
    fontSize: 28,
    fontWeight: 700,
    letterSpacing: "0.18em",
  } satisfies CSSProperties,
  mark: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 58,
    height: 58,
    borderRadius: 16,
    background: "#410d4b",
    color: "#ffffff",
    fontSize: 34,
    fontWeight: 700,
  } satisfies CSSProperties,
  headline: {
    maxWidth: 900,
    margin: 0,
    color: "#410d4b",
    fontSize: 70,
    lineHeight: 1.08,
    letterSpacing: "-0.045em",
    fontWeight: 700,
  } satisfies CSSProperties,
  description: {
    maxWidth: 780,
    margin: "24px 0 0",
    color: "#665e68",
    fontSize: 28,
    lineHeight: 1.35,
  } satisfies CSSProperties,
  footer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    color: "#665e68",
    fontSize: 24,
  } satisfies CSSProperties,
} as const;

export function SocialCard() {
  return (
    <div style={styles.frame}>
      <div style={styles.eyebrow}>
        <div style={styles.mark}>i</div>
        <span>{BRAND.name}</span>
      </div>

      <div>
        <h1 style={styles.headline}>Protect your attention.</h1>
        <p style={styles.description}>{BRAND.description}</p>
      </div>

      <div style={styles.footer}>
        <span>{BRAND.tagline}</span>
        <span>focus OS</span>
      </div>
    </div>
  );
}
