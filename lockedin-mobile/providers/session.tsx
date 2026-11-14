import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type LiveSession = {
  id: string;
  title: string;
  goalTitle: string;
  categoryName: string;
  plannedMinutes: number;
  startedAt: number;
  pausedAt: number | null;
  accumulatedPauseMs: number;
};

type SessionContextValue = {
  session: LiveSession | null;
  startSession: (input: Omit<LiveSession, "id" | "startedAt" | "pausedAt" | "accumulatedPauseMs">) => void;
  pauseSession: () => void;
  resumeSession: () => void;
  endSession: () => void;
};

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<LiveSession | null>(null);

  const startSession = useCallback(
    (input: Omit<LiveSession, "id" | "startedAt" | "pausedAt" | "accumulatedPauseMs">) => {
      setSession({
        ...input,
        id: `ses_${Date.now()}`,
        startedAt: Date.now(),
        pausedAt: null,
        accumulatedPauseMs: 0,
      });
    },
    [],
  );

  const pauseSession = useCallback(() => {
    setSession((current) =>
      current && !current.pausedAt ? { ...current, pausedAt: Date.now() } : current,
    );
  }, []);

  const resumeSession = useCallback(() => {
    setSession((current) => {
      if (!current?.pausedAt) return current;
      const pauseMs = Date.now() - current.pausedAt;
      return {
        ...current,
        pausedAt: null,
        accumulatedPauseMs: current.accumulatedPauseMs + pauseMs,
      };
    });
  }, []);

  const endSession = useCallback(() => setSession(null), []);

  const value = useMemo(
    () => ({ session, startSession, pauseSession, resumeSession, endSession }),
    [session, startSession, pauseSession, resumeSession, endSession],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useLiveSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useLiveSession must be used within SessionProvider");
  return ctx;
}

export function sessionElapsedMs(session: LiveSession, now: number) {
  const pauseNow = session.pausedAt ? now - session.pausedAt : 0;
  return Math.max(0, now - session.startedAt - session.accumulatedPauseMs - pauseNow);
}
