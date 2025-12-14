'use client';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search } from 'lucide-react';
import type { EntityType, Entity } from '@/types';

interface EntityFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedType: string;
  onTypeChange: (typeId: string) => void;
  selectedParent: string;
  onParentChange: (parentId: string) => void;
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
  entityTypes,
  entities,
}: EntityFiltersProps) {
  // Get unique parents from entities
  const parentsAvailable = entities.filter(
    (e) => entities.some((child) => child.parent_id === e.id)
  );

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search by name or code..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      <Select value={selectedType} onValueChange={onTypeChange}>
        <SelectTrigger className="w-full sm:w-[200px]">
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
        <SelectTrigger className="w-full sm:w-[200px]">
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
    </div>
  );
}
