import { Badge } from "@/components/ui/badge";
import { FOCUS_ITEM_STATUS_LABEL, GOAL_STATUS_LABEL } from "@/lib/constants";
import { healthFromScore, PRIORITY_META } from "@/lib/health";
import type { FocusItemStatus, GoalStatus, Priority } from "@/lib/types";
import { cn } from "@/lib/utils";

export function PriorityBadge({
  priority,
  className,
}: {
  priority: Priority;
  className?: string;
}) {
  const meta = PRIORITY_META[priority];
  return (
    <Badge
      variant="outline"
      className={cn(meta.text, meta.bg, meta.border, className)}
    >
      {meta.label}
    </Badge>
  );
}

export function GoalStatusBadge({ status }: { status: GoalStatus }) {
  const tone: Record<GoalStatus, string> = {
    active: "text-health-on-track bg-health-on-track/12 border-health-on-track/30",
    paused: "text-muted-foreground bg-muted border-border",
    completed:
      "text-health-excellent bg-health-excellent/12 border-health-excellent/30",
  };
  return (
    <Badge variant="outline" className={tone[status]}>
      {GOAL_STATUS_LABEL[status]}
    </Badge>
  );
}

export function ItemStatusBadge({ status }: { status: FocusItemStatus }) {
  const tone: Record<FocusItemStatus, string> = {
    not_started: "text-muted-foreground bg-muted border-border",
    in_progress:
      "text-health-on-track bg-health-on-track/12 border-health-on-track/30",
    blocked:
      "text-health-critical bg-health-critical/12 border-health-critical/30",
    done: "text-health-excellent bg-health-excellent/12 border-health-excellent/30",
  };
  return (
    <Badge variant="outline" className={tone[status]}>
      {FOCUS_ITEM_STATUS_LABEL[status]}
    </Badge>
  );
}

/** Health pill driven by a 0–100 score — the app's core adaptive signal. */
export function HealthBadge({
  score,
  showScore = true,
  className,
}: {
  score: number;
  showScore?: boolean;
  className?: string;
}) {
  const health = healthFromScore(score);
  return (
    <Badge
      variant="outline"
      className={cn(health.text, health.bg, health.border, className)}
    >
      <span className={cn("size-1.5 rounded-full", health.fill)} />
      {health.label}
      {showScore ? <span className="tabular opacity-70">{score}</span> : null}
    </Badge>
  );
}

export function CategoryDot({
  color,
  className,
}: {
  color: string;
  className?: string;
}) {
  return (
    <span
      className={cn("size-2 shrink-0 rounded-full", className)}
      style={{ backgroundColor: color }}
    />
  );
}
