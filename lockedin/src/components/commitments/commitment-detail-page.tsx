"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, CircleSlash2, Clock3, MessageSquareQuote, Plus, Target, Zap } from "lucide-react";
import { toast } from "sonner";

import { ItemDialog } from "@/components/items/item-dialog";
import { ItemStatusBadge, PriorityBadge, CategoryDot } from "@/components/shared/badges";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { ProgressDisplay } from "@/components/shared/progress-display";
import { RatingStars } from "@/components/sessions/rating-stars";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CommitmentDialog } from "@/components/commitments/commitment-dialog";
import { useFocusData } from "@/hooks/use-focus-data";
import { commitmentToGoal } from "@/lib/commitments/mappers";
import { countInterruptions, sessionActiveHours, sessionActiveMs } from "@/lib/analytics";
import { itemsForGoal, sessionsForItem } from "@/lib/selectors";
import { isPlanFailed } from "@/lib/plan-result";
import { useFocusStore } from "@/lib/store/focus-store";
import { formatDuration, formatHours, formatRelativeDay, formatTime } from "@/lib/utils";
import { useCommitment, useCommitmentsLoading } from "@/services/commitments";
import { Skeleton } from "@/components/ui/skeleton";

export function CommitmentDetailPage({ goalId }: { goalId: string }) {
  const { state, actions, hydrated } = useFocusStore();
  const commitmentsLoading = useCommitmentsLoading(hydrated);
  const { data: remoteCommitment, isLoading: remoteLoading } = useCommitment(goalId, hydrated);
  const { goals, now, todayKey } = useFocusData({ tickMs: 30_000 });
  const goal =
    (remoteCommitment ? commitmentToGoal(remoteCommitment.data) : undefined) ??
    state.goals.find((entry) => entry.id === goalId);
  const progress = goals.find((entry) => entry.goalId === goalId);
  const failed = Boolean(
    goal && isPlanFailed(goal, progress?.loggedHours ?? 0, todayKey),
  );

  useEffect(() => {
    if (!remoteCommitment) return;
    actions.saveGoal(commitmentToGoal(remoteCommitment.data));
  }, [remoteCommitment, actions]);

  if (commitmentsLoading || (remoteLoading && !goal)) {
    return (
      <div className="space-y-6" aria-busy="true" aria-label="Loading plan">
        <Skeleton className="h-24 w-full rounded-2xl" />
        <Skeleton className="h-48 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (!goal) {
    return (
      <EmptyState
        icon={Target}
        title="Plan not found"
        description="This plan may have been removed."
        action={<Button asChild><Link href="/plans">Back to my plans</Link></Button>}
        className="py-20"
      />
    );
  }

  const category = state.categories.find((entry) => entry.id === goal.categoryId);
  const items = itemsForGoal(state, goal.id);
  return (
    <div className="space-y-6">
      <PageHeader
        title={goal.title}
        description={goal.description || "A plan and the focus work attached to it."}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/plans"><ArrowLeft className="size-3.5" />My plans</Link>
            </Button>
            <CommitmentDialog
              goal={goal}
              categories={state.categories}
              trigger={<Button size="sm" variant="subtle">Edit</Button>}
              onSave={(updated) => {
                actions.saveGoal(updated);
                toast.success("Plan updated");
              }}
            />
            <ItemDialog
              goals={state.goals}
              defaultGoalId={goal.id}
              trigger={
                <Button size="sm" disabled={failed}>
                  <Plus className="size-3.5" />
                  Add work item
                </Button>
              }
              onSave={(item) => {
                actions.saveItem(item);
                toast.success(`Added ${item.name}`);
              }}
            />
          </div>
        }
      />

      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <CategoryDot color={category ? `var(--${category.color})` : "var(--chart-1)"} />
        {category?.name ?? "Uncategorised"}
        <PriorityBadge priority={goal.priority} />
      </div>

      <Card>
        <CardHeader><CardTitle>Plan details</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
            <Detail label="Status" value={failed ? "Failed" : goal.status} />
            <Detail label="Priority" value={goal.priority} />
            <Detail label="Plan" value={goal.dailyCommitmentMinutes ? `${formatHours(goal.dailyCommitmentMinutes / 60)} per day` : "—"} />
            <Detail label="Check-in" value={goal.scheduledCheckInEnabled ? `${goal.scheduledCheckInTime ?? "Scheduled"}${goal.strictCheckIn ? " · strict" : ""}` : "Not scheduled"} />
          </div>
          {progress ? (
            <>
              <div className="flex items-baseline justify-between text-sm">
                <span>{formatHours(progress.loggedHours)} focused</span>
                <span className="tabular text-muted-foreground">of {formatHours(goal.targetHours)}</span>
              </div>
              <ProgressDisplay
                value={progress.progress}
                className="h-2"
                barClassName="bg-primary"
              />
            </>
          ) : null}
          {failed ? (
            <p className="text-sm text-muted-foreground">
              This plan ended under 70% of its planned time. It stays here as a record and can&apos;t be focused again.
            </p>
          ) : null}
          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
            {goal.startDate ? <span>Started {formatRelativeDay(goal.startDate)}</span> : null}
            {goal.targetDate ? <span>Ends {formatRelativeDay(goal.targetDate)}</span> : null}
            {goal.dailyCommitmentMinutes ? <span><Clock3 className="mr-1 inline size-3" />{formatHours(goal.dailyCommitmentMinutes / 60)} daily</span> : null}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Work items</CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">
              Concrete pieces of this plan, with their focus history attached.
            </p>
          </div>
          <Button size="sm" variant="subtle" asChild>
            <Link href="/calendar">Open calendar</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground">No work items attached to this plan yet.</p>
          ) : (
            <div className="divide-y divide-border/70">
              {items.map((item) => {
                const itemSessions = sessionsForItem(state, item.id).sort(
                  (a, b) =>
                    new Date(b.startedAt).getTime() -
                    new Date(a.startedAt).getTime(),
                );
                const itemHours = state.sessions
                  .filter((session) => session.focusItemId === item.id)
                  .reduce((total, session) => total + sessionActiveHours(session, now), 0);
                return (
                  <details key={item.id} className="group py-3 first:pt-0 last:pb-0">
                    <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-3 rounded-lg transition-colors hover:bg-secondary/40 [&::-webkit-details-marker]:hidden">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatHours(itemHours)} focused · {itemSessions.length} session{itemSessions.length === 1 ? "" : "s"}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <PriorityBadge priority={item.priority} />
                        <ItemStatusBadge status={item.status} />
                        <span className="text-xs text-muted-foreground transition-transform group-open:rotate-180">⌄</span>
                      </div>
                    </summary>
                    <div className="relative mt-3 space-y-3 pl-5 before:absolute before:inset-y-2 before:left-2 before:w-px before:bg-border/80">
                      {itemSessions.length > 0 ? (
                        itemSessions.map((session, sessionIndex) => {
                          const elapsed = sessionActiveMs(session, now);
                          const interruptions = countInterruptions(state, session);
                          const abandoned = session.status === "abandoned";
                          return (
                            <motion.article
                              key={session.id}
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: sessionIndex * 0.04, duration: 0.2 }}
                              className="relative rounded-xl border border-border/70 bg-card-elevated/35 p-3.5 shadow-xs"
                            >
                              <span
                                className={`absolute -left-[1.35rem] top-5 grid size-3 place-items-center rounded-full border-2 border-background ${
                                  abandoned ? "bg-health-behind" : "bg-health-excellent"
                                }`}
                              >
                                <span className="size-1 rounded-full bg-background" />
                              </span>
                              <div className="flex flex-wrap items-start justify-between gap-3">
                                <div className="min-w-0">
                                  <p className="text-xs font-semibold">
                                    {formatRelativeDay(session.startedAt)} · {formatTime(session.startedAt)}
                                    {session.endedAt ? ` – ${formatTime(session.endedAt)}` : ""}
                                  </p>
                                  <p className="mt-1 text-[11px] text-muted-foreground">
                                    {formatDuration(elapsed)} focused · {session.plannedMinutes}m target
                                  </p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge
                                    variant={abandoned ? "destructive" : "outline"}
                                    className={!abandoned ? "gap-1 border-health-excellent/25 bg-health-excellent/10 text-health-excellent" : "gap-1"}
                                  >
                                    {abandoned ? <CircleSlash2 className="size-3" /> : <CheckCircle2 className="size-3" />}
                                    {abandoned ? "Abandoned" : "Completed"}
                                  </Badge>
                                  <RatingStars value={session.productivityRating} />
                                </div>
                              </div>
                              <div className="mt-3 flex flex-wrap gap-2 text-[10px] text-muted-foreground">
                                <span className="inline-flex items-center gap-1 rounded-md bg-secondary/60 px-2 py-1">
                                  <Clock3 className="size-3" />
                                  {formatDuration(elapsed)}
                                </span>
                                <span className="inline-flex items-center gap-1 rounded-md bg-secondary/60 px-2 py-1">
                                  <Zap className="size-3" />
                                  {interruptions} interruption{interruptions === 1 ? "" : "s"}
                                </span>
                                <span className="rounded-md bg-secondary/60 px-2 py-1">
                                  {session.pauses.length} pause{session.pauses.length === 1 ? "" : "s"}
                                </span>
                              </div>
                              {session.reflection ? (
                                <p className="mt-3 flex gap-2 border-t border-border/60 pt-3 text-xs leading-relaxed text-muted-foreground">
                                  <MessageSquareQuote className="mt-0.5 size-3.5 shrink-0 text-primary" />
                                  {session.reflection}
                                </p>
                              ) : null}
                            </motion.article>
                          );
                        })
                      ) : (
                        <p className="rounded-xl border border-dashed border-border/70 bg-secondary/20 p-4 text-xs text-muted-foreground">
                          No sessions recorded for this work item yet.
                        </p>
                      )}
                    </div>
                  </details>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-secondary/45 p-3">
      <p className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">{label}</p>
      <p className="mt-1 font-medium capitalize">{value}</p>
    </div>
  );
}
