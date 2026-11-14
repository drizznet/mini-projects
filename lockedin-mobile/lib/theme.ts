/** Visual tokens aligned with lockedin web `globals.css`. */
export const theme = {
  radius: {
    lg: 12,
    xl: 16,
    sheet: 22,
    pill: 999,
  },
  light: {
    background: "#f4f4f5",
    card: "#ffffff",
    foreground: "#1c1c1c",
    muted: "#6b6b6b",
    border: "#e6e6e6",
    secondary: "#f4f4f5",
    primary: "#292929",
    primaryForeground: "#ffffff",
    focusRoom: "#121212",
  },
  dark: {
    background: "#161616",
    card: "#242424",
    foreground: "#fafafa",
    muted: "#a1a1aa",
    border: "#2a2a2a",
    secondary: "#1c1c1c",
    primary: "#fafafa",
    primaryForeground: "#1c1c1c",
    focusRoom: "#0e0e12",
  },
} as const;

export type FocusBackdrop = "gradient" | "pattern" | "solid";
