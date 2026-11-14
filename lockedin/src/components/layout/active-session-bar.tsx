"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, GripHorizontal, PictureInPicture2, RectangleHorizontal } from "lucide-react";

import { FocusBackdrop } from "@/components/sessions/focus-backdrop";
import { useNow } from "@/hooks/use-now";
import { useDraggableIsland } from "@/hooks/use-draggable-island";
import { sessionActiveMs } from "@/lib/analytics";
import { islandPosition, SESSION_ISLAND_POSITIONS } from "@/lib/session-island";
import { lineageFor, buildIndex } from "@/lib/selectors";
import { useFocusStore } from "@/lib/store/focus-store";
import type { SessionIslandDisplay } from "@/lib/types";
import { cn, formatClock, formatDuration } from "@/lib/utils";

function ShapeToggle({
  value,
  onChange,
}: {
  value: "floating" | "island";
  onChange: (next: "floating" | "island") => void;
}) {
  const options = [
    ["floating", PictureInPicture2, "Floating panel"],
    ["island", RectangleHorizontal, "Bottom island"],
  ] as const;

  return (
    <div
      data-variant-toggle
      role="group"
      aria-label="Session reminder style"
      className="flex shrink-0 items-center rounded-full bg-black/35 p-0.5"
    >
      {options.map(([option, Icon, label]) => {
        const selected = value === option;
        return (
          <button
            key={option}
            type="button"
            aria-label={label}
            aria-pressed={selected}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onChange(option);
            }}
            className={cn(
              "grid size-7 place-items-center rounded-full transition-colors",
              selected ? "bg-white text-neutral-950" : "text-white/70 hover:text-white",
            )}
          >
            <Icon className="size-3.5" />
          </button>
        );
      })}
    </div>
  );
}

/**
 * Reminder for the one live session. Floating panel can be dragged.
 * The island stays centered on the bottom edge and grows on hover.
 */
