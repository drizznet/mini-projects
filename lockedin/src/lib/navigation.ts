import {
  BarChart3,
  LayoutDashboard,
  CalendarDays,
  Settings,
  BadgeCheck,
  Timer,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  description: string;
}

export interface NavSection {
  label: string;
  items: NavItem[];
}

/**
 * Sidebar navigation source of truth.
 *
 * Add a route here and it appears in the desktop sidebar, the mobile sheet and
 * the command-style topbar breadcrumb without further wiring.
 */
export const NAV_SECTIONS: NavSection[] = [
  {
    label: "Focus",
    items: [
      {
        href: "/dashboard",
        label: "Today",
        icon: LayoutDashboard,
        description: "Today’s focus plans",
      },
      {
        href: "/calendar",
        label: "Calendar",
        icon: CalendarDays,
        description: "Daily check-ins and focus metrics",
      },
      {
        href: "/lockin",
        label: "Lock in",
        icon: Timer,
        description: "Choose a plan and focus",
      },
    ],
  },
  {
    label: "Structure",
    items: [
      {
        href: "/plans",
        label: "My plans",
        icon: BadgeCheck,
        description: "Daily plans and progress",
      },
    ],
  },
  {
    label: "Insight",
    items: [
      {
        href: "/analytics",
        label: "Analytics",
        icon: BarChart3,
        description: "Trends, patterns and distribution",
      },
      {
        href: "/settings",
        label: "Settings",
        icon: Settings,
        description: "Targets, checklist and pause reasons",
      },
    ],
  },
];

export const NAV_ITEMS: NavItem[] = NAV_SECTIONS.flatMap(
  (section) => section.items,
);

export function findNavItem(pathname: string): NavItem | undefined {
  return NAV_ITEMS.find(
    (item) =>
      pathname === item.href || pathname.startsWith(`${item.href}/`),
  );
}
