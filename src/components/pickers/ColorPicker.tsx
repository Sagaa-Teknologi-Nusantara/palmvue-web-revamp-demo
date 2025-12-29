"use client";

import { Check } from "lucide-react";
import { useMemo } from "react";

import { cn } from "@/lib/cn";
import { COLORS, getColorByLabel } from "@/lib/colors";

interface ColorPickerProps {
  value?: string;
  onChange: (label: string) => void;
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  const selectedColor = useMemo(() => getColorByLabel(value ?? ""), [value]);

  return (
    <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
      {COLORS.map((color) => {
        const isSelected = selectedColor?.label === color.label;

        return (
          <button
            key={color.label}
            type="button"
            className={cn(
              "group relative flex aspect-square h-10 items-center justify-center rounded-md border text-xs font-medium transition-all hover:scale-110",
              isSelected
                ? "ring-primary ring-2 ring-offset-2"
                : "hover:border-primary/50",
            )}
            style={{
              backgroundColor: color.bg,
              color: color.fg,
              borderColor: color.bg
            }}
            onClick={() => onChange(color.label)}
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
