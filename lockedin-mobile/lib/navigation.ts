/** Mirrors lockedin web sidebar labels and routes (web paths for deep links). */
export type NavItem = {
  label: string;
  href: string;
  description: string;
  symbol: { ios: string; android: string; web: string };
};

export const NAV_SECTIONS: { label: string; items: NavItem[] }[] = [
  {
    label: "Focus",
    items: [
      {
        label: "Today",
        href: "/dashboard",
        description: "Today's focus commitments",
        symbol: { ios: "calendar", android: "calendar_today", web: "calendar_today" },
      },
      {
        label: "Calendar",
        href: "/calendar",
        description: "Daily check-ins and focus metrics",
        symbol: { ios: "calendar.badge.clock", android: "event", web: "event" },
      },
      {
        label: "Sessions",
        href: "/sessions",
        description: "Live focus and session history",
        symbol: { ios: "timer", android: "timer", web: "timer" },
      },
    ],
  },
  {
    label: "Structure",
    items: [
      {
        label: "Commitments",
        href: "/commitments",
        description: "Daily time commitments and progress",
        symbol: { ios: "checkmark.seal", android: "verified", web: "verified" },
      },
    ],
  },
  {
    label: "Insight",
    items: [
      {
        label: "Analytics",
        href: "/analytics",
        description: "Trends, patterns and distribution",
        symbol: { ios: "chart.bar", android: "bar_chart", web: "bar_chart" },
      },
      {
        label: "Settings",
        href: "/settings",
        description: "Targets, checklist and pause reasons",
        symbol: { ios: "gearshape", android: "settings", web: "settings" },
      },
    ],
  },
];
