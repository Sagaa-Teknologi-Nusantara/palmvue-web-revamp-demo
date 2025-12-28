"use client";

import { Search } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { PaginationBar } from "@/components/ui/pagination-bar";
import type { EntityType } from "@/types";

import { EntityTypeCard } from "./EntityTypeCard";

interface EntityTypeCardListProps {
  entityTypes: EntityType[];
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export function EntityTypeCardList({
  entityTypes,
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
}: EntityTypeCardListProps) {
  if (entityTypes.length === 0) {
    return (
      <div className="border-border bg-muted/40 rounded-lg border border-dashed py-12 text-center">
        <div className="bg-background mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
          <Search className="text-muted-foreground h-6 w-6" />
        </div>
        <h3 className="text-foreground mb-1 text-lg font-medium">
          No entity types found
        </h3>
        <p className="text-muted-foreground mb-4 text-sm">
          Get started by creating your first entity type.
        </p>
        <Button asChild>
          <Link href="/entity-types/create">Create Entity Type</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {entityTypes.map((entityType) => (
          <EntityTypeCard key={entityType.id} entityType={entityType} />
        ))}
      </div>

      <PaginationBar
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        totalItems={totalItems}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </div>
  );
}
