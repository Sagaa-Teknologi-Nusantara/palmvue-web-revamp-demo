"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PaginationBar } from "@/components/ui/pagination-bar";
import { EntityCard } from "./EntityCard";
import type { Entity } from "@/types";
import type { WorkflowRecordStatus } from "@/types/workflow-record";

interface EntityWithStatus {
  entity: Entity;
  status: WorkflowRecordStatus;
}

interface EntityCardListProps {
  entities: EntityWithStatus[];
  onDelete: (id: string) => void;
}

export function EntityCardList({ entities, onDelete }: EntityCardListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  const totalPages = Math.ceil(entities.length / pageSize);

  const paginatedEntities = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return entities.slice(startIndex, startIndex + pageSize);
  }, [entities, currentPage, pageSize]);

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  if (entities.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white py-12 text-center">
        <h3 className="mb-2 text-lg font-medium text-gray-900">
          No entities found
        </h3>
        <p className="mb-4 text-gray-500">
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
        {paginatedEntities.map(({ entity, status }) => (
          <EntityCard
            key={entity.id}
            entity={entity}
            status={status}
            onDelete={onDelete}
          />
        ))}
      </div>

      <PaginationBar
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        totalItems={entities.length}
        onPageChange={setCurrentPage}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
}
