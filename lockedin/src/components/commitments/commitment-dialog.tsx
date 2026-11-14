"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, X } from "lucide-react";
import { toast } from "sonner";

import { CategoryChipPicker } from "@/components/categories/category-chip-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { GOAL_STATUS_LABEL, GOAL_STATUSES } from "@/lib/constants";
import { commitmentToGoal, goalToCommitmentBody } from "@/lib/commitments/mappers";
import { PRIORITY_META } from "@/lib/health";
import type {
  Category,
  CommitmentPeriod,
  Goal,
  GoalStatus,
  Priority,
  WorkFocusMode,
} from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  commitmentErrorMessage,
  useCommitment,
  useCreateCommitment,
  useUpdateCommitment,
} from "@/services/commitments";
import { useCategories } from "@/services/categories";

function capitalizeWordStarts(value: string) {
  return value.replace(
    /(^|\s)(\p{Ll})/gu,
    (_, boundary: string, letter: string) => boundary + letter.toUpperCase(),
  );
}

const PERIODS: Array<{
  value: CommitmentPeriod;
  label: string;
  phrase: string;
  days: number;
}> = [
  { value: "3d", label: "3 days", phrase: "3 days", days: 3 },
  { value: "1w", label: "1 week", phrase: "a week", days: 7 },
  { value: "1m", label: "1 month", phrase: "a month", days: 30 },
];

const TIME_PRESETS = [
  { label: "30m", minutes: 30 },
  { label: "1h", minutes: 60 },
  { label: "1.5h", minutes: 90 },
  { label: "2h", minutes: 120 },
] as const;

const PRIORITY_OPTIONS: Priority[] = ["low", "medium", "high", "critical"];

const today = () => new Date().toISOString().slice(0, 10);

function periodDays(period: CommitmentPeriod, startDate: string) {
  if (period !== "1m") return PERIODS.find((item) => item.value === period)?.days ?? 7;
  const start = new Date(`${startDate}T00:00:00`);
  const nextMonth = new Date(start.getFullYear(), start.getMonth() + 1, start.getDate());
  return Math.max(1, Math.round((nextMonth.getTime() - start.getTime()) / 86_400_000));
}

function endDateFor(startDate: string, period: CommitmentPeriod) {
  const end = new Date(`${startDate}T00:00:00`);
  end.setDate(end.getDate() + periodDays(period, startDate) - 1);
  return end.toISOString().slice(0, 10);
}

function minutesForGoal(goal: Goal | undefined, period: CommitmentPeriod, startDate: string) {
  if (goal?.dailyCommitmentMinutes) return goal.dailyCommitmentMinutes;
  if (goal?.targetHours) {
    return Math.max(15, Math.round((goal.targetHours * 60) / periodDays(period, startDate)));
  }
  return 60;
}

