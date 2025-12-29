"use client";

import { Boxes, Check, ChevronsUpDown, Loader2, X } from "lucide-react";
import { DynamicIcon, type IconName } from "lucide-react/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";

import type { EntityOption } from "@/api/types/entity";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useEntityOptionsQuery,
  useEntityTypeOptionsQuery,
} from "@/hooks/queries";
import { cn } from "@/lib/cn";
import { getColorByLabel } from "@/lib/colors";

interface EntitySelectorProps {
  value: string | null;
  onChange: (id: string | null) => void;
  excludeId?: string;
  placeholder?: string;
  disabled?: boolean;
}

export function EntitySelector({
  value,
  onChange,
  excludeId,
  placeholder = "Select entity...",
  disabled = false,
}: EntitySelectorProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedFilterTypeId, setSelectedFilterTypeId] = useState<string>("");
  const [selectedEntity, setSelectedEntity] = useState<EntityOption | null>(
    null,
  );
  const [selectedEntityTypeId, setSelectedEntityTypeId] = useState<
    string | null
  >(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const { options: entityTypeOptions } = useEntityTypeOptionsQuery();

  const { options: entityOptions, isFetching } = useEntityOptionsQuery({
    search: debouncedSearch || undefined,
    entity_type_id: selectedFilterTypeId || undefined,
  });

  const filteredOptions = useMemo(
    () =>
      excludeId
        ? entityOptions.filter((e) => e.id !== excludeId)
        : entityOptions,
    [entityOptions, excludeId],
  );

  const currentFilterType = useMemo(
    () => entityTypeOptions.find((t) => t.id === selectedFilterTypeId),
    [entityTypeOptions, selectedFilterTypeId],
  );

  const filterTypeColors = useMemo(
    () =>
      currentFilterType
        ? getColorByLabel(currentFilterType.color)
        : { bg: "bg-secondary", fg: "text-secondary-foreground" },
    [currentFilterType],
  );

  const entityType = useMemo(
    () => entityTypeOptions.find((t) => t.id === selectedEntityTypeId),
    [entityTypeOptions, selectedEntityTypeId],
  );

  const entityTypeColors = useMemo(
    () =>
      entityType
        ? getColorByLabel(entityType.color)
        : { bg: "bg-secondary", fg: "text-secondary-foreground" },
    [entityType],
  );

  const handleSelect = useCallback(
    (entity: EntityOption) => {
      setSelectedEntity(entity);
      setSelectedEntityTypeId(selectedFilterTypeId);
      onChange(entity.id);
      setOpen(false);
      setSearch("");
    },
    [onChange, selectedFilterTypeId],
  );

  const handleClear = useCallback(() => {
    setSelectedEntity(null);
    setSelectedEntityTypeId(null);
    onChange(null);
  }, [onChange]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "w-full justify-between px-3 font-normal hover:bg-transparent",
            !selectedEntity && "text-muted-foreground",
          )}
        >
          {selectedEntity ? (
            <div className="flex items-center gap-2 truncate">
              <span
                className="rounded-[4px] px-1.5 py-0.5 font-mono text-[10px] font-medium"
                style={{
                  backgroundColor: entityTypeColors.bg,
                  color: entityTypeColors.fg,
                }}
              >
                {selectedEntity.code}
              </span>
              <span className="truncate text-sm font-medium">
                {selectedEntity.name}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Boxes className="text-muted-foreground/70 h-4 w-4 shrink-0" />
              <span>{placeholder}</span>
            </div>
          )}
          <div className="flex items-center gap-1 opacity-50 transition-opacity hover:opacity-100">
            {selectedEntity && (
              <div
                role="button"
                tabIndex={0}
                className="hover:bg-muted rounded-sm p-0.5"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClear();
                }}
              >
                <X className="h-3 w-3" />
              </div>
            )}
            <ChevronsUpDown className="h-3 w-3 shrink-0" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="p-0 min-w-sm"
        align="start"
        style={{ width: "var(--radix-popover-trigger-width)" }}
      >
        <Command shouldFilter={false} className="max-h-[350px]">
          <div className="bg-muted/30 border-b px-2 py-1.5">
            <Select
              value={selectedFilterTypeId}
              onValueChange={setSelectedFilterTypeId}
            >
              <SelectTrigger className="h-7 w-full border-0 bg-transparent text-xs focus:ring-0">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Type:</span>
                  <SelectValue placeholder="Select type first" />
                </div>
              </SelectTrigger>
              <SelectContent position="popper" sideOffset={4}>
                {entityTypeOptions.map((type) => {
                  const colors = getColorByLabel(type.color);
                  return (
                    <SelectItem key={type.id} value={type.id}>
                      <div className="flex items-center gap-2">
                        <DynamicIcon
                          name={(type.icon as IconName) || "box"}
                          className="h-3 w-3"
                          style={{ color: colors.fg }}
                        />
                        <span className="text-xs">{type.name}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
          <CommandInput
            placeholder={
              selectedFilterTypeId
                ? "Search by name or code..."
                : "Select entity type first..."
            }
            value={search}
            onValueChange={setSearch}
            disabled={!selectedFilterTypeId}
            className="border-none focus:ring-0"
          />
          <CommandList>
            {!selectedFilterTypeId && (
              <div className="flex flex-col items-center gap-3 py-12">
                <div className="bg-muted/50 text-muted-foreground flex h-12 w-12 items-center justify-center rounded-full">
                  <Boxes className="h-6 w-6" />
                </div>
                <div className="flex flex-col items-center gap-1 text-center">
                  <span className="text-sm font-medium">
                    Select an entity type
                  </span>
                  <span className="text-muted-foreground text-xs">
                    Choose a type above to search entities
                  </span>
                </div>
              </div>
            )}
            {selectedFilterTypeId && isFetching && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="text-muted-foreground h-5 w-5 animate-spin" />
              </div>
            )}
            {selectedFilterTypeId &&
              !isFetching &&
              filteredOptions.length === 0 && (
                <CommandEmpty className="py-8 text-center text-sm">
                  {debouncedSearch ? (
                    <div className="flex flex-col items-center gap-1">
                      <span className="font-medium">No entities found</span>
                      <span className="text-muted-foreground">
                        Try adjusting your search
                      </span>
                    </div>
                  ) : (
                    "Type to search entities..."
                  )}
                </CommandEmpty>
              )}
            {selectedFilterTypeId &&
              !isFetching &&
              filteredOptions.length > 0 && (
                <CommandGroup>
                  {filteredOptions.map((entity) => (
                    <CommandItem
                      key={entity.id}
                      value={entity.id}
                      onSelect={() => handleSelect(entity)}
                      className="cursor-pointer py-2.5"
                    >
                      <div className="flex min-w-0 flex-1 items-center gap-2">
                        <span
                          className="shrink-0 rounded-[3px] px-1.5 py-0.5 font-mono text-[10px] font-medium"
                          style={{
                            backgroundColor: filterTypeColors.bg,
                            color: filterTypeColors.fg,
                          }}
                        >
                          {entity.code}
                        </span>
                        <span className="truncate text-sm font-medium">
                          {entity.name}
                        </span>
                      </div>
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4 shrink-0",
                          value === entity.id ? "opacity-100" : "opacity-0",
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
