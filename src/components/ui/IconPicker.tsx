"use client";

import { useState, useMemo } from "react";
import * as LucideIcons from "lucide-react";
import { LucideIcon, Search } from "lucide-react";
import { cn, toKebabCase, toPascalCase } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface IconPickerProps {
  value: string;
  onChange: (value: string) => void;
}

export function IconPicker({ value, onChange }: IconPickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const iconList = useMemo(() => {
    const excluded = new Set(["icons", "createLucideIcon"]);
    return Object.entries(LucideIcons)
      .filter(([name, component]) => {
        if (excluded.has(name)) return false;
        if (!isNaN(Number(name))) return false;
        if (name.endsWith("Icon")) return false; // Filter out *Icon duplicates
        return (
          typeof component === "object" &&
          component !== null &&
          "$$typeof" in component
        );
      })
      .map(([pascalName, Icon]) => ({
        pascalName,
        kebabName: toKebabCase(pascalName),
        displayName: pascalName.replace(/([A-Z])/g, " $1").trim(),
        Icon: Icon as LucideIcon,
      }));
  }, []);

  const filteredIcons = useMemo(() => {
    if (!search) return iconList.slice(0, 100);
    const lowerSearch = search.toLowerCase();
    return iconList
      .filter(
        (icon) =>
          icon.displayName.toLowerCase().includes(lowerSearch) ||
          icon.kebabName.includes(lowerSearch),
      )
      .slice(0, 100);
  }, [search, iconList]);

  const pascalValue = value ? toPascalCase(value) : "";
  const SelectedIcon =
    (LucideIcons as unknown as Record<string, LucideIcon>)[pascalValue] ||
    LucideIcons.Box;
  const displayValue = value
    ? pascalValue.replace(/([A-Z])/g, " $1").trim()
    : "Select icon...";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          <span className="flex items-center gap-2">
            <SelectedIcon className="h-4 w-4" />
            <span className="truncate">{displayValue}</span>
          </span>
          <Search className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <div className="p-2">
          <Input
            placeholder="Search icons..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8"
          />
        </div>
        <ScrollArea className="h-[300px] p-2">
          <div className="grid grid-cols-5 gap-2">
            {filteredIcons.map(({ pascalName, kebabName, Icon }) => (
              <Button
                key={pascalName}
                variant="ghost"
                className={cn(
                  "h-10 w-10 p-0",
                  value === kebabName && "bg-accent text-accent-foreground",
                )}
                onClick={() => {
                  onChange(kebabName);
                  setOpen(false);
                }}
                title={pascalName.replace(/([A-Z])/g, " $1").trim()}
              >
                <Icon className="h-5 w-5" />
                <span className="sr-only">{pascalName}</span>
              </Button>
            ))}
          </div>
          {filteredIcons.length === 0 && (
            <div className="text-muted-foreground py-6 text-center text-sm">
              No icons found.
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
