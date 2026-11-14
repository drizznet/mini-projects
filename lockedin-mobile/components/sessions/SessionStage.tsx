import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";

import { FocusBackdrop } from "@/components/sessions/FocusBackdrop";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { formatClock } from "@/lib/format";
import { theme } from "@/lib/theme";
import { sessionElapsedMs, useLiveSession } from "@/providers/session";
import { usePreferences } from "@/providers/preferences";

export function ActiveSessionStage() {
  const { prefs } = usePreferences();
  const { session, pauseSession, resumeSession, endSession } = useLiveSession();
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (!session || session.pausedAt) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [session, session?.pausedAt]);

  if (!session) return <IdleSessionStage />;

  const paused = Boolean(session.pausedAt);
  const elapsed = sessionElapsedMs(session, now);
  const plannedMs = session.plannedMinutes * 60_000;
  const remaining = Math.max(0, plannedMs - elapsed);
  const progress = plannedMs > 0 ? Math.min(1, elapsed / plannedMs) : 0;

  return (
    <View style={styles.stage}>
      <FocusBackdrop variant={prefs.focusBackdrop} paused={paused} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.meta}>
            {session.categoryName} / {session.goalTitle}
          </Text>
          <View style={styles.pill}>
            <View style={[styles.dot, paused && styles.dotPaused]} />
            <Text style={styles.pillText}>{paused ? "Paused" : "In focus"}</Text>
          </View>
        </View>
        <View style={styles.center}>
          <Text style={styles.title}>{session.title}</Text>
          <Text style={styles.clock}>{formatClock(elapsed)}</Text>
          <Text style={styles.sub}>
            {remaining > 0
              ? `${formatClock(remaining)} left of ${session.plannedMinutes} min`
              : "Past target"}
          </Text>
          <View style={styles.barTrack}>
            <View style={[styles.barFill, { width: `${progress * 100}%` }]} />
          </View>
        </View>
        <View style={styles.actions}>
          {paused ? (
            <PrimaryButton label="Resume" onDark onPress={resumeSession} />
          ) : (
            <PrimaryButton label="Pause" variant="outline" onDark onPress={pauseSession} />
          )}
          <PrimaryButton
            label="End session"
            variant="ghost"
            onDark
            onPress={endSession}
          />
        </View>
      </View>
    </View>
  );
}

export function IdleSessionStage() {
  return (
    <View style={styles.idle}>
      <Text style={styles.idleTitle}>No live session</Text>
      <Text style={styles.idleBody}>
        Start from Today’s suggestion and this half of the screen becomes your focus room.
      </Text>
      <PrimaryButton label="Go to Today" onPress={() => router.push("/")} />
    </View>
  );
}

const styles = StyleSheet.create({
  stage: {
    minHeight: 360,
    borderRadius: theme.radius.sheet,
    overflow: "hidden",
    backgroundColor: "#121212",
  },
  content: {
    flex: 1,
    minHeight: 360,
    padding: 22,
    justifyContent: "space-between",
  },
  header: { flexDirection: "row", justifyContent: "space-between", gap: 12 },
  meta: { flex: 1, color: "rgba(255,255,255,0.7)", fontSize: 13 },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: theme.radius.pill,
  },
  pillText: { color: "#fff", fontSize: 12, fontWeight: "600" },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#fff" },
  dotPaused: { backgroundColor: "#fbbf24" },
  center: { alignItems: "center", gap: 8, paddingVertical: 16 },
  title: { color: "#fff", fontSize: 22, fontWeight: "700", textAlign: "center" },
  clock: {
    color: "#fff",
    fontSize: 52,
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
  },
  sub: { color: "rgba(255,255,255,0.65)", fontSize: 14 },
  barTrack: {
    width: "70%",
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.15)",
    marginTop: 8,
    overflow: "hidden",
  },
  barFill: { height: "100%", backgroundColor: "#fff", borderRadius: 2 },
  actions: { flexDirection: "row", gap: 10, justifyContent: "center", flexWrap: "wrap" },
  idle: {
    minHeight: 160,
    borderRadius: theme.radius.sheet,
    borderWidth: 1,
    borderColor: "#e6e6e6",
    backgroundColor: "#fff",
    padding: 22,
    gap: 10,
  },
  idleTitle: { fontSize: 16, fontWeight: "600", color: "#1c1c1c" },
  idleBody: { fontSize: 14, lineHeight: 21, color: "#6b6b6b" },
});
