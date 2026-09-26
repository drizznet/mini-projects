"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { CalendarDays, Clock3, Flag, Target } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { GOAL_STATUS_LABEL, GOAL_STATUSES, PRIORITIES } from "@/lib/constants";
import { PRIORITY_META } from "@/lib/health";
import type {
  Category,
  CommitmentPeriod,
  Goal,
  GoalStatus,
  Priority,
  WorkFocusMode,
} from "@/lib/types";
import { createId } from "@/lib/utils";

const PERIODS: Array<{
  value: CommitmentPeriod;
  label: string;
  detail: string;
  days: number;
}> = [
  { value: "3d", label: "3 Days", detail: "A quick start", days: 3 },
  { value: "1w", label: "1 Week", detail: "Build a rhythm", days: 7 },
  { value: "1m", label: "1 Month", detail: "A month-long rhythm", days: 30 },
];

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

/** Modern create/edit form for turning a goal into a daily commitment. */
export function GoalDialog({
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
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [status, setStatus] = useState<GoalStatus>("active");
  const [startDate, setStartDate] = useState(today());
  const [commitmentPeriod, setCommitmentPeriod] = useState<CommitmentPeriod>("1w");
  const [dailyHours, setDailyHours] = useState("1");
  const [dailyMinutes, setDailyMinutes] = useState("0");
  const [scheduledCheckInEnabled, setScheduledCheckInEnabled] = useState(false);
  const [scheduledCheckInTime, setScheduledCheckInTime] = useState("09:00");
  const [strictCheckIn, setStrictCheckIn] = useState(false);
  const [workFocusMode, setWorkFocusMode] = useState<WorkFocusMode>("flexible");

  useEffect(() => {
    if (!open) return;
    const initialStart = goal?.startDate ?? today();
    const initialPeriod = goal?.commitmentPeriod ?? "1w";
    const totalMinutes = minutesForGoal(goal, initialPeriod, initialStart);
    setTitle(goal?.title ?? "");
    setDescription(goal?.description ?? "");
    setCategoryId(goal?.categoryId ?? defaultCategoryId ?? categories[0]?.id ?? "");
    setPriority(goal?.priority ?? "medium");
    setStatus(goal?.status ?? "active");
    setStartDate(initialStart);
    setCommitmentPeriod(initialPeriod);
    setDailyHours(String(Math.floor(totalMinutes / 60)));
    setDailyMinutes(String(totalMinutes % 60));
    setScheduledCheckInEnabled(goal?.scheduledCheckInEnabled ?? false);
    setScheduledCheckInTime(goal?.scheduledCheckInTime ?? "09:00");
    setStrictCheckIn(goal?.strictCheckIn ?? false);
    setWorkFocusMode(goal?.workFocusMode ?? "flexible");
  }, [open, goal, defaultCategoryId, categories]);

  const parsedHours = Number(dailyHours);
  const parsedMinutes = Number(dailyMinutes);
  const totalDailyMinutes = parsedHours * 60 + parsedMinutes;
  const valid =
    title.trim().length > 0 &&
    categoryId.length > 0 &&
    startDate >= today() &&
    Number.isInteger(parsedHours) &&
    parsedHours >= 0 &&
    Number.isInteger(parsedMinutes) &&
    parsedMinutes >= 0 &&
    parsedMinutes < 60 &&
    totalDailyMinutes > 0 &&
    (!scheduledCheckInEnabled || scheduledCheckInTime.length > 0);

  const summary = useMemo(() => {
    const days = periodDays(commitmentPeriod, startDate);
    return `${Math.round((totalDailyMinutes * days) / 60 * 10) / 10} total hours over ${days} days`;
  }, [commitmentPeriod, startDate, totalDailyMinutes]);

  const submit = () => {
    if (!valid) return;
    const days = periodDays(commitmentPeriod, startDate);
    onSave({
      id: goal?.id ?? createId("goal"),
      categoryId,
      title: title.trim(),
      description: description.trim(),
      priority,
      status,
      targetHours: (totalDailyMinutes * days) / 60,
      targetDate: endDateFor(startDate, commitmentPeriod),
      workFocusMode,
      createdAt: goal?.createdAt ?? new Date().toISOString(),
      startDate,
      commitmentPeriod,
      dailyCommitmentMinutes: totalDailyMinutes,
      scheduledCheckInEnabled,
      scheduledCheckInTime: scheduledCheckInEnabled ? scheduledCheckInTime : null,
      strictCheckIn: scheduledCheckInEnabled && strictCheckIn,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[92vh] max-w-2xl overflow-y-auto border-border/70 bg-background p-0">
        <DialogHeader className="border-b border-border/60 px-6 pb-5 pt-6 sm:px-8">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Target className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-xl">{goal ? "Edit goal" : "Create a goal"}</DialogTitle>
              <DialogDescription className="mt-1">Shape a meaningful goal into a daily commitment you can keep.</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-7 px-6 py-6 sm:px-8">
          <section className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="goal-title">Title</Label>
              <Input id="goal-title" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Learn C# and .NET" autoFocus className="border-0 bg-secondary/45 shadow-none focus-visible:ring-1" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="goal-description">Description <span className="font-normal text-muted-foreground">(optional)</span></Label>
              <Textarea id="goal-description" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="What would meaningful progress look like?" className="min-h-20 resize-none border-0 bg-secondary/45 shadow-none focus-visible:ring-1" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger className="border-0 bg-secondary/45 shadow-none"><SelectValue placeholder="Pick a category" /></SelectTrigger>
                  <SelectContent>{categories.map((category) => <SelectItem key={category.id} value={category.id}><span className="mr-2 inline-block size-2 rounded-full" style={{ backgroundColor: `var(--${category.color})` }} />{category.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select value={priority} onValueChange={(value) => setPriority(value as Priority)}>
                  <SelectTrigger className="border-0 bg-secondary/45 shadow-none"><Flag className="mr-2 size-4 text-muted-foreground" /><SelectValue /></SelectTrigger>
                  <SelectContent>{PRIORITIES.map((option) => <SelectItem key={option} value={option}>{PRIORITY_META[option].label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div><h3 className="text-sm font-semibold">Start date</h3><p className="text-xs text-muted-foreground">When should this commitment begin?</p></div>
            <div className="relative max-w-xs"><CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input id="goal-start-date" type="date" min={today()} value={startDate} onChange={(event) => setStartDate(event.target.value)} className="border-0 bg-secondary/45 pl-9 shadow-none focus-visible:ring-1" /></div>
          </section>

          <section className="space-y-4">
            <div><h3 className="text-sm font-semibold">Commitment period</h3><p className="text-xs text-muted-foreground">Choose the first stretch you want to show up for.</p></div>
            <RadioGroup value={commitmentPeriod} onValueChange={(value) => setCommitmentPeriod(value as CommitmentPeriod)} className="grid gap-2 sm:grid-cols-3">
              {PERIODS.map((period) => {
                const selected = commitmentPeriod === period.value;
                return (
                  <Label
                    key={period.value}
                    htmlFor={`period-${period.value}`}
                    className={`flex min-w-0 cursor-pointer items-center gap-3 rounded-xl border px-3.5 py-3 transition-colors ${
                      selected
                        ? "border-primary bg-primary/5"
                        : "border-border/70 hover:border-primary/40 hover:bg-secondary/40"
                    }`}
                  >
                    <RadioGroupItem id={`period-${period.value}`} value={period.value} />
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium">{period.label}</span>
                      <span className="mt-0.5 block truncate text-xs text-muted-foreground">{period.detail}</span>
                    </span>
                  </Label>
                );
              })}
            </RadioGroup>
          </section>

          <section className="space-y-4 rounded-2xl border border-border/70 p-4 sm:p-5">
            <div>
              <h3 className="text-sm font-semibold">Work item focus pattern</h3>
              <p className="text-xs text-muted-foreground">
                Decide whether work under this goal can be split across separate sessions.
              </p>
            </div>
            <RadioGroup
              value={workFocusMode}
              onValueChange={(value) => setWorkFocusMode(value as WorkFocusMode)}
              className="grid gap-2 sm:grid-cols-2"
            >
              <Label
                htmlFor="work-focus-flexible"
                className={`cursor-pointer rounded-xl border px-3.5 py-3 transition-colors ${workFocusMode === "flexible" ? "border-primary bg-primary/5" : "border-border/70 hover:border-primary/40 hover:bg-secondary/40"}`}
              >
                <span className="flex items-start gap-3">
                  <RadioGroupItem id="work-focus-flexible" value="flexible" className="mt-0.5" />
                  <span>
                    <span className="block text-sm font-medium">Flexible blocks</span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">Pause and return later, or switch to another work item.</span>
                  </span>
                </span>
              </Label>
              <Label
                htmlFor="work-focus-continuous"
                className={`cursor-pointer rounded-xl border px-3.5 py-3 transition-colors ${workFocusMode === "continuous" ? "border-primary bg-primary/5" : "border-border/70 hover:border-primary/40 hover:bg-secondary/40"}`}
              >
                <span className="flex items-start gap-3">
                  <RadioGroupItem id="work-focus-continuous" value="continuous" className="mt-0.5" />
                  <span>
                    <span className="block text-sm font-medium">One continuous block</span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">Keep this work item in one uninterrupted session.</span>
                  </span>
                </span>
              </Label>
            </RadioGroup>
          </section>

          <section className="space-y-4 rounded-2xl bg-secondary/35 p-4 sm:p-5">
            <div className="flex items-start gap-3"><div className="flex size-9 items-center justify-center rounded-lg bg-background text-primary"><Clock3 className="size-4" /></div><div><h3 className="text-sm font-semibold">Daily commitment</h3><p className="text-xs text-muted-foreground">How much focused time can you protect each day?</p></div></div>
            <div className="flex flex-wrap items-end gap-3"><div className="space-y-2"><Label htmlFor="daily-hours">Hours</Label><Input id="daily-hours" type="number" min={0} max={24} value={dailyHours} onChange={(event) => setDailyHours(event.target.value)} className="w-24 border-0 bg-background shadow-none" /></div><div className="pb-2 text-muted-foreground">:</div><div className="space-y-2"><Label htmlFor="daily-minutes">Minutes</Label><Input id="daily-minutes" type="number" min={0} max={59} value={dailyMinutes} onChange={(event) => setDailyMinutes(event.target.value)} className="w-24 border-0 bg-background shadow-none" /></div><p className="pb-2 text-xs text-muted-foreground">per day · {summary}</p></div>
          </section>

          <section className="space-y-3 rounded-xl border border-border/70 p-4">
            <div><h3 className="text-sm font-semibold">Scheduled check-in</h3><p className="text-xs text-muted-foreground">Set a gentle reminder to review your progress.</p></div>
            <div className="flex items-center gap-3"><Switch checked={scheduledCheckInEnabled} onCheckedChange={setScheduledCheckInEnabled} aria-label="Enable scheduled check-in" />{scheduledCheckInEnabled && <Input type="time" value={scheduledCheckInTime} onChange={(event) => setScheduledCheckInTime(event.target.value)} className="w-[7.5rem]" />}</div>
            {scheduledCheckInEnabled ? (
              <div className="flex items-center justify-between gap-4 rounded-lg bg-secondary/45 p-3">
                <div><p className="text-xs font-medium">Strict check-in</p><p className="text-[11px] text-muted-foreground">Close the session after a 5-minute grace period.</p></div>
                <Switch checked={strictCheckIn} onCheckedChange={setStrictCheckIn} aria-label="Enable strict check-in" />
              </div>
            ) : null}
          </section>

          {goal && <section className="space-y-2"><Label>Status</Label><Select value={status} onValueChange={(value) => setStatus(value as GoalStatus)}><SelectTrigger className="border-0 bg-secondary/45 shadow-none"><SelectValue /></SelectTrigger><SelectContent>{GOAL_STATUSES.map((option) => <SelectItem key={option} value={option}>{GOAL_STATUS_LABEL[option]}</SelectItem>)}</SelectContent></Select></section>}
        </div>

        <DialogFooter className="border-t border-border/60 px-6 py-4 sm:px-8"><Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={submit} disabled={!valid}>{goal ? "Save changes" : "Create goal"}</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
