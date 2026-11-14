import type { FocusBackdrop as FocusBackdropVariant } from "@/lib/types";
import { cn } from "@/lib/utils";

/** Visual field behind a live session. Driven by the appearance setting. */
export function FocusBackdrop({
  variant,
  paused = false,
  className,
}: {
  variant: FocusBackdropVariant;
  paused?: boolean;
  className?: string;
}) {
  if (variant === "solid") {
    return <div className={cn("focus-field focus-field--solid absolute inset-0", className)} aria-hidden />;
  }

  if (variant === "pattern") {
    return (
      <div
        className={cn(
          "focus-field focus-field--pattern absolute inset-0",
          paused && "is-paused",
          className,
        )}
        aria-hidden
      />
    );
  }

  return (
    <div
      className={cn(
        "focus-field focus-field--gradient absolute inset-0",
        paused && "is-paused",
        className,
      )}
      aria-hidden
    >
      <span className="focus-field__orb focus-field__orb--a" />
      <span className="focus-field__orb focus-field__orb--b" />
      <span className="focus-field__orb focus-field__orb--c" />
      <span className="focus-field__orb focus-field__orb--d" />
    </div>
  );
}
