import Link from "next/link";
import Image from "next/image";

import { cn } from "@/lib/utils";

/** Geometric lock with a focus-point keyhole — lock in on one thing. */
export function BrandMark({
  className,
  tone = "ink",
}: {
  className?: string;
  tone?: "ink" | "paper";
}) {
  const shell = tone === "paper" ? "fill-white" : "fill-foreground";
  const face = tone === "paper" ? "fill-black stroke-black" : "fill-background stroke-background";
  const hole = tone === "paper" ? "fill-white" : "fill-foreground";

  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden
      className={cn("size-8", className)}
    >
      <rect width="32" height="32" rx="8" className={shell} />
      <path
        d="M11.4 14.6V12.1C11.4 9.45 13.45 7.55 16 7.55c2.55 0 4.6 1.9 4.6 4.55v2.5"
        className={face}
        strokeWidth="2.35"
        strokeLinecap="round"
      />
      <rect
        x="9.35"
        y="14.35"
        width="13.3"
        height="11.4"
        rx="3.1"
        className={face}
      />
      <circle cx="16" cy="19.1" r="1.7" className={hole} />
      <rect
        x="15.25"
        y="20.35"
        width="1.5"
        height="2.35"
        rx="0.75"
        className={hole}
      />
    </svg>
  );
}

export function BrandLockup({
  href = "/dashboard",
  className,
  tone = "ink",
}: {
  href?: string;
  subtitle?: string;
  showSubtitle?: boolean;
  className?: string;
  tone?: "ink" | "paper";
}) {
  return (
    <Link href={href} className={cn("flex items-center gap-2.5", className)}>
      <Image
        src="/assets/brand/lockin-logo-v1.png"
        alt="lockIn"
        width={132}
        height={53}
        priority
        className={cn(
          "h-auto w-[132px] object-contain brightness-0",
          tone === "paper" && "invert",
        )}
      />
    </Link>
  );
}
