import { StyleSheet, Text, View } from "react-native";

import { TodayBriefing } from "@/components/today/TodayBriefing";
import { Screen } from "@/components/ui/Screen";
import { BRAND } from "@/lib/brand";
import { useThemeColors } from "@/hooks/useThemeColors";

export default function TodayScreen() {
  const colors = useThemeColors();

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={[styles.kicker, { color: colors.muted }]}>{BRAND.byline}</Text>
        <Text style={[styles.brand, { color: colors.foreground }]}>{BRAND.name}</Text>
      </View>
      <TodayBriefing />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { gap: 4 },
  kicker: { fontSize: 12, textTransform: "uppercase", letterSpacing: 0.6 },
  brand: { fontSize: 15, fontWeight: "600" },
});
