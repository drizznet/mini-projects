import { StyleSheet, Text, View, Pressable } from "react-native";
import { SymbolView } from "expo-symbols";

import { FocusBackdrop } from "@/components/sessions/FocusBackdrop";
import { Screen } from "@/components/ui/Screen";
import { useThemeColors } from "@/hooks/useThemeColors";
import { NAV_SECTIONS } from "@/lib/navigation";
import type { FocusBackdrop as FocusBackdropVariant } from "@/lib/theme";
import { theme } from "@/lib/theme";
import { usePreferences } from "@/providers/preferences";
import { API_BASE_URL, APP_ENVIRONMENT } from "@/config/env";

const BACKDROPS: { value: FocusBackdropVariant; label: string }[] = [
  { value: "gradient", label: "Moving gradients" },
  { value: "pattern", label: "Pattern" },
  { value: "solid", label: "Solid" },
];

export default function MoreScreen() {
  const colors = useThemeColors();
  const { prefs, setFocusBackdrop } = usePreferences();

  return (
    <Screen>
      <Text style={[styles.title, { color: colors.foreground }]}>More</Text>
      <Text style={[styles.sub, { color: colors.muted }]}>
        Same areas as the web sidebar. Focus room background matches Settings → Appearance on web.
      </Text>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Focus room background</Text>
        <View style={styles.backdropRow}>
          {BACKDROPS.map((entry) => {
            const selected = prefs.focusBackdrop === entry.value;
            return (
              <Pressable
                key={entry.value}
                onPress={() => setFocusBackdrop(entry.value)}
                style={[
                  styles.backdropCard,
                  { borderColor: selected ? colors.primary : colors.border },
                ]}
              >
                <View style={styles.backdropPreview}>
                  <FocusBackdrop variant={entry.value} />
                </View>
                <Text
                  style={[
                    styles.backdropLabel,
                    { color: selected ? colors.foreground : colors.muted },
                  ]}
                >
                  {entry.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {NAV_SECTIONS.map((section) => (
        <View key={section.label} style={styles.section}>
          <Text style={[styles.sectionKicker, { color: colors.muted }]}>{section.label}</Text>
          {section.items.map((item) => (
            <View
              key={item.href}
              style={[styles.row, { borderColor: colors.border, backgroundColor: colors.card }]}
            >
              <SymbolView
                name={item.symbol as never}
                tintColor={colors.foreground}
                size={20}
              />
              <View style={styles.rowText}>
                <Text style={[styles.rowTitle, { color: colors.foreground }]}>{item.label}</Text>
                <Text style={[styles.rowDesc, { color: colors.muted }]}>{item.description}</Text>
              </View>
            </View>
          ))}
        </View>
      ))}

      <Text style={[styles.meta, { color: colors.muted }]}>
        API ({APP_ENVIRONMENT}): {API_BASE_URL}
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 28, fontWeight: "700" },
  sub: { fontSize: 14, lineHeight: 21 },
  section: { gap: 10 },
  sectionTitle: { fontSize: 16, fontWeight: "600" },
  sectionKicker: {
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    fontWeight: "600",
  },
  backdropRow: { flexDirection: "row", gap: 8 },
  backdropCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: theme.radius.lg,
    overflow: "hidden",
  },
  backdropPreview: { height: 56, overflow: "hidden" },
  backdropLabel: { fontSize: 11, padding: 8, fontWeight: "600" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: theme.radius.xl,
    borderWidth: 1,
  },
  rowText: { flex: 1, gap: 2 },
  rowTitle: { fontSize: 15, fontWeight: "600" },
  rowDesc: { fontSize: 12, lineHeight: 17 },
  meta: { fontSize: 11, fontFamily: "SpaceMono", marginTop: 8 },
});
