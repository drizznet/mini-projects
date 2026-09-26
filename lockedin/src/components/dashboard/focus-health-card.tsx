"use client";

import { Info } from "lucide-react";

import { ProgressDisplay } from "@/components/shared/progress-display";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SCORE_COMPONENT_LABELS } from "@/lib/analytics";
import { healthFromScore } from "@/lib/health";
import type { DayMetrics } from "@/lib/types";

/**
 * Focus health score with its four weighted inputs broken out, so the number is
 * explainable rather than magic.
 */
export function FocusHealthCard({
  today,
  trailingScore,
}: {
  today: DayMetrics;
  trailingScore: number;
}) {
  const health = healthFromScore(today.focusScore);

  return (
    <Card className="h-full">
      <CardHeader>
        <div>
          <CardTitle>Focus health score</CardTitle>
          <CardDescription>
            Weighted from adherence, completion, consistency and distraction
          </CardDescription>
        </div>
        <Tooltip>
          <TooltipTrigger className="text-muted-foreground transition-colors hover:text-foreground">
            <Info className="size-4" />
          </TooltipTrigger>
          <TooltipContent className="max-w-72">
            Each input is normalised to 0–1, multiplied by its weight, then
            scaled to 100. Overworking your plan cannot push adherence above
            100%.
          </TooltipContent>
        </Tooltip>
      </CardHeader>

      <CardContent className="flex flex-col items-center gap-6 sm:flex-row sm:items-center">
        <ProgressDisplay
          value={today.focusScore / 100}
          size={152}
          strokeWidth={11}
          color={health.cssVar}
          barClassName={health.fill}
        >
          <span className="tabular text-3xl font-semibold">
            {today.focusScore}
          </span>
          <span className={`text-[11px] font-medium ${health.text}`}>
            {health.label}
          </span>
          <span className="mt-0.5 text-[10px] text-muted-foreground">
            30-day avg {trailingScore}
          </span>
        </ProgressRing>

        <ul className="w-full flex-1 space-y-3">
          {SCORE_COMPONENT_LABELS.map((component) => {
            const value = today.components[component.key];
            return (
              <li key={component.key} className="space-y-1.5">
                <div className="flex items-baseline justify-between gap-2">
                  <Tooltip>
                    <TooltipTrigger className="text-left text-xs text-muted-foreground hover:text-foreground">
                      {component.label}
                    </TooltipTrigger>
                    <TooltipContent>{component.hint}</TooltipContent>
                  </Tooltip>
                  <span className="tabular text-xs font-medium">
                    {Math.round(value * 100)}%
                    <span className="ml-1 text-[10px] text-muted-foreground">
                      ×{component.weight}
                    </span>
                  </span>
                </div>
                <ProgressDisplay
                  value={value}
                  size={36}
                  strokeWidth={5}
                  className="h-1"
                  barClassName={healthFromScore(value * 100).fill}
                  color={healthFromScore(value * 100).cssVar}
                />
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
