import type { FocusSession } from "./types";
import { toDateKey } from "./utils";

/** Calendar day a session counts toward (make-up check-ins can differ from `startedAt`). */
export function sessionCalendarDate(session: FocusSession): string {
  return session.checkInDate ?? toDateKey(session.startedAt);
}

export function checkInAttemptCount(
  sessions: FocusSession[],
  focusItemId: string,
  dateKey: string,
): number {
  return sessions.filter(
    (session) =>
      session.focusItemId === focusItemId &&
      sessionCalendarDate(session) === dateKey,
  ).length;
}
