import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { Screen } from "@/components/ui/Screen";
import { useThemeColors } from "@/hooks/useThemeColors";
import { listCommitments, type Commitment } from "@/services/commitments";
import { theme } from "@/lib/theme";

const DEMO: Commitment[] = [
  {
    id: "demo-1",
    title: "Ship mobile sync",
    status: "ongoing",
    priority: "high",
    targetHours: 14,
    dailyCommitmentMinutes: 90,
  },
  {
    id: "demo-2",
    title: "Deep work on API",
    status: "ongoing",
    priority: "medium",
    targetHours: 10,
    dailyCommitmentMinutes: 60,
  },
];

export default function CommitmentsScreen() {
  const colors = useThemeColors();
  const [items, setItems] = useState<Commitment[]>(DEMO);
  const [source, setSource] = useState<"demo" | "api">("demo");

  useEffect(() => {
    void listCommitments()
      .then((response) => {
        if (response.data.length > 0) {
          setItems(response.data);
          setSource("api");
        }
      })
      .catch(() => {
        setSource("demo");
      });
  }, []);

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.foreground }]}>Commitments</Text>
        <Text style={[styles.sub, { color: colors.muted }]}>
          {source === "api"
            ? "Loaded from your account."
            : "Sign in on web to sync — showing sample data."}
        </Text>
      </View>
      <View style={styles.list}>
        {items.map((item) => (
          <View
            key={item.id}
            style={[styles.card, { borderColor: colors.border, backgroundColor: colors.card }]}
          >
            <Text style={[styles.cardTitle, { color: colors.foreground }]}>{item.title}</Text>
            <Text style={[styles.cardMeta, { color: colors.muted }]}>
              {item.status} · {item.priority}
              {item.dailyCommitmentMinutes
                ? ` · ${Math.round(item.dailyCommitmentMinutes / 60)}h/day`
                : ""}
            </Text>
          </View>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { gap: 6 },
  title: { fontSize: 28, fontWeight: "700" },
  sub: { fontSize: 14, lineHeight: 21 },
  list: { gap: 10 },
  card: {
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    padding: 16,
    gap: 4,
  },
  cardTitle: { fontSize: 16, fontWeight: "600" },
  cardMeta: { fontSize: 13 },
});
