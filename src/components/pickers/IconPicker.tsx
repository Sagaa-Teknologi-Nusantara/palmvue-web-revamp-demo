"use client";

import { Search } from "lucide-react";
import { DynamicIcon, type IconName } from "lucide-react/dynamic";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/cn";
import { getIconDisplayName, ICON_NAMES } from "@/lib/icon-names";

interface IconPickerProps {
  value: string;
  onChange: (value: string) => void;
}

export function IconPicker({ value, onChange }: IconPickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredIcons = useMemo(() => {
    if (!search) return ICON_NAMES;
    const lowerSearch = search.toLowerCase();
    return ICON_NAMES.filter(
      (name) =>
        name.includes(lowerSearch) ||
        getIconDisplayName(name).toLowerCase().includes(lowerSearch),
    );
  }, [search]);

  const displayValue = value
    ? getIconDisplayName(value as IconName)
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
            <DynamicIcon
              name={(value as IconName) || "box"}
              className="h-4 w-4"
            />
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
            {filteredIcons.map((iconName) => (
              <Button
                key={iconName}
                variant="ghost"
                className={cn(
                  "h-10 w-10 p-0",
                  value === iconName && "bg-accent text-accent-foreground",
                )}
                onClick={() => {
                  onChange(iconName);
                  setOpen(false);
                }}
                title={getIconDisplayName(iconName)}
              >
                <DynamicIcon name={iconName} className="h-5 w-5" />
                <span className="sr-only">{getIconDisplayName(iconName)}</span>
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
