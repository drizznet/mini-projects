import {
  BookOpen,
  Briefcase,
  Building2,
  ClipboardList,
  Code,
  Dumbbell,
  GraduationCap,
  Layers,
  Palette,
  Rocket,
  Shapes,
  Sparkles,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";

/**
 * Category icon registry.
 *
 * Categories persist an icon *key* (not a component) so state stays
 * serialisable. Add an entry here to make a new icon pickable in the UI.
 */
export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  graduation: GraduationCap,
  briefcase: Briefcase,
  building: Building2,
  rocket: Rocket,
  clipboard: ClipboardList,
  shapes: Shapes,
  code: Code,
  palette: Palette,
  book: BookOpen,
  dumbbell: Dumbbell,
  users: Users,
  wrench: Wrench,
  layers: Layers,
  sparkles: Sparkles,
};

export const CATEGORY_ICON_KEYS = Object.keys(CATEGORY_ICONS);

export function resolveCategoryIcon(key: string): LucideIcon {
  return CATEGORY_ICONS[key] ?? Layers;
}
