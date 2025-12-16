"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EntityTypeCard } from "./EntityTypeCard";
import type { EntityType } from "@/types";

interface EntityTypeCardListProps {
  entityTypes: EntityType[];
}

export function EntityTypeCardList({ entityTypes }: EntityTypeCardListProps) {
  if (entityTypes.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white py-12 text-center">
        <h3 className="mb-2 text-lg font-medium text-gray-900">
          No entity types found
        </h3>
        <p className="mb-4 text-gray-500">
          Get started by creating your first entity type.
        </p>
        <Button asChild>
          <Link href="/entity-types/create">Create Entity Type</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {entityTypes.map((entityType) => (
        <EntityTypeCard key={entityType.id} entityType={entityType} />
      ))}
    </div>
  );
}
