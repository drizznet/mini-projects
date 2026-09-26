import type { SessionIslandPosition } from "./types";

export const SESSION_ISLAND_POSITIONS = [
  { value: "top-left", label: "Top left" },
  { value: "top", label: "Top center" },
  { value: "top-right", label: "Top right" },
  { value: "bottom-left", label: "Bottom left" },
  { value: "bottom", label: "Bottom center" },
  { value: "bottom-right", label: "Bottom right" },
] as const satisfies ReadonlyArray<{ value: SessionIslandPosition; label: string }>;

export function islandPosition(value: unknown): SessionIslandPosition {
  return SESSION_ISLAND_POSITIONS.find((position) => position.value === value)?.value ?? "bottom";
}
