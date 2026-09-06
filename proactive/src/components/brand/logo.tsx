import Link from "next/link";

import { BRAND } from "@/lib/brand";
import { cn } from "@/lib/utils";

/** Geometric lock with a focus-point keyhole — lock in on one thing. */
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden
      className={cn("size-8", className)}
    >
      <rect width="32" height="32" rx="8" className="fill-primary" />
      <path
        d="M11.4 14.6V12.1C11.4 9.45 13.45 7.55 16 7.55c2.55 0 4.6 1.9 4.6 4.55v2.5"
        className="stroke-primary-foreground"
        strokeWidth="2.35"
        strokeLinecap="round"
      />
      <rect
        x="9.35"
        y="14.35"
        width="13.3"
        height="11.4"
        rx="3.1"
        className="fill-primary-foreground"
      />
      <circle cx="16" cy="19.1" r="1.7" className="fill-primary" />
      <rect
        x="15.25"
        y="20.35"
        width="1.5"
        height="2.35"
        rx="0.75"
        className="fill-primary"
      />
    </svg>
  );
}

export function BrandLockup({
  href = "/dashboard",
  subtitle,
  showSubtitle = true,
  className,
}: {
  href?: string;
  subtitle?: string;
  showSubtitle?: boolean;
  className?: string;
}) {
  return (
    <Link href={href} className={cn("flex items-center gap-2.5", className)}>
      <BrandMark />
      <div className="leading-tight">
        <p className="text-sm font-semibold tracking-tight">{BRAND.name}</p>
        {showSubtitle ? (
          <p className="text-[11px] text-muted-foreground">
            {subtitle ?? BRAND.byline}
          </p>
        ) : null}
      </div>
    </Link>
  );
}
