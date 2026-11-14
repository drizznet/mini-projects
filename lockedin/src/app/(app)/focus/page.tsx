"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, CheckCheck } from "lucide-react";

import { FocusMusic } from "@/components/focus/focus-music";
import { ActiveSessionStage } from "@/components/sessions/active-session-stage";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { useFocusData } from "@/hooks/use-focus-data";
import { itemHoursForDate } from "@/lib/analytics";
import { lineageFor, planForDate } from "@/lib/selectors";
import { isPlanFailed, loggedHoursForGoal } from "@/lib/plan-result";
import { notifyDevice } from "@/lib/notifications";
import { useFocusStore } from "@/lib/store/focus-store";
import { cn, formatHours } from "@/lib/utils";

export default function FocusSetupPage() {
  return (
    <Suspense fallback={<Skeleton className="h-96 w-full" />}>
      <FocusSetup />
    </Suspense>
  );
}

/**
 * Pre-focus screen.
 *
 * Two steps in one view: choose the work, then run the preparation checklist.
 * The primary CTA unlocks only when every enabled check is ticked — the escape
 * hatch below it exists so the ritual never becomes a blocker.
 */
function FocusSetup() {
  const router = useRouter();
  const params = useSearchParams();
  const { state, actions } = useFocusStore();
  const { index, now, todayKey } = useFocusData({
    tickMs: 30_000,
  });

  const requestedItemId = params.get("item");
  const requestedCheckInDate = params.get("day");
  const requestedDailySessionId = params.get("dailySession");
  const requestedGoalId = params.get("goal");
  const requestedMinutes = Number(params.get("minutes"));
  const lateCheckInMinutes = Number(params.get("lateBy"));
  const lateCheckIn = params.get("lateCheckIn") === "1";
  const requestedDailySession = state.dailySessions.find(
    (session) => session.id === requestedDailySessionId,
  );
  const requestedGoalItem = state.focusItems.find(
    (item) =>
      item.goalId === (requestedDailySession?.goalId ?? requestedGoalId) &&
      !item.archivedAt &&
      item.status !== "done",
  );

  const [selectedItemId, setSelectedItemId] = useState<string | null>(
    requestedItemId ?? requestedGoalItem?.id ?? null,
  );
  const [minutes, setMinutes] = useState<number>(
    requestedDailySession?.commitmentMinutes ??
      (Number.isFinite(requestedMinutes) && requestedMinutes > 0
        ? requestedMinutes
        : state.settings.defaultSessionMinutes),
  );

  const template = state.settings.checklistTemplate.filter(
    (entry) => entry.enabled,
  );
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const plan = planForDate(state, todayKey);
  const actualByItem = useMemo(
    () => itemHoursForDate(state, todayKey, now),
    [state, todayKey, now],
  );

  const lineage = selectedItemId ? lineageFor(index, selectedItemId) : undefined;
  const selectedFailed = Boolean(
    lineage?.goal &&
      isPlanFailed(lineage.goal, loggedHoursForGoal(state, lineage.goal.id, now), todayKey),
  );
  const currentSession = state.sessions.find(
    (session) => session.id === state.activeSessionId,
  );

  if (currentSession) {
    return <ActiveSessionStage />;
  }

  const readyCount = template.filter((entry) => checked[entry.id]).length;
  const allReady = template.length > 0 && readyCount === template.length;

  const start = () => {
    if (!selectedItemId || selectedFailed) return;
    actions.startSession({
      focusItemId: selectedItemId,
      plannedMinutes: requestedDailySession?.commitmentMinutes ?? minutes,
      checklist: template.map((entry) => ({
        id: entry.id,
        label: entry.label,
        checked: Boolean(checked[entry.id]),
      })),
      checkInDate:
        requestedCheckInDate && /^\d{4}-\d{2}-\d{2}$/.test(requestedCheckInDate)
          ? requestedCheckInDate
          : undefined,
      dailySessionId: requestedDailySessionId ?? undefined,
      lateCheckInMinutes:
        lateCheckIn && Number.isFinite(lateCheckInMinutes)
          ? Math.max(1, lateCheckInMinutes)
          : undefined,
    });
    void notifyDevice(
      "Focus session started",
      `${lineage?.item.name ?? "Your selected plan"} is now locked in.`,
      "lockin-session-started",
    );
    router.push("/lockin");
  };

  const plannedItems = (plan?.allocations ?? [])
    .map((allocation) => lineageFor(index, allocation.focusItemId))
    .filter((entry): entry is NonNullable<typeof entry> => {
      if (!entry?.goal) return Boolean(entry);
      return !isPlanFailed(entry.goal, loggedHoursForGoal(state, entry.goal.id, now), todayKey);
    });
  const canLockIn = Boolean(selectedItemId) && allReady && !selectedFailed;

  const choose = (itemId: string, hours: number) => {
    setSelectedItemId(itemId);
    setMinutes(Math.max(15, Math.round((hours > 0 ? hours : 0.5) * 60)));
  };

  return (
    <div>
      <section className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-xs">
        <div className="px-6 pt-6 sm:px-8">
          <p className="text-[11px] font-medium tracking-[0.14em] text-muted-foreground uppercase">
            Prepare to lock in
          </p>
        </div>

        <div className="px-4 pt-4 pb-2 sm:px-5">
          {plannedItems.length === 0 && !lineage ? (
            <div className="flex min-h-72 flex-col items-start justify-end rounded-xl bg-secondary px-6 py-8 sm:px-8">
              <p className="text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
                Today&apos;s plans
              </p>
              <p className="mt-4 max-w-sm text-3xl font-medium tracking-tight text-balance">
                Nothing is planned for today
              </p>
              <Link
                href="/plans"
                className="mt-6 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                My plans
              </Link>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl bg-secondary/60">
              <ul>
                {(lineage && !plannedItems.some((entry) => entry.item.id === lineage.item.id)
                  ? [lineage, ...plannedItems]
                  : [...plannedItems].sort((a, b) =>
                      a.item.id === selectedItemId ? -1 : b.item.id === selectedItemId ? 1 : 0,
                    )
                ).map((entry) => {
                  const active = selectedItemId === entry.item.id;
                  const allocated =
                    plan?.allocations.find((allocation) => allocation.focusItemId === entry.item.id)
                      ?.plannedHours ?? 0;
                  const hours = allocated || entry.item.estimatedDailyHours || 0;
                  const done = actualByItem.get(entry.item.id) ?? 0;
                  return (
                    <li key={entry.item.id} className="border-b border-border/40 last:border-b-0">
                      <button
                        type="button"
                        aria-pressed={active}
                        onClick={() => choose(entry.item.id, hours)}
                        className={cn(
                          "flex w-full items-end justify-between gap-6 px-6 text-left transition-colors sm:px-8",
                          active
                            ? "min-h-64 bg-foreground py-8 text-background sm:min-h-72"
                            : "py-5 text-foreground hover:bg-secondary",
                        )}
                      >
                        <span className="min-w-0">
                          <span
                            className={cn(
                              "block truncate text-[11px] font-medium tracking-[0.16em] uppercase",
                              active ? "text-background/60" : "text-muted-foreground",
                            )}
                          >
                            {entry.goal?.title ?? "Plan"}
                          </span>
                          <span
                            className={cn(
                              "block truncate font-medium tracking-tight",
                              active
                                ? "mt-4 text-3xl sm:text-4xl"
                                : "mt-1.5 text-base",
                            )}
                          >
                            {entry.item.name}
                          </span>
                          {active && done > 0 ? (
                            <span className="mt-3 block text-sm text-background/60 tabular">
                              {formatHours(done)} already in
                            </span>
                          ) : null}
                        </span>
                        <span
                          className={cn(
                            "shrink-0 leading-none font-medium tracking-[-0.045em] tabular",
                            active
                              ? "text-[3.25rem] text-background/80 sm:text-[4.25rem]"
                              : "text-2xl text-muted-foreground",
                          )}
                        >
                          {formatHours(active ? minutes / 60 : hours)}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
          {selectedFailed ? (
            <p className="px-2 pt-3 text-sm text-muted-foreground">
              This plan ended under 70% of its time, so it can&apos;t be locked in again.
            </p>
          ) : null}
        </div>

        {template.length > 0 ? (
          <div className="border-t border-border/60 px-6 py-5 sm:px-8">
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
                Before you lock in
              </p>
              <div className="flex items-center gap-4">
                <span className="text-xs text-muted-foreground tabular">
                  {readyCount} of {template.length}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setChecked(Object.fromEntries(template.map((entry) => [entry.id, true])))
                  }
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  <CheckCheck className="size-3.5" />
                  Check all
                </button>
              </div>
            </div>
            <ul className="mt-1">
              {template.map((entry) => {
                const isChecked = Boolean(checked[entry.id]);
                return (
                  <li key={entry.id} className="border-b border-border/60 last:border-b-0">
                    <label className="flex cursor-pointer items-center gap-3 py-3.5 text-sm">
                      <Checkbox
                        checked={isChecked}
                        onCheckedChange={(value) =>
                          setChecked((current) => ({
                            ...current,
                            [entry.id]: value === true,
                          }))
                        }
                      />
                      <span className={isChecked ? "text-foreground" : "text-muted-foreground"}>
                        {entry.label}
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
            {selectedItemId && !allReady && !selectedFailed ? (
              <button
                type="button"
                onClick={start}
                className="mt-3 text-xs text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
              >
                Skip the remaining {template.length - readyCount} and lock in anyway
              </button>
            ) : null}
          </div>
        ) : null}

        <FocusMusic links={state.settings.musicLinks} />

        <div className="flex items-stretch border-t border-border/60">
          <p className="flex min-w-0 flex-1 items-center truncate px-6 text-sm text-muted-foreground sm:px-8">
            {lineage ? lineage.item.name : "Pick a plan"}
          </p>
          <button
            type="button"
            onClick={start}
            disabled={!canLockIn}
            className={cn(
              "flex w-32 shrink-0 items-center justify-center gap-1.5 py-5 text-sm font-medium transition-colors sm:w-40",
              canLockIn
                ? "bg-foreground text-background hover:bg-foreground/90"
                : "cursor-not-allowed bg-secondary text-muted-foreground",
            )}
          >
            Lock in
            <ArrowRight className="size-3.5" />
          </button>
        </div>
      </section>
    </div>
  );
}

