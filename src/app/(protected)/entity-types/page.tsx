"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { useCallback, useState } from "react";

import { PageHeader } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useEntityTypesQuery } from "@/hooks/queries";

import { EntityTypeCardList } from "./components";

export default function EntityTypesPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  const { entityTypes, pagination, isLoading } = useEntityTypesQuery({
    page,
    size: pageSize,
  });

  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1);
  }, []);

  if (isLoading) {
    return (
      <div>
        <PageHeader
          title="Entity Types"
          description="Manage entity type definitions"
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Entity Types"
        description="Manage entity type definitions"
        actions={
          <Button asChild>
            <Link href="/entity-types/create">
              <Plus className="mr-2 h-4 w-4" />
              Create Entity Type
            </Link>
          </Button>
        }
      />

      <EntityTypeCardList
        entityTypes={entityTypes}
        currentPage={page}
        totalPages={pagination.total_pages}
        pageSize={pageSize}
        totalItems={pagination.total_items}
        onPageChange={setPage}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
}
