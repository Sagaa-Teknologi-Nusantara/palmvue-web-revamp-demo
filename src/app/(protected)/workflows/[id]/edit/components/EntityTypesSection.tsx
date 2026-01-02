"use client";

import { Check, ChevronsUpDown, Layers, Plus, X } from "lucide-react";
import { DynamicIcon } from "lucide-react/dynamic";
import { useState } from "react";

import type { EntityTypeOption } from "@/api/types/entity";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/cn";
import { getColorByLabel } from "@/lib/colors";
import type { EntityTypeRef } from "@/types";

interface EntityTypesSectionProps {
  assignedEntityTypes: EntityTypeRef[];
  entityTypeOptions: EntityTypeOption[];
  addEntityTypeIds: string[];
  onAddEntityTypeIdsChange: (ids: string[]) => void;
  includeExisting: boolean;
  onIncludeExistingChange: (value: boolean) => void;
}

export function EntityTypesSection({
  assignedEntityTypes,
  entityTypeOptions,
  addEntityTypeIds,
  onAddEntityTypeIdsChange,
  includeExisting,
  onIncludeExistingChange,
}: EntityTypesSectionProps) {
  const [open, setOpen] = useState(false);

  // Filter out already assigned entity types
  const assignedIds = new Set(assignedEntityTypes.map((et) => et.id));
  const availableEntityTypes = entityTypeOptions.filter(
    (et) => !assignedIds.has(et.id),
  );

  const handleSelect = (id: string) => {
    if (addEntityTypeIds.includes(id)) {
      onAddEntityTypeIdsChange(addEntityTypeIds.filter((i) => i !== id));
    } else {
      onAddEntityTypeIdsChange([...addEntityTypeIds, id]);
    }
  };

  const handleRemove = (id: string) => {
    onAddEntityTypeIdsChange(addEntityTypeIds.filter((i) => i !== id));
    // Reset include existing if no more entity types to add
    if (addEntityTypeIds.length === 1) {
      onIncludeExistingChange(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <span className="bg-primary/10 text-primary rounded-md p-1.5">
            <Layers className="h-4 w-4" />
          </span>
          Entity Types
        </CardTitle>
        <CardDescription>
          Manage entity types assigned to this workflow
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Currently Assigned */}
        {assignedEntityTypes.length > 0 && (
          <div className="space-y-2">
            <Label className="text-muted-foreground">Currently Assigned</Label>
            <div className="flex flex-wrap gap-2">
              {assignedEntityTypes.map((entityType) => {
                const color = getColorByLabel(entityType.color);
                return (
                  <Badge
                    key={entityType.id}
                    variant="secondary"
                    className="flex items-center gap-1.5"
                  >
                    <div
                      className="flex h-4 w-4 items-center justify-center rounded"
                      style={{ backgroundColor: color.bg }}
                    >
                      <DynamicIcon
                        // @ts-expect-error - dynamic icon name
                        name={entityType.icon}
                        className="h-2.5 w-2.5"
                        style={{ color: color.fg }}
                      />
                    </div>
                    {entityType.name}
                  </Badge>
                );
              })}
            </div>
          </div>
        )}

        {assignedEntityTypes.length > 0 && availableEntityTypes.length > 0 && (
          <Separator />
        )}

        {/* Add New Entity Types */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Add Entity Types</Label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className={cn(
                    "w-full justify-between",
                    !addEntityTypeIds.length && "text-muted-foreground",
                  )}
                  disabled={availableEntityTypes.length === 0}
                >
                  {availableEntityTypes.length === 0
                    ? "No more entity types available"
                    : "Select entity types to add..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-0">
                <Command>
                  <CommandInput placeholder="Search entity types..." />
                  <CommandList>
                    <CommandEmpty>No entity type found.</CommandEmpty>
                    <CommandGroup>
                      {availableEntityTypes.map((entityType) => {
                        const isSelected = addEntityTypeIds.includes(
                          entityType.id,
                        );
                        const color = getColorByLabel(entityType.color);
                        return (
                          <CommandItem
                            key={entityType.id}
                            value={entityType.name}
                            onSelect={() => handleSelect(entityType.id)}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                isSelected ? "opacity-100" : "opacity-0",
                              )}
                            />
                            <div
                              className="mr-2 flex h-5 w-5 items-center justify-center rounded"
                              style={{ backgroundColor: color.bg }}
                            >
                              <DynamicIcon
                                // @ts-expect-error - dynamic icon name
                                name={entityType.icon}
                                className="h-3 w-3"
                                style={{ color: color.fg }}
                              />
                            </div>
                            {entityType.name}
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <p className="text-muted-foreground text-xs">
              Search and select entity types to add to this workflow.
            </p>
          </div>

          {/* Added Entity Types Display */}
          {addEntityTypeIds.length > 0 && (
            <div className="bg-muted/30 rounded-lg border p-4">
              <div className="mb-3 flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <Plus className="text-primary h-4 w-4" />
                  Added Entity Types
                  <Badge className="ml-2">{addEntityTypeIds.length}</Badge>
                </Label>
              </div>

              <div className="mb-4 grid max-h-[300px] gap-2 overflow-y-auto pr-2">
                {addEntityTypeIds.map((id) => {
                  const entityType = availableEntityTypes.find(
                    (et) => et.id === id,
                  );
                  if (!entityType) return null;
                  const color = getColorByLabel(entityType.color);
                  return (
                    <div
                      key={id}
                      className="bg-background flex items-center justify-between rounded-md border p-2 shadow-sm"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="flex h-5 w-5 items-center justify-center rounded"
                          style={{ backgroundColor: color.bg }}
                        >
                          <DynamicIcon
                            // @ts-expect-error - dynamic icon name
                            name={entityType.icon}
                            className="h-3 w-3"
                            style={{ color: color.fg }}
                          />
                        </div>
                        <span className="text-sm font-medium">
                          {entityType.name}
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-destructive h-8 w-8 p-0"
                        onClick={() => handleRemove(id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>

              <Separator className="my-4" />

              <div className="flex flex-row items-center space-y-0 space-x-3">
                <Checkbox
                  id="include-existing"
                  checked={includeExisting}
                  onCheckedChange={(checked) =>
                    onIncludeExistingChange(checked === true)
                  }
                />
                <div className="space-y-1 leading-none">
                  <Label htmlFor="include-existing">
                    Apply to Existing Entities
                  </Label>
                  <p className="text-muted-foreground text-xs">
                    Create workflow records for all existing entities of the
                    newly added entity types. This may take a while for large
                    datasets.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
