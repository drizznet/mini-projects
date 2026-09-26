import type { Goal } from "./types";
import { fromDateKey } from "./utils";

export interface CheckInState {
  state: "upcoming" | "past" | "open";
  enabled: boolean;
  lateByMinutes: number;
  time: string;
}

export function getCheckInState(
  goal: Goal,
  dateKey: string,
  now: number,
): CheckInState {
  const time = goal.scheduledCheckInTime ?? "00:00";
  if (!goal.scheduledCheckInEnabled || !goal.scheduledCheckInTime) {
    return { state: "open", enabled: false, lateByMinutes: 0, time };
  }

  const scheduled = fromDateKey(dateKey);
  const [hours, minutes] = time.split(":").map(Number);
  scheduled.setHours(hours, minutes, 0, 0);
  const minutesFromCheckIn = (now - scheduled.getTime()) / 60_000;
  const grace = goal.strictCheckIn ? 5 : 1;

  if (minutesFromCheckIn < -3) {
    return { state: "upcoming", enabled: true, lateByMinutes: 0, time };
  }
  if (minutesFromCheckIn > grace) {
    return {
      state: "past",
      enabled: true,
      lateByMinutes: Math.max(1, Math.round(minutesFromCheckIn)),
      time,
    };
  }
  return { state: "open", enabled: true, lateByMinutes: 0, time };
}
