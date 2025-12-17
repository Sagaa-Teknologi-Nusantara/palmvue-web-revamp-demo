"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, X } from "lucide-react";
import type { EntityType } from "@/types";

interface WorkflowFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedEntityType: string;
  onEntityTypeChange: (typeId: string) => void;
  entityTypes: EntityType[];
}

export function WorkflowFilters({
  searchQuery,
  onSearchChange,
  selectedEntityType,
  onEntityTypeChange,
  entityTypes,
}: WorkflowFiltersProps) {
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

      <Select value={selectedEntityType} onValueChange={onEntityTypeChange}>
        <SelectTrigger className="bg-background w-[200px]">
          <div className="text-muted-foreground flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <SelectValue placeholder="All Entity Types" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Entity Types</SelectItem>
          {entityTypes.map((et) => (
            <SelectItem key={et.id} value={et.id}>
              {et.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
