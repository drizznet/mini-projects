"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Clock3,
  Play,
  RotateCcw,
  Target,
} from "lucide-react";

import {
  CategoryDot,
  PriorityBadge,
} from "@/components/shared/badges";
import { EmptyState } from "@/components/shared/empty-state";
import { ProgressDisplay } from "@/components/shared/progress-display";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { sessionActiveHours, sessionActiveMs } from "@/lib/analytics";
import { getCheckInState } from "@/lib/check-in";
import { buildIndex, lineageFor } from "@/lib/selectors";
import { useFocusStore } from "@/lib/store/focus-store";
import type { Category, FocusItem, FocusSession, PlanAllocation } from "@/lib/types";
import { formatDuration, formatHours, formatTime, toDateKey } from "@/lib/utils";

type StartRequest = {
  focusItemId: string;
  itemName: string;
  goalName: string;
  plannedMinutes: number;
  lateCheckInMinutes?: number;
  late: boolean;
  blockedReason?: string;
};

export function TodaysWorkItemsCard({
  allocations,
  categories,
  focusItems,
  sessions,
  activeSessionId,
  now,
  dateKey,
  highlightedFocusItemId,
}: {
  allocations: PlanAllocation[];
  categories: Category[];
  focusItems: FocusItem[];
  sessions: FocusSession[];
  activeSessionId: string | null;
  now: number;
  dateKey: string;
  highlightedFocusItemId?: string | null;
}) {
  const router = useRouter();
  const { state, actions } = useFocusStore();
  const [startRequest, setStartRequest] = useState<StartRequest | null>(null);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const index = buildIndex(state);
  const ringDisplay = (state.settings.goalProgressDisplay ?? "ring") === "ring";
  const checklist = state.settings.checklistTemplate.filter((entry) => entry.enabled);
  const readyCount = checklist.filter((entry) => checked[entry.id]).length;
  const visibleAllocations = allocations.filter((allocation) => {
    const active = sessions.some(
      (session) =>
        session.focusItemId === allocation.focusItemId &&
        session.id === activeSessionId &&
        (session.status === "running" || session.status === "paused"),
    );
    return !active;
  });

  const openStartDialog = (request: Omit<StartRequest, "blockedReason">) => {
    const currentSession = sessions.find((session) => session.id === activeSessionId);
    const currentLineage = currentSession
      ? lineageFor(index, currentSession.focusItemId)
      : undefined;
    const blockedReason =
      currentSession?.status === "running"
        ? "Another session is running. Finish or pause it before starting this work item."
        : currentSession?.status === "paused" &&
            currentLineage?.item.focusMode === "continuous"
          ? "Your paused work item is set to one continuous block. Resume or end it before starting another."
          : undefined;

    setChecked({});
    setStartRequest({ ...request, blockedReason });
  };

  const startSession = () => {
    if (!startRequest || startRequest.blockedReason) return;
    actions.startSession({
      focusItemId: startRequest.focusItemId,
      plannedMinutes: startRequest.plannedMinutes,
      lateCheckInMinutes: startRequest.lateCheckInMinutes,
      checklist: checklist.map((entry) => ({
        id: entry.id,
        label: entry.label,
        checked: Boolean(checked[entry.id]),
      })),
    });
    setStartRequest(null);
    router.push("/focus/session");
  };

  return (
    <Card className="h-full min-h-0 overflow-hidden">
      <CardHeader>
        <div>
          <CardTitle>Today&apos;s work</CardTitle>
          <p className="mt-1 text-xs text-muted-foreground">
            The work items you planned to move forward today.
          </p>
        </div>
        <Button size="sm" variant="subtle" asChild>
          <Link href="/work-items">Plan work</Link>
        </Button>
      </CardHeader>
      <CardContent className="min-h-0 space-y-3 overflow-y-auto">
        {allocations.length === 0 ? (
          <EmptyState
            icon={Target}
            title="No work planned for today"
            description="Open Work items to choose the concrete pieces of your goals for this day."
            action={
              <Button size="sm" asChild>
                <Link href="/work-items">Open work items</Link>
              </Button>
            }
          />
        ) : visibleAllocations.length === 0 ? (
          <div className="rounded-xl border border-dashed border-primary/25 bg-primary/5 px-4 py-8 text-center">
            <p className="text-sm font-medium text-primary">Your active work is shown above.</p>
            <p className="mt-1 text-xs text-muted-foreground">Other planned work will appear here when available.</p>
          </div>
        ) : (
          visibleAllocations.map((allocation) => {
            const item = focusItems.find((entry) => entry.id === allocation.focusItemId);
            const lineage = item ? lineageFor(index, item.id) : undefined;
            if (!item || !lineage?.goal) return null;
            const category = categories.find((entry) => entry.id === lineage.goal?.categoryId);
            const itemSessions = sessions.filter(
              (session) =>
                session.focusItemId === item.id &&
                toDateKey(session.startedAt) === dateKey,
            );
            const focusedHours = itemSessions.reduce(
              (total, session) => total + sessionActiveHours(session, now),
              0,
            );
            const progress = allocation.plannedHours > 0
              ? Math.min(1, focusedHours / allocation.plannedHours)
              : 0;
            const complete = progress >= 1;
            const checkIn = getCheckInState(lineage.goal, dateKey, now);

            return (
              <motion.article
                key={item.id}
                id={`today-work-item-${item.id}`}
                layoutId={`work-item-${item.id}`}
                transition={{ layout: { duration: 0.35, ease: "easeInOut" } }}
                className={`rounded-xl border bg-gradient-to-b from-card via-card to-primary/5 p-4 transition-[border-color,box-shadow,background-color] ${
                  item.id === highlightedFocusItemId
                    ? "border-primary/60 bg-primary/5 ring-2 ring-primary/15"
                    : "border-border/70 hover:border-primary/30"
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 space-y-1">
                    <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <CategoryDot
                        color={category ? `var(--${category.color})` : "var(--chart-1)"}
                      />
                      {category?.name ?? "Uncategorised"} · {lineage.goal.title}
                    </p>
                    <h3 className="truncate text-base font-semibold tracking-tight">{item.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {formatHours(allocation.plannedHours)} planned · {formatHours(focusedHours)} focused
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {complete ? (
                      <Badge className="gap-1 border-health-excellent/25 bg-health-excellent/10 text-health-excellent" variant="outline">
                        <CheckCircle2 className="size-3" />
                        Complete
                      </Badge>
                    ) : null}
                    <PriorityBadge priority={item.priority} />
                  </div>
                </div>

                <div className={ringDisplay ? "mt-4 flex items-center justify-between gap-4" : "mt-4 space-y-2"}>
                  <div className="flex min-w-0 flex-1 items-center justify-between gap-3 text-xs">
                    <span className="tabular font-medium">{formatDuration(itemSessions.reduce((total, session) => total + sessionActiveMs(session, now), 0))}</span>
                    <span className="tabular text-muted-foreground">{Math.round(progress * 100)}% of plan</span>
                  </div>
                  <ProgressDisplay
                    value={progress}
                    size={ringDisplay ? 58 : undefined}
                    strokeWidth={ringDisplay ? 7 : undefined}
                    className={ringDisplay ? "shrink-0" : "h-2"}
                  >
                    {ringDisplay ? <span className="tabular text-[11px] font-semibold">{Math.round(progress * 100)}%</span> : null}
                  </ProgressDisplay>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
                  {complete ? (
                    <Badge className="h-8 rounded-lg px-3" variant="secondary">
                      <CheckCircle2 className="size-3.5 text-health-excellent" />
                      Commitment met
                    </Badge>
                  ) : checkIn.state === "past" ? (
                    <>
                      <Badge
                        variant="outline"
                        className="h-8 gap-1.5 rounded-lg border-health-behind/25 bg-health-behind/10 px-3 text-health-behind"
                      >
                        <Clock3 className="size-3.5" />
                        Window passed · {checkIn.lateByMinutes}m late
                      </Badge>
                      <Button
                        size="sm"
                        variant="subtle"
                        onClick={() =>
                          openStartDialog({
                            focusItemId: item.id,
                            itemName: item.name,
                            goalName: lineage.goal.title,
                            plannedMinutes: Math.max(1, Math.round(allocation.plannedHours * 60)),
                            late: true,
                            lateCheckInMinutes: checkIn.lateByMinutes,
                          })
                        }
                      >
                        <RotateCcw className="size-3.5" />
                        Late check-in
                      </Button>
                    </>
                  ) : checkIn.state === "upcoming" ? (
                    <Badge
                      variant="outline"
                      className="h-8 gap-1.5 rounded-lg border-border bg-muted px-3 text-muted-foreground"
                    >
                      <Clock3 className="size-3.5" />
                      Opens at {formatTime(`1970-01-01T${checkIn.time}:00`)}
                    </Badge>
                  ) : (
                    <Button
                      size="sm"
                      variant={focusedHours > 0 ? "subtle" : "default"}
                      className={
                        focusedHours > 0
                          ? undefined
                          : "bg-gradient-to-r from-primary to-primary/80 shadow-sm shadow-primary/15"
                      }
                      onClick={() =>
                        openStartDialog({
                          focusItemId: item.id,
                          itemName: item.name,
                          goalName: lineage.goal.title,
                          plannedMinutes: Math.max(1, Math.round(allocation.plannedHours * 60)),
                          late: false,
                        })
                      }
                    >
                      {focusedHours > 0 ? (
                        <RotateCcw className="size-3.5" />
                      ) : (
                        <Play className="size-3.5" />
                      )}
                      {focusedHours > 0
                        ? "Continue"
                        : checkIn.enabled
                          ? "Check in"
                          : "Start session"}
                    </Button>
                  )}
                </div>
              </motion.article>
            );
          })
        )}
      </CardContent>

      <Dialog
        open={startRequest !== null}
        onOpenChange={(open) => {
          if (!open) setStartRequest(null);
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {startRequest?.blockedReason
                ? "Another session is active"
                : startRequest?.late
                  ? "Confirm late check-in"
                  : "Start this session?"}
            </DialogTitle>
            <DialogDescription>
              {startRequest?.blockedReason ??
                `${startRequest?.itemName ?? "This work item"} · ${startRequest?.goalName ?? "Goal"} · ${startRequest?.plannedMinutes ?? 0} minutes`}
              {!startRequest?.blockedReason && startRequest?.late
                ? ` · ${startRequest.lateCheckInMinutes}m late will be recorded.`
                : null}
            </DialogDescription>
          </DialogHeader>

          {startRequest?.blockedReason ? (
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm text-muted-foreground">
              Pause the current session to switch to a flexible work item, or
              return to the active workspace to continue it.
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">Pre-focus checklist</p>
                <span className="text-xs text-muted-foreground">
                  {readyCount} of {checklist.length} ready
                </span>
              </div>
              {checklist.length > 0 ? (
                <div className="space-y-2">
                  {checklist.map((entry) => (
                    <Label
                      key={entry.id}
                      className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-border/70 px-3 py-2.5 text-sm transition-colors hover:bg-secondary/50"
                    >
                      <Checkbox
                        checked={Boolean(checked[entry.id])}
                        onCheckedChange={(value) =>
                          setChecked((current) => ({
                            ...current,
                            [entry.id]: value === true,
                          }))
                        }
                      />
                      {entry.label}
                    </Label>
                  ))}
                </div>
              ) : (
                <p className="rounded-lg border border-dashed border-border/70 px-3 py-3 text-xs text-muted-foreground">
                  No checklist items configured. You can start immediately.
                </p>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="subtle" onClick={() => setStartRequest(null)}>
              Cancel
            </Button>
            {startRequest?.blockedReason ? (
              <Button asChild>
                <Link href="/focus/session">Open active session</Link>
              </Button>
            ) : (
              <Button onClick={startSession}>
                <Play className="size-3.5" />
                {startRequest?.late ? "Late check-in" : "Start session"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
