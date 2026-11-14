import { StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";

import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { DEMO_RECOMMENDATIONS, DEMO_STATS } from "@/lib/demo-today";
import { formatHours, greetingFor } from "@/lib/format";
import { useThemeColors } from "@/hooks/useThemeColors";
import { theme } from "@/lib/theme";
import { useLiveSession } from "@/providers/session";
import { usePreferences } from "@/providers/preferences";

function dayRead(liveName: string | null, paused: boolean) {
  const { activeCommitments, focusedHours, remainingHours, interruptions } = DEMO_STATS;
  if (liveName) {
    return `You are ${paused ? "paused on" : "in"} ${liveName}. ${formatHours(focusedHours)} is logged today, and ${formatHours(remainingHours)} of the plan is still open.`;
  }
  if (activeCommitments === 0) {
    return "Nothing is in motion yet. A commitment gives today something to protect.";
  }
  const breaks =
    interruptions > 0
      ? ` ${interruptions} interruption${interruptions === 1 ? "" : "s"} pulled time away.`
      : "";
  return `${activeCommitments} active commitments. ${formatHours(focusedHours)} focused so far, ${formatHours(remainingHours)} still open.${breaks}`;
}

export function TodayBriefing() {
  const colors = useThemeColors();
  const { prefs } = usePreferences();
  const { session, startSession } = useLiveSession();
  const now = new Date();
  const top = DEMO_RECOMMENDATIONS[0];
  const rest = DEMO_RECOMMENDATIONS.slice(1);
  const liveName = session?.title ?? null;
  const paused = Boolean(session?.pausedAt);

  return (
    <View style={styles.grid}>
      <View
        style={[
          styles.overview,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <Text style={[styles.kicker, { color: colors.muted }]}>
          {now.toLocaleDateString(undefined, {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </Text>
        <Text style={[styles.title, { color: colors.foreground }]}>
          {greetingFor(now.getHours())}, {prefs.displayName}
        </Text>
        <Text style={[styles.body, { color: colors.muted }]}>{dayRead(liveName, paused)}</Text>
        <View style={styles.stats}>
          <Stat label="Focused" value={formatHours(DEMO_STATS.focusedHours)} colors={colors} />
          <Stat label="Still open" value={formatHours(DEMO_STATS.remainingHours)} colors={colors} />
          <Stat label="Commitments" value={String(DEMO_STATS.activeCommitments)} colors={colors} />
          <Stat label="Breaks" value={String(DEMO_STATS.interruptions)} colors={colors} />
        </View>
      </View>

      <View style={styles.suggestion}>
        <Text style={styles.suggestionKicker}>Suggested next</Text>
        {liveName ? (
          <>
            <Text style={styles.suggestionTitle}>Stay with this session</Text>
            <Text style={styles.suggestionBody}>
              {liveName} is already open. Finish or pause it before starting something else.
            </Text>
            <PrimaryButton label="Open focus room" onPress={() => router.push("/sessions")} />
          </>
        ) : top ? (
          <>
            <Text style={styles.suggestionMeta}>
              {top.categoryName} / {top.goalTitle}
            </Text>
            <Text style={styles.suggestionTitle}>{top.itemName}</Text>
            <Text style={styles.suggestionBody}>
              {top.reason}. A {top.suggestedMinutes}-minute block fits what is left.
            </Text>
            <PrimaryButton
              label={`Start ${top.suggestedMinutes} min`}
              onPress={() => {
                startSession({
                  title: top.itemName,
                  goalTitle: top.goalTitle,
                  categoryName: top.categoryName,
                  plannedMinutes: top.suggestedMinutes,
                });
                router.push("/sessions");
              }}
            />
            {rest.map((entry) => (
              <Text key={entry.id} style={styles.alt}>
                {entry.itemName} · {entry.suggestedMinutes}m
              </Text>
            ))}
          </>
        ) : null}
      </View>
    </View>
  );
}

function Stat({
  label,
  value,
  colors,
}: {
  label: string;
  value: string;
  colors: ReturnType<typeof useThemeColors>;
}) {
  return (
    <View style={[styles.stat, { backgroundColor: colors.secondary }]}>
      <Text style={[styles.statLabel, { color: colors.muted }]}>{label}</Text>
      <Text style={[styles.statValue, { color: colors.foreground }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { gap: 16 },
  overview: {
    borderRadius: theme.radius.sheet,
    borderWidth: 1,
    padding: 22,
    gap: 12,
  },
  kicker: {
    fontSize: 11,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    fontWeight: "600",
  },
  title: { fontSize: 28, fontWeight: "700" },
  body: { fontSize: 16, lineHeight: 24 },
  stats: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 8 },
  stat: {
    width: "47%",
    borderRadius: theme.radius.xl,
    padding: 12,
  },
  statLabel: { fontSize: 11 },
  statValue: { fontSize: 18, fontWeight: "700", marginTop: 4 },
  suggestion: {
    backgroundColor: "#1c1c1c",
    borderRadius: theme.radius.sheet,
    padding: 22,
    gap: 10,
  },
  suggestionKicker: {
    fontSize: 11,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.55)",
    fontWeight: "600",
  },
  suggestionMeta: { fontSize: 12, color: "rgba(255,255,255,0.5)" },
  suggestionTitle: { fontSize: 22, fontWeight: "700", color: "#fff" },
  suggestionBody: { fontSize: 14, lineHeight: 21, color: "rgba(255,255,255,0.72)" },
  alt: { fontSize: 13, color: "rgba(255,255,255,0.55)", marginTop: 4 },
});
