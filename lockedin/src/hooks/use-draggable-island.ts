"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { SESSION_ISLAND_POSITIONS } from "@/lib/session-island";
import type { SessionIslandPosition } from "@/lib/types";

type Point = { x: number; y: number };
type Drag = {
  pointerId: number;
  start: Point;
  origin: Point;
  current: Point;
  width: number;
  height: number;
  moved: boolean;
};

function bounds(width: number, height: number) {
  return {
    left: 12,
    right: Math.max(12, window.innerWidth - width - 12),
    top: 72,
    bottom: Math.max(72, window.innerHeight - height - 16),
  };
}

function nearestPosition(drag: Drag, fallback: SessionIslandPosition): SessionIslandPosition {
  const box = bounds(drag.width, drag.height);
  // Keep a stable choice when positions coincide on a narrow screen.
  const candidates = [...SESSION_ISLAND_POSITIONS].sort((a, b) => Number(b.value === fallback) - Number(a.value === fallback));
  let best = fallback;
  let distance = Infinity;
  for (const { value } of candidates) {
    const x = value.endsWith("left") ? box.left : value.endsWith("right") ? box.right : (box.left + box.right) / 2;
    const y = value.startsWith("top") ? box.top : box.bottom;
    const next = Math.hypot(drag.current.x - x, drag.current.y - y);
    if (next < distance) { distance = next; best = value; }
  }
  return best;
}

export function useDraggableIsland(position: SessionIslandPosition, onPositionChange: (position: SessionIslandPosition) => void) {
  const panelRef = useRef<HTMLDivElement>(null);
  const drag = useRef<Drag | null>(null);
  const [point, setPoint] = useState<Point | null>(null);
  const [target, setTarget] = useState<SessionIslandPosition | null>(null);

  function cancelDrag() {
    drag.current = null;
    setPoint(null);
    setTarget(null);
  }

  useEffect(() => {
    const cancel = () => { drag.current = null; setPoint(null); setTarget(null); };
    window.addEventListener("resize", cancel);
    window.addEventListener("blur", cancel);
    return () => { window.removeEventListener("resize", cancel); window.removeEventListener("blur", cancel); };
  }, []);

  function pointerDown(event: PointerEvent<HTMLButtonElement>) {
    if (!event.isPrimary || event.button !== 0 || !panelRef.current) return;
    const rect = panelRef.current.getBoundingClientRect();
    event.currentTarget.setPointerCapture(event.pointerId);
    event.currentTarget.focus({ preventScroll: true });
    drag.current = {
      pointerId: event.pointerId,
      start: { x: event.clientX, y: event.clientY },
      origin: { x: rect.left, y: rect.top },
      current: { x: rect.left, y: rect.top },
      width: rect.width, height: rect.height, moved: false,
    };
  }

  function pointerMove(event: PointerEvent<HTMLButtonElement>) {
    const active = drag.current;
    if (!active || active.pointerId !== event.pointerId) return;
    const dx = event.clientX - active.start.x;
    const dy = event.clientY - active.start.y;
    if (!active.moved && Math.hypot(dx, dy) < 5) return;
    active.moved = true;
    const box = bounds(active.width, active.height);
    active.current = {
      x: Math.min(box.right, Math.max(box.left, active.origin.x + dx)),
      y: Math.min(box.bottom, Math.max(box.top, active.origin.y + dy)),
    };
    setPoint(active.current);
    setTarget(nearestPosition(active, position));
  }

  function pointerUp(event: PointerEvent<HTMLButtonElement>) {
    const active = drag.current;
    if (!active || active.pointerId !== event.pointerId) return;
    pointerMove(event);
    if (active.moved) onPositionChange(nearestPosition(active, position));
    cancelDrag();
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  }

  function keyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "Escape") { cancelDrag(); return; }
    if (point || !["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) return;
    event.preventDefault();
    const index = SESSION_ISLAND_POSITIONS.findIndex((entry) => entry.value === position);
    let row = Math.floor(index / 3);
    let column = index % 3;
    if (event.key === "ArrowUp") row = 0;
    if (event.key === "ArrowDown") row = 1;
    if (event.key === "ArrowLeft") column = Math.max(0, column - 1);
    if (event.key === "ArrowRight") column = Math.min(2, column + 1);
    onPositionChange(SESSION_ISLAND_POSITIONS[row * 3 + column]!.value);
  }

  return {
    panelRef, point, target,
    handleProps: {
      onPointerDown: pointerDown, onPointerMove: pointerMove, onPointerUp: pointerUp,
      onPointerCancel: cancelDrag, onLostPointerCapture: cancelDrag, onKeyDown: keyDown,
    },
  };
}