export function ActiveSessionBar() {
  const { state, actions } = useFocusStore();
  const pathname = usePathname();
  const now = useNow(1000);
  const [expanded, setExpanded] = useState(false);
  const display: SessionIslandDisplay = state.settings.sessionIslandDisplay ?? "floating";
  const position = islandPosition(state.settings.sessionIslandPosition);
  const { panelRef, point, target, targetPoint, targetSize, handleProps } = useDraggableIsland(
    position,
    (next) => {
      actions.updateSettings({ sessionIslandPosition: next });
    },
  );

  const session = state.sessions.find((entry) => entry.id === state.activeSessionId);
  const live = session && (session.status === "running" || session.status === "paused") ? session : null;

  if (
    !live ||
    display === "navbar" ||
    pathname === "/dashboard" ||
    pathname === "/sessions" ||
    pathname === "/lockin"
  ) {
    return null;
  }

  const positionLabel = SESSION_ISLAND_POSITIONS.find(
    (entry) => entry.value === (target ?? position),
  )!.label;
  const lineage = lineageFor(buildIndex(state), live.focusItemId);
  const paused = live.status === "paused";
  const elapsed = sessionActiveMs(live, now);
  const plannedMs = live.plannedMinutes * 60_000;
  const progress = plannedMs > 0 ? Math.min(1, elapsed / plannedMs) : 0;
  const overtime = plannedMs > 0 && elapsed > plannedMs;
  const backdrop = state.settings.focusBackdrop ?? "gradient";
  const name = lineage?.item.name ?? "Focus session";
  const plan = lineage?.goal?.title ?? "Plan";
  const setDisplay = (next: "floating" | "island") => {
    actions.updateSettings({ sessionIslandDisplay: next });
  };

  const glow = paused
    ? "shadow-[0_18px_50px_-24px_rgba(0,0,0,0.8)]"
    : "shadow-[0_0_48px_-10px_rgba(251,113,133,0.75),0_0_72px_-16px_rgba(96,165,250,0.55)]";

  if (display === "island") {
    return (
      <div className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] left-1/2 z-40 w-[min(92vw,22rem)] -translate-x-1/2">
        <div
          className={cn(
            "relative overflow-hidden text-white transition-[border-radius] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
            expanded ? "rounded-[1.6rem]" : "rounded-full",
            glow,
          )}
          onPointerEnter={(event) => {
            if (event.pointerType === "mouse") setExpanded(true);
          }}
          onPointerLeave={(event) => {
            if (event.pointerType === "mouse") setExpanded(false);
          }}
        >
          <FocusBackdrop variant={backdrop} paused={paused} />
          <div className="pointer-events-none absolute inset-0 bg-black/55" aria-hidden />
          <div className="relative">
            <div className="flex items-center gap-2.5 py-2 pr-2 pl-3.5">
              <span
                className={cn(
                  "size-2 shrink-0 rounded-full",
                  paused
                    ? "bg-amber-300"
                    : "animate-pulse bg-white shadow-[0_0_10px_2px_rgba(255,255,255,0.85)]",
                )}
              />
              <button
                type="button"
                className="flex min-w-0 flex-1 items-center gap-2.5 text-left"
                aria-expanded={expanded}
                onClick={() => {
                  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
                  setExpanded((value) => (canHover ? true : !value));
                }}
              >
                <span className="min-w-0 flex-1 truncate text-sm font-medium">{name}</span>
                <span className="shrink-0 text-sm font-medium tabular">{formatClock(elapsed)}</span>
              </button>
              <ShapeToggle value="island" onChange={setDisplay} />
            </div>
            <div
              className={cn(
                "grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="overflow-hidden">
                <div className="px-4 pt-1 pb-4">
                  <p className="truncate text-[11px] font-medium tracking-[0.16em] text-white/60 uppercase">
                    {plan}
                  </p>
                  <p className="mt-3 text-[2.4rem] leading-none font-medium tracking-[-0.04em] tabular">
                    {formatClock(elapsed)}
                  </p>
                  <p className="mt-2 text-xs text-white/65">
                    {overtime
                      ? `${formatDuration(elapsed - plannedMs)} past the plan`
                      : `${formatDuration(Math.max(0, plannedMs - elapsed))} left`}
                  </p>
                  <div className="mt-3 h-px bg-white/20">
                    <div
                      className={cn("h-px", overtime ? "bg-emerald-300" : "bg-white")}
                      style={{ width: `${progress * 100}%` }}
                    />
                  </div>
                  <Link
                    href="/lockin"
                    className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-white/85"
                  >
                    Open
                    <ArrowRight className="size-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {targetPoint && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed z-30 rounded-[1.35rem] border-2 border-dashed border-white/70 bg-white/5"
          style={{
            left: targetPoint.x,
            top: targetPoint.y,
            width: targetSize?.width,
            height: targetSize?.height,
          }}
        />
      )}
      <div
        ref={panelRef}
        className={cn(
          "fixed z-40 w-[calc(100%_-_24px)] max-w-sm overflow-hidden rounded-[1.35rem] text-white",
          glow,
        )}
        style={
          point
            ? { left: point.x, top: point.y }
            : {
                top: position.startsWith("top") ? 72 : undefined,
                bottom: position.startsWith("bottom") ? 16 : undefined,
                left: position.endsWith("left") ? 12 : position.endsWith("right") ? undefined : "50%",
                right: position.endsWith("right") ? 12 : undefined,
                transform: position === "top" || position === "bottom" ? "translateX(-50%)" : undefined,
              }
        }
      >
        <FocusBackdrop variant={backdrop} paused={paused} />
        <div className="pointer-events-none absolute inset-0 bg-[#0c0c10]/40" aria-hidden />

        <div className="relative">
          <div className="flex items-center gap-2 pr-3">
            <button
              type="button"
              {...handleProps}
              aria-label="Move session bar"
              aria-describedby="session-bar-drag-help"
              title="Drag to reposition, or use arrow keys"
              className="flex min-h-11 min-w-0 flex-1 touch-none items-center gap-2 px-3 text-left text-white/70 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-white"
              style={{ cursor: point ? "grabbing" : "grab" }}
            >
              <GripHorizontal className="size-4 shrink-0" aria-hidden="true" />
              <span className="truncate text-xs">
                {point ? `Release: ${positionLabel}` : "Drag to move"}
              </span>
            </button>
            <ShapeToggle value="floating" onChange={setDisplay} />
            <span id="session-bar-drag-help" className="sr-only">
              Drag to the top, bottom, or a corner. Arrow keys move between positions. Escape cancels dragging.
            </span>
          </div>

          <Link href="/lockin" className="block px-4 pt-1 pb-4">
            <p className="truncate text-[11px] font-medium tracking-[0.16em] text-white/60 uppercase">
              {plan}
            </p>
            <p className="mt-1 truncate text-lg font-medium tracking-tight">{name}</p>
            <p className="mt-3 text-[2.6rem] leading-none font-medium tracking-[-0.04em] tabular">
              {formatClock(elapsed)}
            </p>
            <p className="mt-2 text-xs text-white/65">
              {overtime
                ? `${formatDuration(elapsed - plannedMs)} past the plan`
                : `${formatDuration(Math.max(0, plannedMs - elapsed))} left`}
            </p>
            <div className="mt-3 h-px bg-white/20">
              <div
                className={cn("h-px", overtime ? "bg-emerald-300" : "bg-white")}
                style={{ width: `${progress * 100}%` }}
              />
            </div>
            <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-white/80">
              Open
              <ArrowRight className="size-3.5" />
            </span>
          </Link>
        </div>
      </div>
    </>
  );
}
