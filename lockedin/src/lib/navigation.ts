import {
  BarChart3,
  FolderTree,
  LayoutDashboard,
  ListTodo,
  Settings,
  Target,
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
        description: "Today’s focus commitments",
      },
      {
        href: "/work-items",
        label: "Work items",
        icon: ListTodo,
        description: "Plan concrete work across days",
      },
      {
        href: "/sessions",
        label: "Sessions",
        icon: Timer,
        description: "Session history and reflections",
      },
    ],
  },
  {
    label: "Structure",
    items: [
      {
        href: "/categories",
        label: "Categories",
        icon: FolderTree,
        description: "Top-level areas of focus",
      },
      {
        href: "/goals",
        label: "Goals",
        icon: Target,
        description: "Long-term objectives and progress",
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
