"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowRight,
  CheckCheck,
  ListChecks,
  Play,
  Radio,
  ShieldCheck,
} from "lucide-react";

import { FocusMusic } from "@/components/focus/focus-music";
import { CategoryDot, PriorityBadge } from "@/components/shared/badges";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useFocusData } from "@/hooks/use-focus-data";
import { itemHoursForDate } from "@/lib/analytics";
import { BRAND } from "@/lib/brand";
import { SESSION_PRESETS } from "@/lib/constants";
import { activeItems, lineageFor, planForDate } from "@/lib/selectors";
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
  const { index, now, todayKey, recommendations } = useFocusData({
    tickMs: 30_000,
  });

  const requestedItemId = params.get("item");
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

  const available = activeItems(state);
  const lineage = selectedItemId ? lineageFor(index, selectedItemId) : undefined;
  const currentSession = state.sessions.find(
    (session) => session.id === state.activeSessionId,
  );
  const currentSessionLineage = currentSession
    ? lineageFor(index, currentSession.focusItemId)
    : undefined;
  const cannotSwitchSession =
    currentSession?.status === "running" ||
    (currentSession?.status === "paused" &&
      currentSessionLineage?.item.focusMode === "continuous");
  const switchingFromPausedSession =
    currentSession?.status === "paused" && !cannotSwitchSession;

  const readyCount = template.filter((entry) => checked[entry.id]).length;
  const allReady = template.length > 0 && readyCount === template.length;

  const start = () => {
    if (!selectedItemId) return;
    actions.startSession({
      focusItemId: selectedItemId,
      plannedMinutes: requestedDailySession?.commitmentMinutes ?? minutes,
      checklist: template.map((entry) => ({
        id: entry.id,
        label: entry.label,
        checked: Boolean(checked[entry.id]),
      })),
      dailySessionId: requestedDailySessionId ?? undefined,
      lateCheckInMinutes:
        lateCheckIn && Number.isFinite(lateCheckInMinutes)
          ? Math.max(1, lateCheckInMinutes)
          : undefined,
    });
    router.push("/focus/session");
  };

  if (cannotSwitchSession) {
    return (
      <div className="space-y-6">
        <PageHeader
          title={currentSession?.status === "paused" ? "Continuous work is paused" : "Session already running"}
          description={
            currentSession?.status === "paused"
              ? "This work item is set to one continuous block. Resume or end it before starting another session."
              : "Finish or pause the current session before starting another one."
          }
        />
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <span className="grid size-12 place-items-center rounded-full bg-primary/12">
              <Radio className="size-5 animate-pulse text-primary" />
            </span>
            <p className="text-sm text-muted-foreground">
              {currentSession?.status === "paused"
                ? "This work item is protected as one continuous block."
                : `${BRAND.name} keeps one running session at a time so the numbers stay honest.`}
            </p>
            <Button asChild>
              <Link href="/focus/session">
                Return to session
                <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const plannedItems = (plan?.allocations ?? [])
    .map((allocation) => lineageFor(index, allocation.focusItemId))
    .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Prepare to focus"
        description="Pick the work, set the block length, then clear the runway. Preparation is the cheapest way to protect a session."
      />

      {switchingFromPausedSession ? (
        <Card className="border-primary/20 bg-primary/[0.035]">
          <CardContent className="flex items-start gap-3 py-4 text-sm">
            <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
              <Radio className="size-3.5" />
            </span>
            <p className="text-muted-foreground">
              Your previous work item is paused. You can focus on this one now;
              resume the paused session later from Sessions.
            </p>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>1 · What are you focusing on?</CardTitle>
                <CardDescription>
                  Today&apos;s plan first, then everything else that is active
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {available.length === 0 ? (
                <EmptyState
                  icon={ListChecks}
                  title="No focus items yet"
                  description="Focus items are the concrete work inside a goal. Create one to start a session."
                  action={
                    <Button size="sm" asChild>
                      <Link href="/goals">Create a goal</Link>
                    </Button>
                  }
                />
              ) : (
                <>
                  {plannedItems.length > 0 ? (
                    <ItemGroup
                      label="In today's plan"
                      items={plannedItems.map((entry) => ({
                        lineage: entry,
                        meta: (() => {
                          const allocated =
                            plan?.allocations.find(
                              (allocation) =>
                                allocation.focusItemId === entry.item.id,
                            )?.plannedHours ?? 0;
                          const done = actualByItem.get(entry.item.id) ?? 0;
                          return `${formatHours(done)} of ${formatHours(allocated)}`;
                        })(),
                      }))}
                      selectedId={selectedItemId}
                      onSelect={setSelectedItemId}
                    />
                  ) : null}

                  <ItemGroup
                    label="Recommended"
                    items={recommendations
                      .filter(
                        (entry) =>
                          !plannedItems.some(
                            (planned) => planned.item.id === entry.item.id,
                          ),
                      )
                      .map((entry) => {
                        const entryLineage = lineageFor(index, entry.item.id);
                        return entryLineage
                          ? {
                              lineage: entryLineage,
                              meta: entry.reasons[0] ?? "",
                            }
                          : null;
                      })
                      .filter(
                        (entry): entry is NonNullable<typeof entry> =>
                          entry !== null,
                      )}
                    selectedId={selectedItemId}
                    onSelect={setSelectedItemId}
                  />
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div>
                <CardTitle>2 · How long?</CardTitle>
                <CardDescription>
                  Longer blocks score better, but only if you finish them
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {SESSION_PRESETS.map((preset) => (
                <Button
                  key={preset}
                  variant={minutes === preset ? "default" : "outline"}
                  size="sm"
                  onClick={() => setMinutes(preset)}
                  className="min-w-20"
                >
                  {preset} min
                </Button>
              ))}
              {!SESSION_PRESETS.includes(
                minutes as (typeof SESSION_PRESETS)[number],
              ) ? (
                <Button variant="default" size="sm" className="min-w-20">
                  {minutes} min
                </Button>
              ) : null}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div>
                <CardTitle className="flex items-center gap-1.5">
                  <ShieldCheck className="size-3.5" />
                  3 · Pre-focus checklist
                </CardTitle>
                <CardDescription>
                  {readyCount} of {template.length} ready · edit the list in
                  Settings
                </CardDescription>
              </div>
              {template.length > 0 ? (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() =>
                    setChecked(
                      Object.fromEntries(
                        template.map((entry) => [entry.id, true]),
                      ),
                    )
                  }
                >
                  <CheckCheck className="size-3.5" />
                  Check all
                </Button>
              ) : null}
            </CardHeader>
            <CardContent>
              <ul className="grid gap-1.5 sm:grid-cols-2">
                {template.map((entry) => {
                  const isChecked = Boolean(checked[entry.id]);
                  return (
                    <li key={entry.id}>
                      <Label
                        className={cn(
                          "flex cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2.5 text-xs transition-colors",
                          isChecked
                            ? "border-health-excellent/35 bg-health-excellent/8 text-foreground"
                            : "border-border/70 hover:bg-secondary/50",
                        )}
                      >
                        <Checkbox
                          checked={isChecked}
                          onCheckedChange={(value) =>
                            setChecked((current) => ({
                              ...current,
                              [entry.id]: value === true,
                            }))
                          }
                        />
                        {entry.label}
                      </Label>
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="sticky top-20">
            <CardHeader>
              <div>
                <CardTitle>Ready to start</CardTitle>
                <CardDescription>
                  {lineage
                    ? `${minutes} minutes on ${lineage.item.name}`
                    : "Choose a focus item to continue"}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {lineage ? (
                <div className="rounded-xl border border-border/70 bg-card-elevated/50 p-3.5">
                  <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <CategoryDot
                      color={
                        lineage.category
                          ? `var(--${lineage.category.color})`
                          : "var(--chart-1)"
                      }
                    />
                    {lineage.category?.name} · {lineage.goal?.title}
                  </p>
                  <p className="mt-1 text-sm font-medium">{lineage.item.name}</p>
                  {lineage.item.notes ? (
                    <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                      {lineage.item.notes}
                    </p>
                  ) : null}
                </div>
              ) : null}

              <Button
                size="lg"
                className="w-full"
                disabled={!selectedItemId || !allReady}
                onClick={start}
              >
                <Play className="size-4" />
                Start focus session
              </Button>

              {selectedItemId && !allReady ? (
                <button
                  type="button"
                  onClick={start}
                  className="w-full text-center text-[11px] text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
                >
                  Skip the remaining {template.length - readyCount} check
                  {template.length - readyCount === 1 ? "" : "s"} and start anyway
                </button>
              ) : null}
            </CardContent>
          </Card>

          <FocusMusic links={state.settings.musicLinks} />
        </div>
      </div>
    </div>
  );
}

function ItemGroup({
  label,
  items,
  selectedId,
  onSelect,
}: {
  label: string;
  items: {
    lineage: NonNullable<ReturnType<typeof lineageFor>>;
    meta: string;
  }[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  if (items.length === 0) return null;

  return (
    <div className="space-y-1.5">
      <p className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
        {label}
      </p>
      <ul className="space-y-1.5">
        {items.map(({ lineage, meta }) => {
          const active = selectedId === lineage.item.id;
          return (
            <li key={lineage.item.id}>
              <button
                type="button"
                onClick={() => onSelect(lineage.item.id)}
                aria-pressed={active}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl border px-3.5 py-3 text-left transition-colors",
                  active
                    ? "border-primary/45 bg-primary/8"
                    : "border-border/70 hover:border-border hover:bg-secondary/50",
                )}
              >
                <CategoryDot
                  color={
                    lineage.category
                      ? `var(--${lineage.category.color})`
                      : "var(--chart-1)"
                  }
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">
                    {lineage.item.name}
                  </span>
                  <span className="block truncate text-[11px] text-muted-foreground">
                    {meta || lineage.goal?.title}
                  </span>
                </span>
                <PriorityBadge priority={lineage.item.priority} />
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
