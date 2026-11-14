import { Pressable, StyleSheet, Text, type PressableProps } from "react-native";

import { useThemeColors } from "@/hooks/useThemeColors";
import { theme } from "@/lib/theme";

export function PrimaryButton({
  label,
  variant = "filled",
  onDark = false,
  ...props
}: PressableProps & {
  label: string;
  variant?: "filled" | "outline" | "ghost";
  onDark?: boolean;
}) {
  const colors = useThemeColors();
  const filled = variant === "filled";
  const outline = variant === "outline";

  return (
    <Pressable
      style={({ pressed }) => [
        styles.base,
        filled && { backgroundColor: onDark ? "#ffffff" : colors.primary },
        outline && {
          borderWidth: 1,
          borderColor: onDark ? "rgba(255,255,255,0.25)" : colors.border,
          backgroundColor: onDark ? "rgba(255,255,255,0.1)" : colors.card,
        },
        variant === "ghost" && { backgroundColor: "transparent" },
        pressed && { opacity: 0.88 },
        props.disabled && { opacity: 0.45 },
      ]}
      {...props}
    >
      <Text
        style={[
          styles.label,
          {
            color: filled
              ? onDark
                ? "#1c1c1c"
                : colors.primaryForeground
              : onDark
                ? "#ffffff"
                : colors.foreground,
          },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignSelf: "flex-start",
    borderRadius: theme.radius.pill,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
  },
});
