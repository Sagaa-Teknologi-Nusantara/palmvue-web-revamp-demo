"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/cn";

interface ColorOption {
  bg: string;
  fg: string;
  label: string;
}

const COLORS: ColorOption[] = [
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

interface ColorPickerProps {
  value?: { bg: string; fg: string };
  onChange: (value: { bg: string; fg: string }) => void;
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
      {COLORS.map((color) => {
        const isSelected = value?.bg === color.bg && value?.fg === color.fg;

        return (
          <button
            key={color.label}
            type="button"
            className={cn(
              "group relative flex h-10 aspect-square items-center justify-center rounded-md border text-xs font-medium transition-all hover:scale-110",
              isSelected
                ? "ring-primary ring-2 ring-offset-2"
                : "hover:border-primary/50",
            )}
            style={{
              backgroundColor: color.bg,
              color: color.fg,
              borderColor: color.bg,
            }}
            onClick={() => onChange({ bg: color.bg, fg: color.fg })}
            title={color.label}
          >
            {isSelected && <Check className="h-4 w-4" />}
            <span className="sr-only">{color.label}</span>
          </button>
        );
      })}
    </div>
  );
}
