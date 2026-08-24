"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, PauseCircle, Radio } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useNow } from "@/hooks/use-now";
import { sessionActiveMs } from "@/lib/analytics";
import { lineageFor, buildIndex } from "@/lib/selectors";
import { useFocusStore } from "@/lib/store/focus-store";
import { formatClock } from "@/lib/utils";

/**
 * Persistent reminder that a session is in flight.
 *
 * Rendered by the app shell on every route except the session screen itself, so
 * a running timer can never be lost by navigating away.
 */
export function ActiveSessionBar() {
  const pathname = usePathname();
  const { state } = useFocusStore();
  const now = useNow(1000);

  const session = state.sessions.find(
    (entry) => entry.id === state.activeSessionId,
  );
  if (!session || pathname.startsWith("/focus/session")) return null;

  const lineage = lineageFor(buildIndex(state), session.focusItemId);
  const paused = session.status === "paused";
  const elapsed = sessionActiveMs(session, now);

  return (
    <div className="shrink-0 border-b border-border bg-primary/8 px-4 py-2 lg:px-6">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium">
          {paused ? (
            <PauseCircle className="size-3.5 text-health-slipping" />
          ) : (
            <Radio className="size-3.5 animate-pulse text-primary" />
          )}
          {paused ? "Session paused" : "Session running"}
        </span>
        <span className="tabular text-sm font-semibold">
          {formatClock(elapsed)}
        </span>
        <span className="truncate text-xs text-muted-foreground">
          {lineage?.item.name ?? "Focus session"}
        </span>
        <Button size="sm" variant="subtle" asChild className="ml-auto">
          <Link href="/focus/session">
            Return to session
            <ArrowRight className="size-3.5" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
