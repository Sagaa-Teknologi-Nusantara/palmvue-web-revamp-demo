"use client";

import { ChevronDown, Filter, Search, X } from "lucide-react";
import { DynamicIcon } from "lucide-react/dynamic";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEntityTypeOptionsQuery } from "@/hooks/queries";
import { cn } from "@/lib/cn";
import { getColorByLabel } from "@/lib/colors";

interface WorkflowFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedEntityTypeIds: string[];
  onEntityTypeChange: (typeIds: string[]) => void;
}

export function WorkflowFilters({
  searchQuery,
  onSearchChange,
  selectedEntityTypeIds,
  onEntityTypeChange,
}: WorkflowFiltersProps) {
  const { options: entityTypeOptions } = useEntityTypeOptionsQuery();

  const handleToggle = (id: string) => {
    if (selectedEntityTypeIds.includes(id)) {
      onEntityTypeChange(selectedEntityTypeIds.filter((i) => i !== id));
    } else {
      onEntityTypeChange([...selectedEntityTypeIds, id]);
    }
  };

  const handleClearAll = () => {
    onEntityTypeChange([]);
  };

  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row">
      <div className="relative flex-1">
        <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
        <Input
          placeholder="Search workflows..."
          className="bg-background pl-9"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="bg-background h-9 min-w-[200px] justify-between"
          >
            <div className="flex items-center gap-2">
              <Filter className="text-muted-foreground h-4 w-4" />
              {selectedEntityTypeIds.length === 0 ? (
                <span className="text-muted-foreground">All Entity Types</span>
              ) : (
                <span className="text-foreground">
                  {selectedEntityTypeIds.length} selected
                </span>
              )}
            </div>
            <ChevronDown className="text-muted-foreground h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" align="end">
          <div className="border-border flex items-center justify-between border-b px-3 py-2">
            <span className="text-sm font-medium">Filter by Entity Type</span>
            {selectedEntityTypeIds.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearAll}
                className="text-muted-foreground hover:text-foreground h-auto px-2 py-1 text-xs"
              >
                Clear all
              </Button>
            )}
          </div>
          <ScrollArea className="max-h-[280px]">
            <div className="p-2">
              {entityTypeOptions.map((et) => {
                const color = getColorByLabel(et.color);
                const isSelected = selectedEntityTypeIds.includes(et.id);

                return (
                  <div
                    key={et.id}
                    className={cn(
                      "hover:bg-muted/60 flex cursor-pointer items-center gap-3 rounded-md px-2 py-2 transition-colors",
                      isSelected && "bg-muted/40",
                    )}
                    onClick={() => handleToggle(et.id)}
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => handleToggle(et.id)}
                      className="pointer-events-none"
                    />
                    <div
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md"
                      style={{ backgroundColor: color.bg }}
                    >
                      <DynamicIcon
                        // @ts-expect-error - dynamic icon name from API
                        name={et.icon}
                        className="h-4 w-4"
                        style={{ color: color.fg }}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-foreground truncate text-sm font-medium">
                        {et.name}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {et.prefix}
                      </p>
                    </div>
                  </div>
                );
              })}
              {entityTypeOptions.length === 0 && (
                <div className="text-muted-foreground py-6 text-center text-sm">
                  No entity types available
                </div>
              )}
            </div>
          </ScrollArea>
        </PopoverContent>
      </Popover>
    </div>
  );
}
