"use client";

import { Search } from "lucide-react";

import type { EntityTypeOption } from "@/api/types/entity";
import { EntitySelector } from "@/components/entities/EntitySelector";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EntityFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedType: string;
  onTypeChange: (typeId: string) => void;
  entityTypeOptions: EntityTypeOption[];
  selectedParent: string | null;
  onParentChange: (parentId: string | null) => void;
}

export function EntityFilters({
  searchQuery,
  onSearchChange,
  selectedType,
  onTypeChange,
  entityTypeOptions,
  selectedParent,
  onParentChange,
}: EntityFiltersProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row">
      <div className="relative flex-1">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <Input
          placeholder="Search by name or code..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="bg-background pl-9"
        />
      </div>

      <Select value={selectedType} onValueChange={onTypeChange}>
        <SelectTrigger className="bg-background w-full sm:w-[180px]">
          <SelectValue placeholder="All Entity Types" />
        </SelectTrigger>
        <SelectContent position="popper" sideOffset={4}>
          <SelectItem value="all">All Entity Types</SelectItem>
          {entityTypeOptions.map((type) => (
            <SelectItem key={type.id} value={type.id}>
              {type.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="w-full sm:w-[220px]">
        <EntitySelector
          value={selectedParent}
          onChange={onParentChange}
          placeholder="Filter by parent..."
        />
      </div>
    </div>
  );
}
