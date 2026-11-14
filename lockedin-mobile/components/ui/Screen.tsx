import { ScrollView, StyleSheet, View, type ViewProps } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useThemeColors } from "@/hooks/useThemeColors";

export function Screen({
  children,
  scroll = true,
  style,
  ...props
}: ViewProps & { scroll?: boolean }) {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();

  const content = (
    <View
      style={[
        styles.inner,
        { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 16 },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );

  if (!scroll) {
    return <View style={[styles.root, { backgroundColor: colors.background }]}>{content}</View>;
  }

  return (
    <ScrollView
      style={[styles.root, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.scroll}
      showsVerticalScrollIndicator={false}
    >
      {content}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { flexGrow: 1 },
  inner: { paddingHorizontal: 20, gap: 20 },
});
