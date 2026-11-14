import { StyleSheet, Text, View } from "react-native";

import { ActiveSessionStage } from "@/components/sessions/SessionStage";
import { Screen } from "@/components/ui/Screen";
import { useThemeColors } from "@/hooks/useThemeColors";

export default function SessionsScreen() {
  const colors = useThemeColors();

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.foreground }]}>Sessions</Text>
        <Text style={[styles.sub, { color: colors.muted }]}>
          Live focus room on top, history on the way — aligned with the web app.
        </Text>
      </View>
      <ActiveSessionStage />
      <View style={[styles.history, { borderColor: colors.border, backgroundColor: colors.card }]}>
        <Text style={[styles.historyTitle, { color: colors.foreground }]}>History</Text>
        <Text style={[styles.historyBody, { color: colors.muted }]}>
          Completed sessions from the API and local store will appear here, matching the web
          sessions page.
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { gap: 6 },
  title: { fontSize: 28, fontWeight: "700" },
  sub: { fontSize: 14, lineHeight: 21 },
  history: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 20,
    gap: 8,
  },
  historyTitle: { fontSize: 18, fontWeight: "600" },
  historyBody: { fontSize: 14, lineHeight: 21 },
});