function formatClock(totalMinutes: number) {
  const safe = Math.max(0, totalMinutes);
  const hours = Math.floor(safe / 60);
  const minutes = safe % 60;
  if (hours === 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
}

function formatDay(iso: string) {
  const date = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function formatTime(value: string) {
  const [hourPart, minutePart] = value.split(":");
  const hour = Number(hourPart);
  const minute = Number(minutePart);
  if (!Number.isInteger(hour) || !Number.isInteger(minute)) return value;
  const suffix = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${String(minute).padStart(2, "0")} ${suffix}`;
}

function formatTotalHours(minutes: number) {
  const hours = Math.round((minutes / 60) * 10) / 10;
  return `${hours} ${hours === 1 ? "hour" : "hours"}`;
}

/** Create or edit a commitment in a floating right-side sheet. */
export function CommitmentDialog({
  trigger,
  goal,
  categories,
  defaultCategoryId,
  onSave,
}: {
  trigger: ReactNode;
  goal?: Goal;
  categories: Category[];
  defaultCategoryId?: string;
  onSave: (goal: Goal) => void;
}) {
  const editing = Boolean(goal);
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"compose" | "preview">("compose");
  const [baselineStart, setBaselineStart] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [status, setStatus] = useState<GoalStatus>("active");
  const [startDate, setStartDate] = useState(today());
  const [commitmentPeriod, setCommitmentPeriod] = useState<CommitmentPeriod>("1w");
  const [dailyHours, setDailyHours] = useState("1");
  const [dailyMinutes, setDailyMinutes] = useState("0");
  const [customTime, setCustomTime] = useState(false);
  const [scheduledCheckInEnabled, setScheduledCheckInEnabled] = useState(false);
  const [scheduledCheckInTime, setScheduledCheckInTime] = useState("09:00");
  const [strictCheckIn, setStrictCheckIn] = useState(false);
  const [workFocusMode, setWorkFocusMode] = useState<WorkFocusMode>("flexible");
  const checkInPanelRef = useRef<HTMLDivElement>(null);
  const focusCheckIn = useRef(false);
  const dirty = useRef(false);
  const appliedRemoteKey = useRef<string | null>(null);
  const createCommitment = useCreateCommitment();
  const updateCommitment = useUpdateCommitment();
  const saving = createCommitment.isPending || updateCommitment.isPending;
  const { data: remoteCategories, isLoading: categoriesLoading } = useCategories(open);
  const availableCategories = useMemo<Category[]>(() => {
    const fromRemote =
      remoteCategories?.data.map((item) => ({
        id: item.id,
        name: item.name,
        description: item.description ?? "",
        color: item.color,
        icon: item.icon,
        createdAt: item.createdAt,
      })) ?? null;
    const merged = new Map<string, Category>();
    for (const item of fromRemote ?? categories) {
      merged.set(item.id, item);
    }
    for (const item of categories) {
      merged.set(item.id, item);
    }
    return [...merged.values()];
  }, [categories, remoteCategories]);
  const { data: remoteCommitment } = useCommitment(goal?.id, open && editing);

  const applyGoal = (source: Goal | undefined) => {
    const initialStart = source?.startDate ?? today();
    const initialPeriod = source?.commitmentPeriod ?? "1w";
    const totalMinutes = minutesForGoal(source, initialPeriod, initialStart);
    setBaselineStart(source?.startDate ?? null);
    setStep("compose");
    setTitle(source?.title ?? "");
    setDescription(source?.description ?? "");
    setCategoryId(
      source?.categoryId ??
        defaultCategoryId ??
        availableCategories[0]?.id ??
        "",
    );
    setPriority(source?.priority ?? "medium");
    setStatus(source?.status ?? "active");
    setStartDate(initialStart);
    setCommitmentPeriod(initialPeriod);
    setDailyHours(String(Math.floor(totalMinutes / 60)));
    setDailyMinutes(String(totalMinutes % 60));
    setCustomTime(!TIME_PRESETS.some((preset) => preset.minutes === totalMinutes));
    setScheduledCheckInEnabled(source?.scheduledCheckInEnabled ?? false);
    setScheduledCheckInTime(source?.scheduledCheckInTime ?? "09:00");
    setStrictCheckIn(source?.strictCheckIn ?? false);
    setWorkFocusMode(source?.workFocusMode ?? "flexible");
  };

  useEffect(() => {
    if (!open) {
      dirty.current = false;
      appliedRemoteKey.current = null;
      return;
    }
    dirty.current = false;
    applyGoal(goal);
    // Prefill once when the sheet opens. Later list refreshes must not wipe edits.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!open || editing || categoryId || availableCategories.length === 0) return;
    setCategoryId(availableCategories[0].id);
  }, [availableCategories, categoryId, editing, open]);

  useEffect(() => {
    if (!open || !remoteCommitment || dirty.current) return;
    const remote = remoteCommitment.data;
    const key = `${remote.id}:${remote.updatedAt}`;
    if (appliedRemoteKey.current === key) return;
    appliedRemoteKey.current = key;
    applyGoal(commitmentToGoal(remote));
  }, [open, remoteCommitment]);

  useEffect(() => {
    if (!focusCheckIn.current || !scheduledCheckInEnabled) return;
    focusCheckIn.current = false;
    const frame = requestAnimationFrame(() => {
      checkInPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
    return () => cancelAnimationFrame(frame);
  }, [scheduledCheckInEnabled]);

  const parsedHours = Number(dailyHours);
  const parsedMinutes = Number(dailyMinutes);
  const totalDailyMinutes = parsedHours * 60 + parsedMinutes;
  const minStart =
    editing && baselineStart && baselineStart < today() ? baselineStart : today();
  const valid =
    title.trim().length > 0 &&
    categoryId.length > 0 &&
    startDate >= minStart &&
    Number.isInteger(parsedHours) &&
    parsedHours >= 0 &&
    Number.isInteger(parsedMinutes) &&
    parsedMinutes >= 0 &&
    parsedMinutes < 60 &&
    totalDailyMinutes > 0 &&
    (!scheduledCheckInEnabled || scheduledCheckInTime.length > 0);

  const days = periodDays(commitmentPeriod, startDate);
  const endDate = endDateFor(startDate, commitmentPeriod);
  const period = PERIODS.find((item) => item.value === commitmentPeriod) ?? PERIODS[1];
  const category = availableCategories.find((item) => item.id === categoryId);
  const totalMinutes = totalDailyMinutes * days;

  const sentence = useMemo(() => {
    if (!title.trim()) return "Name what you are showing up for.";
    if (totalDailyMinutes <= 0) return "Choose how long you will protect each day.";
    return `${formatClock(totalDailyMinutes)} a day for ${period.phrase}, through ${formatDay(endDate)}.`;
  }, [endDate, period.phrase, title, totalDailyMinutes]);

  const applyMinutes = (minutes: number) => {
    setCustomTime(false);
    setDailyHours(String(Math.floor(minutes / 60)));
    setDailyMinutes(String(minutes % 60));
  };

  const enableCheckIn = (checked: boolean) => {
    if (checked) focusCheckIn.current = true;
    setScheduledCheckInEnabled(checked);
  };

  const submit = async () => {
    if (!valid || saving) return;
    const body = goalToCommitmentBody({
      id: goal?.id ?? "",
      categoryId,
      title: title.trim(),
      description: description.trim(),
      priority,
      status,
      targetHours: totalMinutes / 60,
      targetDate: endDate,
      workFocusMode,
      createdAt: goal?.createdAt ?? new Date().toISOString(),
      startDate,
      commitmentPeriod,
      dailyCommitmentMinutes: totalDailyMinutes,
      scheduledCheckInEnabled,
      scheduledCheckInTime: scheduledCheckInEnabled ? scheduledCheckInTime : null,
      strictCheckIn: scheduledCheckInEnabled && strictCheckIn,
    });

    try {
      const response = editing && goal
        ? await updateCommitment.mutateAsync({ id: goal.id, body })
        : await createCommitment.mutateAsync(body);
      onSave(commitmentToGoal(response.data));
      setOpen(false);
    } catch (error) {
      toast.error(
        commitmentErrorMessage(
          error,
          editing ? "Could not update this plan." : "Could not create this plan.",
        ),
      );
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent variant="floating" showClose={false}>
        <form
          className="flex min-h-0 flex-1 flex-col overflow-hidden"
          onSubmit={(event) => {
            event.preventDefault();
            submit();
          }}
        >
          <div className="min-h-0 flex-1 overflow-hidden">
            <div
              className="flex h-full w-[200%] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{ transform: step === "preview" ? "translateX(-50%)" : "translateX(0)" }}
            >
              <div className="flex h-full w-1/2 min-w-0 flex-col">
                <header className="shrink-0 px-6 pt-6 pb-5">
                  <div className="flex items-center justify-between gap-3">
                    <SheetTitle className="text-[11px] font-medium tracking-[0.14em] text-muted-foreground uppercase">
                      {goal ? "Edit plan" : "New plan"}
                    </SheetTitle>
                    <SheetClose className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
                      <X className="size-4" />
                      <span className="sr-only">Close</span>
                    </SheetClose>
                  </div>
                  <input
                    id="goal-title"
                    value={title}
                    onChange={(event) => {
                      dirty.current = true;
                      const input = event.currentTarget;
                      const caret = input.selectionStart;
                      setTitle(capitalizeWordStarts(input.value));
                      if (caret == null) return;
                      requestAnimationFrame(() => {
                        input.setSelectionRange(caret, caret);
                      });
                    }}
                    placeholder="What are you showing up for?"
                    autoFocus
                    aria-label="Title"
                    className="mt-5 w-full bg-transparent text-[1.65rem] leading-tight font-semibold tracking-tight text-foreground outline-none placeholder:text-muted-foreground/45"
                  />
                  <SheetDescription className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {sentence}
                  </SheetDescription>
                </header>

                <div
                  className="min-h-0 flex-1 space-y-8 overflow-y-auto px-6 pb-4"
                  onPointerDownCapture={() => {
                    dirty.current = true;
                  }}
                >
                  <section className="space-y-4">
                    <FieldLabel>Stretch</FieldLabel>
                    <RadioGroup
                      value={commitmentPeriod}
                      onValueChange={(value) => setCommitmentPeriod(value as CommitmentPeriod)}
                      className="grid grid-cols-3 gap-1.5 rounded-full bg-secondary p-1.5"
                    >
                      {PERIODS.map((item) => {
                        const selected = commitmentPeriod === item.value;
                        return (
                          <Label
                            key={item.value}
                            htmlFor={`period-${item.value}`}
                            className={cn(
                              "flex h-9 cursor-pointer items-center justify-center rounded-full text-sm transition-colors",
                              selected
                                ? "bg-card font-medium text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground",
                            )}
                          >
                            <RadioGroupItem id={`period-${item.value}`} value={item.value} className="sr-only" />
                            {item.label}
                          </Label>
                        );
                      })}
                    </RadioGroup>
                    <label className="flex items-center justify-between gap-4 rounded-2xl bg-secondary/70 px-4 py-3.5">
                      <span className="text-sm text-muted-foreground">Starts</span>
                      <span className="flex items-center gap-4">
                        <input
                          id="goal-start-date"
                          type="date"
                          min={minStart}
                          value={startDate}
                          onChange={(event) => setStartDate(event.target.value)}
                          className="bg-transparent text-sm font-medium text-foreground outline-none"
                        />
                        <span className="text-xs text-muted-foreground">Ends {formatDay(endDate)}</span>
                      </span>
                    </label>
                  </section>

                  <section className="space-y-4">
                    <FieldLabel>Each day</FieldLabel>
                    <div className="grid grid-cols-5 gap-2" role="radiogroup" aria-label="Daily time">
                      {TIME_PRESETS.map((preset) => {
                        const selected = !customTime && totalDailyMinutes === preset.minutes;
                        return (
                          <button
                            key={preset.label}
                            type="button"
                            role="radio"
                            aria-checked={selected}
                            onClick={() => applyMinutes(preset.minutes)}
                            className={cn(
                              "h-11 rounded-2xl text-sm transition-colors",
                              selected
                                ? "bg-foreground font-medium text-background"
                                : "bg-secondary text-foreground hover:bg-secondary/70",
                            )}
                          >
                            {preset.label}
                          </button>
                        );
                      })}
                      <button
                        type="button"
                        role="radio"
                        aria-checked={customTime}
                        onClick={() => setCustomTime(true)}
                        className={cn(
                          "h-11 rounded-2xl text-sm transition-colors",
                          customTime
                            ? "bg-foreground font-medium text-background"
                            : "bg-secondary text-foreground hover:bg-secondary/70",
                        )}
                      >
                        Custom
                      </button>
                    </div>
                    {customTime ? (
                      <div className="flex items-center gap-3">
                        <Input
                          id="daily-hours"
                          type="number"
                          min={0}
                          max={24}
                          aria-label="Hours"
                          value={dailyHours}
                          onChange={(event) => setDailyHours(event.target.value)}
                          className="h-11 w-20 rounded-2xl border-0 bg-secondary text-center shadow-none"
                        />
                        <span className="text-sm text-muted-foreground">hr</span>
                        <Input
                          id="daily-minutes"
                          type="number"
                          min={0}
                          max={59}
                          aria-label="Minutes"
                          value={dailyMinutes}
                          onChange={(event) => setDailyMinutes(event.target.value)}
                          className="h-11 w-20 rounded-2xl border-0 bg-secondary text-center shadow-none"
                        />
                        <span className="text-sm text-muted-foreground">min</span>
                      </div>
                    ) : null}
                  </section>

                  <section className="space-y-4">
                    <FieldLabel>Category</FieldLabel>
                    <CategoryChipPicker
                      categories={availableCategories}
                      value={categoryId}
                      onChange={setCategoryId}
                      loading={categoriesLoading}
                    />
                  </section>

                  <section className="space-y-4">
                    <FieldLabel>Priority</FieldLabel>
                    <div className="flex flex-wrap gap-2">
                      {PRIORITY_OPTIONS.map((option) => {
                        const meta = PRIORITY_META[option];
                        const selected = priority === option;
                        return (
                          <button
                            key={option}
                            type="button"
                            onClick={() => setPriority(option)}
                            className={cn(
                              "h-9 rounded-full px-3.5 text-sm transition-colors",
                              selected
                                ? cn(meta.bg, meta.text, "font-medium ring-1", meta.border)
                                : "bg-secondary text-muted-foreground hover:text-foreground",
                            )}
                          >
                            {meta.label}
                          </button>
                        );
                      })}
                    </div>
                  </section>

                  {goal ? (
                    <section className="space-y-4">
                      <FieldLabel>Status</FieldLabel>
                      <div className="grid grid-cols-3 gap-1.5 rounded-full bg-secondary p-1.5">
                        {GOAL_STATUSES.map((option) => {
                          const selected = status === option;
                          return (
                            <button
                              key={option}
                              type="button"
                              onClick={() => setStatus(option)}
                              className={cn(
                                "h-9 rounded-full text-sm transition-colors",
                                selected
                                  ? "bg-card font-medium text-foreground shadow-sm"
                                  : "text-muted-foreground hover:text-foreground",
                              )}
                            >
                              {GOAL_STATUS_LABEL[option]}
                            </button>
                          );
                        })}
                      </div>
                    </section>
                  ) : null}

                  <section className="space-y-4">
                    <FieldLabel>Note</FieldLabel>
                    <Textarea
                      id="goal-description"
                      value={description}
                      onChange={(event) => setDescription(event.target.value)}
                      placeholder="A short note about what done looks like"
                      aria-label="Description"
                      className="min-h-24 resize-none rounded-2xl border-0 bg-secondary px-4 py-3 shadow-none focus-visible:ring-1"
                    />
                  </section>

                  <section className="space-y-4">
                    <FieldLabel>How you work</FieldLabel>
                    <RadioGroup
                      value={workFocusMode}
                      onValueChange={(value) => setWorkFocusMode(value as WorkFocusMode)}
                      className="grid grid-cols-2 gap-1.5 rounded-2xl bg-secondary p-1.5"
                    >
                      <ModeChoice id="work-focus-flexible" value="flexible" selected={workFocusMode === "flexible"} label="Flexible" />
                      <ModeChoice id="work-focus-continuous" value="continuous" selected={workFocusMode === "continuous"} label="One block" />
                    </RadioGroup>
                  </section>

                  <section className="space-y-4">
                    <div className="flex items-center justify-between gap-4 rounded-2xl bg-secondary/70 px-4 py-4">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Check-in</p>
                        <p className="text-xs leading-relaxed text-muted-foreground">A time you intend to start.</p>
                      </div>
                      <Switch
                        checked={scheduledCheckInEnabled}
                        onCheckedChange={enableCheckIn}
                        aria-label="Enable scheduled check-in"
                        className="border border-foreground/30 bg-foreground/20 data-[state=checked]:border-transparent data-[state=checked]:bg-primary"
                      />
                    </div>
                    {scheduledCheckInEnabled ? (
                      <div
                        ref={checkInPanelRef}
                        className="space-y-4 rounded-2xl bg-secondary/70 px-4 py-4 ring-1 ring-foreground/10 animate-in fade-in slide-in-from-top-2 duration-300"
                      >
                        <label className="flex items-center justify-between gap-4">
                          <span className="text-sm">Start time</span>
                          <Input
                            id="check-in-time"
                            type="time"
                            value={scheduledCheckInTime}
                            onChange={(event) => setScheduledCheckInTime(event.target.value)}
                            className="h-10 w-[7.75rem] rounded-xl border-0 bg-card shadow-none"
                          />
                        </label>
                        <div className="flex items-center justify-between gap-4 border-t border-border/70 pt-4">
                          <div className="space-y-1">
                            <p className="text-sm font-medium">Strict</p>
                            <p className="text-xs leading-relaxed text-muted-foreground">Close after a 5-minute grace period.</p>
                          </div>
                          <Switch
                            checked={strictCheckIn}
                            onCheckedChange={setStrictCheckIn}
                            aria-label="Enable strict check-in"
                            className="border border-foreground/30 bg-foreground/20 data-[state=checked]:border-transparent data-[state=checked]:bg-primary"
                          />
                        </div>
                      </div>
                    ) : null}
                  </section>
                </div>

                <footer className="shrink-0 px-6 pt-3 pb-6">
                  <Button
                    type="button"
                    className="h-11 w-full rounded-2xl"
                    disabled={!valid || saving}
                    onClick={() => {
                      dirty.current = true;
                      setStep("preview");
                    }}
                  >
                    Continue
                  </Button>
                </footer>
              </div>

              <div className="flex h-full w-1/2 min-w-0 flex-col">
                <header className="shrink-0 px-6 pt-6 pb-5">
                  <div className="flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setStep("compose")}
                      className="inline-flex items-center gap-1 text-[11px] font-medium tracking-[0.14em] text-muted-foreground uppercase transition-colors hover:text-foreground"
                    >
                      <ChevronLeft className="size-3.5" />
                      Back
                    </button>
                    <SheetClose className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
                      <X className="size-4" />
                      <span className="sr-only">Close</span>
                    </SheetClose>
                  </div>
                  <h2 className="mt-5 text-[1.65rem] leading-tight font-semibold tracking-tight">
                    {title.trim() || "Untitled plan"}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{sentence}</p>
                </header>

                <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-6 pb-4">
                  <BreakdownRow label="Each day" value={formatClock(totalDailyMinutes)} />
                  <BreakdownRow label="Stretch" value={`${days} days`} />
                  <BreakdownRow label="Dates" value={`${formatDay(startDate)} – ${formatDay(endDate)}`} />
                  <BreakdownRow label="Total" value={formatTotalHours(totalMinutes)} />
                  <BreakdownRow
                    label="Category"
                    value={
                      category ? (
                        <span className="inline-flex items-center gap-2">
                          <span
                            className="size-1.5 rounded-full"
                            style={{ backgroundColor: `var(--${category.color})` }}
                          />
                          {category.name}
                        </span>
                      ) : (
                        "—"
                      )
                    }
                  />
                  <BreakdownRow label="Priority" value={PRIORITY_META[priority].label} />
                  <BreakdownRow
                    label="Focus"
                    value={workFocusMode === "continuous" ? "One continuous block" : "Flexible blocks"}
                  />
                  <BreakdownRow
                    label="Check-in"
                    value={
                      scheduledCheckInEnabled
                        ? `${formatTime(scheduledCheckInTime)}${strictCheckIn ? " · Strict" : ""}`
                        : "Off"
                    }
                  />
                  {goal ? <BreakdownRow label="Status" value={GOAL_STATUS_LABEL[status]} /> : null}
                  {description.trim() ? (
                    <div className="space-y-2 rounded-2xl bg-secondary/70 px-4 py-4">
                      <p className="text-[11px] font-medium tracking-[0.14em] text-muted-foreground uppercase">Note</p>
                      <p className="text-sm leading-relaxed">{description.trim()}</p>
                    </div>
                  ) : null}
                </div>

                <footer className="shrink-0 px-6 pt-3 pb-6">
                  <Button type="submit" className="h-11 w-full rounded-2xl" disabled={saving}>
                    {saving
                      ? "Saving…"
                      : editing
                        ? "Save plan"
                        : "Create plan"}
                  </Button>
                </footer>
              </div>
            </div>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}

function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-[11px] font-medium tracking-[0.14em] text-muted-foreground uppercase">
      {children}
    </p>
  );
}

function BreakdownRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl bg-secondary/70 px-4 py-3.5">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}

function ModeChoice({
  id,
  value,
  selected,
  label,
}: {
  id: string;
  value: WorkFocusMode;
  selected: boolean;
  label: string;
}) {
  return (
    <Label
      htmlFor={id}
      className={cn(
        "flex h-10 cursor-pointer items-center justify-center rounded-xl text-sm transition-colors",
        selected ? "bg-card font-medium text-foreground shadow-sm" : "text-muted-foreground",
      )}
    >
      <RadioGroupItem id={id} value={value} className="sr-only" />
      {label}
    </Label>
  );
}
