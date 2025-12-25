export interface ColorOption {
  bg: string;
  fg: string;
  label: string;
}

export const COLORS: ColorOption[] = [
  { bg: "#f5f5f5", fg: "#525252", label: "Neutral" },
  { bg: "#fca5a5", fg: "#b91c1c", label: "Red" },
  { bg: "#fdba74", fg: "#c2410c", label: "Orange" },
  { bg: "#fcd34d", fg: "#b45309", label: "Amber" },
  { bg: "#fde047", fg: "#a16207", label: "Yellow" },
  { bg: "#bef264", fg: "#4d7c0f", label: "Lime" },
  { bg: "#86efac", fg: "#15803d", label: "Green" },
  { bg: "#6ee7b7", fg: "#047857", label: "Emerald" },
  { bg: "#5eead4", fg: "#0f766e", label: "Teal" },
  { bg: "#67e8f9", fg: "#0e7490", label: "Cyan" },
  { bg: "#7dd3fc", fg: "#0369a1", label: "Sky" },
  { bg: "#93c5fd", fg: "#1d4ed8", label: "Blue" },
  { bg: "#a5b4fc", fg: "#4338ca", label: "Indigo" },
  { bg: "#c4b5fd", fg: "#6d28d9", label: "Violet" },
  { bg: "#d8b4fe", fg: "#7e22ce", label: "Purple" },
  { bg: "#f0abfc", fg: "#a21caf", label: "Fuchsia" },
  { bg: "#f9a8d4", fg: "#be185d", label: "Pink" },
  { bg: "#fda4af", fg: "#be123c", label: "Rose" },
];

export function getColorByLabel(label: string): ColorOption {
  const target = label.toLowerCase();

  return COLORS.find((c) => c.label.toLowerCase() === target) ?? COLORS[0];
}
