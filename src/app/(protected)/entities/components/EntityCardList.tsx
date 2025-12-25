"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { PaginationBar } from "@/components/ui/pagination-bar";
import type { Entity } from "@/types";

import { EntityCard } from "./EntityCard";

interface EntityCardListProps {
  entities: Entity[];
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onDelete: (id: string) => void;
}

export function EntityCardList({
  entities,
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  onDelete,
}: EntityCardListProps) {
  if (entities.length === 0) {
    return (
      <div className="border-border bg-card rounded-lg border py-12 text-center">
        <h3 className="text-foreground mb-2 text-lg font-medium">
          No entities found
        </h3>
        <p className="text-muted-foreground mb-4">
          Get started by creating your first entity or adjust your filters.
        </p>
        <Button asChild>
          <Link href="/entities/create">Create Entity</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
        {entities.map((entity) => (
          <EntityCard key={entity.id} entity={entity} onDelete={onDelete} />
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
