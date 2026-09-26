"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  BellRing,
  ChevronDown,
  LogOut,
  Menu,
  Plus,
  Radio,
  Settings,
  Timer,
  UserRound,
} from "lucide-react";

import { GoalDialog } from "@/components/goals/goal-dialog";
import { SidebarContent } from "@/components/layout/sidebar-content";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { findNavItem } from "@/lib/navigation";
import { BRAND } from "@/lib/brand";
import { clearLocalAuthSession } from "@/lib/auth";
import { buildIndex, dailySessionsForDate, lineageFor } from "@/lib/selectors";
import { sessionActiveMs } from "@/lib/analytics";
import { formatClock, fromDateKey, formatTime } from "@/lib/utils";
import { useFocusData } from "@/hooks/use-focus-data";
import { useCurrentUser } from "@/services/auth";
import { useFocusStore } from "@/lib/store/focus-store";
import { toast } from "sonner";

/** Top bar: mobile navigation, current section, start CTA. */
export function AppTopbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const current = findNavItem(pathname);
  const { data: user } = useCurrentUser();
  const { state, actions } = useFocusStore();
  const { now, todayKey } = useFocusData({ tickMs: 30_000 });
  const displayName = user?.profile?.displayName ?? user?.email?.split("@")[0] ?? "Profile";
  const initials = displayName.slice(0, 2).toUpperCase();
  const CurrentIcon = current?.icon;
  const activeSession =
    state.sessions.find(
      (session) =>
        session.id === state.activeSessionId &&
        (session.status === "running" || session.status === "paused"),
    ) ?? null;
  const activeLineage = activeSession
    ? lineageFor(buildIndex(state), activeSession.focusItemId)
    : undefined;
  const checkInReminder = dailySessionsForDate(state, todayKey)
    .filter(
      (session) =>
        session.scheduledCheckInEnabled &&
        session.scheduledCheckInTime &&
        !state.sessions.some(
          (entry) =>
            entry.dailySessionId === session.id &&
            (entry.status === "running" || entry.status === "paused"),
        ),
    )
    .map((session) => {
      const scheduled = fromDateKey(session.date);
      const [hours, minutes] = session.scheduledCheckInTime!.split(":").map(Number);
      scheduled.setHours(hours, minutes, 0, 0);
      const minutesUntil = (scheduled.getTime() - now) / 60_000;
      return { session, minutesUntil };
    })
    .filter(({ minutesUntil, session }) => {
      const grace = session.strictCheckIn ? 5 : 1;
      return minutesUntil <= 5 && minutesUntil >= -grace;
    })
    .sort((a, b) => a.minutesUntil - b.minutesUntil)[0];
  const reminderGoal = checkInReminder
    ? state.goals.find((goal) => goal.id === checkInReminder.session.goalId)
    : undefined;
  const reminderFocusItem = reminderGoal
    ? state.focusItems.find((item) => item.goalId === reminderGoal.id)
    : undefined;

  return (
    <header className="relative sticky top-0 z-30 flex h-14 shrink-0 items-center gap-4 border-b border-border bg-background/85 px-5 backdrop-blur-md lg:px-8">
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="size-4" />
            <span className="sr-only">Open navigation</span>
          </Button>
        </SheetTrigger>
        <SheetContent className="p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SidebarContent mobile onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 items-center gap-3">
        <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
          {CurrentIcon ? <CurrentIcon className="size-4" /> : <UserRound className="size-4" />}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">
            {current?.label ?? BRAND.name}
          </p>
          <p className="hidden truncate text-[11px] text-muted-foreground sm:block">
            {current?.description}
          </p>
        </div>
      </div>

      {pathname !== "/dashboard" && state.settings.sessionIslandDisplay === "navbar" && activeSession ? (
        <Link
          href="/focus/session"
          className="group absolute left-1/2 hidden h-9 -translate-x-1/2 items-center gap-2 overflow-hidden rounded-full border-2 border-primary/45 bg-primary/12 px-3.5 text-[11px] text-primary shadow-md shadow-primary/15 ring-2 ring-primary/10 transition-[height,padding,box-shadow,background-color] duration-300 ease-out hover:h-12 hover:bg-primary/18 hover:px-4 hover:shadow-lg hover:shadow-primary/25 md:flex"
          aria-label={`Open active session: ${activeLineage?.item.name ?? "Focus session"}`}
        >
          <span className="relative grid size-5 shrink-0 place-items-center rounded-full bg-primary/12 transition-transform duration-300 group-hover:scale-110">
            <Radio className="size-3.5 animate-pulse" />
          </span>
          <span className="whitespace-nowrap font-medium transition-transform duration-300 group-hover:-translate-y-0.5">
            {activeSession.status === "paused" ? "SESSION PAUSED" : "FOCUS LIVE"}
          </span>
          <span className="hidden max-w-40 truncate text-muted-foreground transition-transform duration-300 group-hover:-translate-y-0.5 lg:inline">
            · {activeLineage?.item.name ?? "Focus session"}
          </span>
          <span className="inline-flex shrink-0 items-center gap-1 tabular font-medium text-foreground transition-[font-size,transform] duration-300 group-hover:scale-110 group-hover:text-sm group-hover:font-semibold">
            <Timer className="size-3" />
            {formatClock(sessionActiveMs(activeSession, now))}
          </span>
        </Link>
      ) : checkInReminder && reminderGoal ? (
        <Link
          href={`/dashboard?goal=${encodeURIComponent(reminderGoal.id)}&focus=${encodeURIComponent(reminderFocusItem?.id ?? "")}`}
          className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-2 rounded-full border border-health-slipping/25 bg-health-slipping/10 px-2.5 py-1 text-[11px] text-health-behind transition-colors hover:bg-health-slipping/15 md:flex"
          aria-label={`Check in soon for ${reminderFocusItem?.name ?? reminderGoal.title}`}
        >
          <span className="relative grid size-5 place-items-center rounded-full bg-health-slipping/15">
            <BellRing className="size-3 text-health-behind" />
            <span className="absolute -right-0.5 -top-0.5 size-1.5 animate-pulse rounded-full bg-health-behind ring-2 ring-background" />
          </span>
          <span className="font-medium">Check in soon</span>
          <span className="hidden text-muted-foreground lg:inline">
            · {formatTime(`1970-01-01T${checkInReminder.session.scheduledCheckInTime ?? "00:00"}:00`)}
          </span>
        </Link>
      ) : null}

      <div className="ml-auto flex items-center gap-2.5">
        <GoalDialog
          categories={state.categories}
          trigger={
            <Button
              size="sm"
              variant="subtle"
              className="border-primary/25 text-primary hover:border-primary/40 hover:bg-primary/8"
              disabled={state.categories.length === 0}
            >
              <Plus className="size-3.5" />
              <span className="hidden sm:inline">New goal</span>
            </Button>
          }
          onSave={(goal) => {
            actions.saveGoal(goal);
            toast.success(`Created ${goal.title}`);
          }}
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-1.5 px-2" aria-label="Open profile menu">
              <span className="grid size-7 place-items-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                {initials}
              </span>
              <ChevronDown className="size-3.5 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64 overflow-hidden p-0">
            <div className="flex items-center gap-3 bg-secondary/35 px-3 py-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                {initials}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{displayName}</p>
                {user?.email ? <p className="truncate text-xs text-muted-foreground">{user.email}</p> : null}
              </div>
            </div>
            <DropdownMenuSeparator />
            <div className="p-1">
              <DropdownMenuItem onClick={() => router.push("/settings")}>
                <Settings /> Settings
                <kbd className="ml-auto rounded border border-border bg-background px-1.5 py-0.5 text-[10px] text-muted-foreground">⌘,</kbd>
              </DropdownMenuItem>
            </div>
            <div className="border-t border-border p-1">
              <DropdownMenuItem
                variant="destructive"
                onClick={() => {
                  clearLocalAuthSession();
                  router.replace("/login");
                }}
              >
                <LogOut /> Log out
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
