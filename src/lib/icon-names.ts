import type { IconName } from "lucide-react/dynamic";

/**
 * Curated list of commonly used icons for the IconPicker.
 * Using a static list instead of importing all icons optimizes bundle size.
 * Icons are loaded on-demand via lucide-react/dynamic.
 */
export const ICON_NAMES: IconName[] = [
  // Objects & Items
  "box",
  "package",
  "archive",
  "briefcase",
  "shopping-bag",
  "shopping-cart",
  "gift",
  "tag",
  "tags",

  // Nature & Environment
  "tree-pine",
  "tree-deciduous",
  "leaf",
  "flower",
  "sun",
  "moon",
  "cloud",
  "droplet",
  "mountain",

  // Buildings & Places
  "building",
  "building-2",
  "home",
  "factory",
  "warehouse",
  "store",
  "landmark",
  "map-pin",

  // People & Users
  "user",
  "users",
  "user-circle",
  "contact",
  "person-standing",

  // Documents & Files
  "file",
  "file-text",
  "folder",
  "clipboard",
  "notebook",
  "book",
  "book-open",

  // Tech & Data
  "database",
  "server",
  "cpu",
  "hard-drive",
  "monitor",
  "smartphone",
  "tablet",
  "laptop",

  // Tools & Actions
  "wrench",
  "hammer",
  "settings",
  "cog",
  "sliders",

  // Communication
  "mail",
  "message-circle",
  "message-square",
  "phone",
  "bell",

  // Transport
  "car",
  "truck",
  "ship",
  "plane",
  "bike",

  // Charts & Analytics
  "bar-chart",
  "pie-chart",
  "trending-up",
  "activity",

  // Status & Indicators
  "check-circle",
  "alert-circle",
  "info",
  "star",
  "heart",
  "flag",

  // Misc Common
  "calendar",
  "clock",
  "globe",
  "link",
  "key",
  "lock",
  "shield",
  "zap",
  "layers",
  "grid",
];

/**
 * Get display name from icon name (kebab-case to Title Case)
 */
export function getIconDisplayName(name: IconName): string {
  return name
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
