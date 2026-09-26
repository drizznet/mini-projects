"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowRight,
  GripHorizontal,
  Layers3,
  PauseCircle,
  Radio,
  Timer,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useNow } from "@/hooks/use-now";
import { useDraggableIsland } from "@/hooks/use-draggable-island";
import { islandPosition, SESSION_ISLAND_POSITIONS } from "@/lib/session-island";
import { sessionActiveMs } from "@/lib/analytics";
import { lineageFor, buildIndex } from "@/lib/selectors";
import { useFocusStore } from "@/lib/store/focus-store";
import { formatClock } from "@/lib/utils";

/**
 * Persistent reminder that a session is in flight.
 *
 * Rendered by the app shell, with a saved snap position and a separate drag
 * handle so opening a session never accidentally starts a drag.
 */
export function ActiveSessionBar() {
  const { state, actions } = useFocusStore();
  const pathname = usePathname();
  const now = useNow(1000);
  const position = islandPosition(state.settings.sessionIslandPosition);
  const { panelRef, point, target, handleProps } = useDraggableIsland(position, (next) => {
    actions.updateSettings({ sessionIslandPosition: next });
  });
  const positionLabel = SESSION_ISLAND_POSITIONS.find((entry) => entry.value === (target ?? position))!.label;

  const activeSessions = state.sessions.filter(
    (session) => session.status === "running" || session.status === "paused",
  );
  if (
    !activeSessions.length ||
    state.settings.sessionIslandDisplay === "navbar" ||
    pathname === "/dashboard"
  ) return null;

  const index = buildIndex(state);

  return (
    <div
      ref={panelRef}
      className="fixed z-40 flex max-h-[calc(100dvh_-_88px)] w-[calc(100%_-_24px)] max-w-md flex-col overflow-hidden rounded-2xl border border-primary/25 bg-card/95 shadow-2xl shadow-black/25 backdrop-blur-xl"
      style={point ? { left: point.x, top: point.y } : {
        top: position.startsWith("top") ? 72 : undefined,
        bottom: position.startsWith("bottom") ? 16 : undefined,
        left: position.endsWith("left") ? 12 : position.endsWith("right") ? undefined : "50%",
        right: position.endsWith("right") ? 12 : undefined,
        transform: position === "top" || position === "bottom" ? "translateX(-50%)" : undefined,
      }}
    >
        <div className="flex shrink-0 items-center border-b border-border/70 px-2">
          <button
            type="button"
            {...handleProps}
            aria-label="Move session bar"
            aria-describedby="session-bar-drag-help"
            title="Drag to reposition, or use arrow keys"
            className="flex min-h-11 min-w-0 flex-1 touch-none select-none items-center gap-2 rounded-lg px-2 text-left text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring"
            style={{ cursor: point ? "grabbing" : "grab" }}
          >
            <GripHorizontal className="size-4 shrink-0" aria-hidden="true" />
            <span className="truncate text-xs">{point ? `Release: ${positionLabel}` : "Drag to move"}</span>
          </button>
          <span className="shrink-0 px-2 text-[10px] text-muted-foreground" aria-live="polite">{positionLabel}</span>
          <span id="session-bar-drag-help" className="sr-only">Drag to the top, bottom, or a corner. Arrow keys move between positions. Escape cancels dragging.</span>
        </div>
        <div className="flex shrink-0 items-center gap-2 border-b border-border/70 px-3 py-2">
          <span className="flex size-6 items-center justify-center rounded-full bg-primary/12 text-primary">
            <Layers3 className="size-3.5" />
          </span>
          <span className="text-xs font-semibold tracking-wide">
            Active sessions
          </span>
          <span className="rounded-full bg-secondary px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
            {activeSessions.length}
          </span>
          <Button size="sm" variant="subtle" asChild className="ml-auto">
            <Link href="/focus/session">
              Open workspace
              <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </div>

        <div className="min-h-0 max-h-64 divide-y divide-border/70 overflow-y-auto overscroll-contain">
          {activeSessions.map((session) => {
            const lineage = lineageFor(index, session.focusItemId);
            const paused = session.status === "paused";
            return (
              <Link
                key={session.id}
                href="/focus/session"
                className="group flex items-center gap-3 px-3 py-2.5 transition-colors hover:bg-secondary/50"
              >
                <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-secondary">
                  {paused ? (
                    <PauseCircle className="size-4 text-health-slipping" />
                  ) : (
                    <Radio className="size-4 animate-pulse text-primary" />
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-xs font-medium">
                    {lineage?.item.name ?? "Focus session"}
                  </span>
                  <span className="block truncate text-[10px] text-muted-foreground">
                    {paused ? "Paused" : "Running"} · {lineage?.goal?.title ?? "No goal"}
                  </span>
                </span>
                <span className="flex shrink-0 items-center gap-1.5 text-xs font-semibold tabular">
                  <Timer className="size-3 text-muted-foreground" />
                  {formatClock(sessionActiveMs(session, now))}
                </span>
              </Link>
            );
          })}
        </div>
    </div>
  );
}
