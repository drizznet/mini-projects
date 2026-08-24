import Link from "next/link";

import { BRAND } from "@/lib/brand";
import { cn } from "@/lib/utils";

/** Forward-double-chevron mark — "ahead" in a rounded brand tile. */
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
        d="M9.5 8.5 17.5 16 9.5 23.5"
        className="stroke-primary-foreground"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.5 8.5 24.5 16 16.5 23.5"
        className="stroke-primary-foreground"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.55"
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
            {subtitle ?? BRAND.tagline}
          </p>
        ) : null}
      </div>
    </Link>
  );
}
