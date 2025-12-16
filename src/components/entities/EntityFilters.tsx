"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import type { EntityType, Entity } from "@/types";

interface EntityFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedType: string;
  onTypeChange: (typeId: string) => void;
  selectedParent: string;
  onParentChange: (parentId: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  entityTypes: EntityType[];
  entities: Entity[];
}

export function EntityFilters({
  searchQuery,
  onSearchChange,
  selectedType,
  onTypeChange,
  selectedParent,
  onParentChange,
  selectedStatus,
  onStatusChange,
  entityTypes,
  entities,
}: EntityFiltersProps) {
  const parentsAvailable = entities.filter((e) =>
    entities.some((child) => child.parent_id === e.id),
  );

  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row">
      <div className="relative flex-1">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search by name or code..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="bg-white pl-9"
        />
      </div>

      <Select value={selectedType} onValueChange={onTypeChange}>
        <SelectTrigger className="w-full bg-white sm:w-[180px]">
          <SelectValue placeholder="All Entity Types" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Entity Types</SelectItem>
          {entityTypes.map((type) => (
            <SelectItem key={type.id} value={type.id}>
              {type.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={selectedParent} onValueChange={onParentChange}>
        <SelectTrigger className="w-full bg-white sm:w-[180px]">
          <SelectValue placeholder="All Parents" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Parents</SelectItem>
          <SelectItem value="none">No Parent</SelectItem>
          {parentsAvailable.map((entity) => (
            <SelectItem key={entity.id} value={entity.id}>
              {entity.code} - {entity.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={selectedStatus} onValueChange={onStatusChange}>
        <SelectTrigger className="w-full bg-white sm:w-[150px]">
          <SelectValue placeholder="All Statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="not_started">Not Started</SelectItem>
          <SelectItem value="in_progress">In Progress</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
