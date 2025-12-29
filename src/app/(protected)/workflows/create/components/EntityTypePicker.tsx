"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import { DynamicIcon } from "lucide-react/dynamic";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { FormLabel } from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEntityTypeOptionsQuery } from "@/hooks/queries";
import { cn } from "@/lib/cn";
import { getColorByLabel } from "@/lib/colors";

interface EntityTypePickerProps {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}

export function EntityTypePicker({
  selectedIds,
  onChange,
}: EntityTypePickerProps) {
  const [open, setOpen] = useState(false);
  const { options: entityTypeOptions } = useEntityTypeOptionsQuery();

  const selectedEntityTypes = entityTypeOptions.filter((et) =>
    selectedIds.includes(et.id),
  );

  const toggleEntityType = (id: string) => {
    onChange(
      selectedIds.includes(id)
        ? selectedIds.filter((i) => i !== id)
        : [...selectedIds, id],
    );
  };

  return (
    <div className="space-y-2">
      <FormLabel>Entity Types</FormLabel>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className="h-auto min-h-10 w-full justify-between"
          >
            {selectedEntityTypes.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {selectedEntityTypes.map((et) => {
                  const color = getColorByLabel(et.color);
                  return (
                    <Badge
                      key={et.id}
                      variant="secondary"
                      className="gap-1"
                      style={{
                        backgroundColor: color.bg,
                        color: color.fg,
                      }}
                    >
                      <DynamicIcon
                        // @ts-expect-error - dynamic icon
                        name={et.icon}
                        className="h-3 w-3"
                      />
                      {et.name}
                    </Badge>
                  );
                })}
              </div>
            ) : (
              <span className="text-muted-foreground">
                Select entity types...
              </span>
            )}
            <ChevronsUpDown className="text-muted-foreground ml-2 h-4 w-4 shrink-0" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="start">
          <Command>
            <CommandInput placeholder="Search entity types..." />
            <CommandList>
              <CommandEmpty>No entity types found.</CommandEmpty>
              <CommandGroup>
                {entityTypeOptions.map((et) => {
                  const color = getColorByLabel(et.color);
                  const isSelected = selectedIds.includes(et.id);
                  return (
                    <CommandItem
                      key={et.id}
                      value={et.name}
                      onSelect={() => toggleEntityType(et.id)}
                    >
                      <div
                        className={cn(
                          "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border",
                          isSelected
                            ? "border-primary bg-primary"
                            : "border-muted-foreground/30",
                        )}
                      >
                        {isSelected && (
                          <Check className="text-primary-foreground h-2 w-2 scale-75" />
                        )}
                      </div>
                      <div
                        className="mr-2 flex h-5 w-5 items-center justify-center rounded"
                        style={{ backgroundColor: color.bg }}
                      >
                        <DynamicIcon
                          // @ts-expect-error - dynamic icon
                          name={et.icon}
                          className="h-3 w-3"
                          style={{ color: color.fg }}
                        />
                      </div>
                      {et.name}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <p className="text-muted-foreground text-xs">
        Assign this workflow to entity types.
      </p>
    </div>
  );
}
