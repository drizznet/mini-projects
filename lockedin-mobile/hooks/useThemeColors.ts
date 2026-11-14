import Colors from "@/constants/Colors";
import { theme } from "@/lib/theme";
import { useColorScheme } from "@/components/useColorScheme";

export function useThemeColors() {
  const scheme = useColorScheme();
  const palette = scheme === "dark" ? theme.dark : theme.light;
  const legacy = Colors[scheme];

  return {
    ...palette,
    tint: legacy.tint,
    scheme,
  };
}
