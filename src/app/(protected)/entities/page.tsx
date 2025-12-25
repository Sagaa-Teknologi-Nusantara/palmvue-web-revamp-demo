"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { PageHeader } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useDeleteEntityMutation,
  useEntitiesQuery,
  useEntityTypeOptionsQuery,
} from "@/hooks/queries";

import { EntityCardList, EntityFilters } from "./components";

export default function EntitiesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const selectedType = searchParams.get("type") || "all";

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { entities, pagination, isLoading } = useEntitiesQuery({
    page,
    size: pageSize,
    search: debouncedSearch || undefined,
    entity_type_id: selectedType !== "all" ? selectedType : undefined,
  });
  const { options: entityTypeOptions } = useEntityTypeOptionsQuery();
  const deleteMutation = useDeleteEntityMutation();

  const handleTypeChange = useCallback(
    (typeId: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (typeId === "all") {
        params.delete("type");
      } else {
        params.set("type", typeId);
      }
      router.push(
        `/entities${params.toString() ? `?${params.toString()}` : ""}`,
      );
      setPage(1);
    },
    [router, searchParams],
  );

  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1);
  }, []);

  const handleDelete = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId, {
        onSettled: () => setDeleteId(null),
      });
    }
  };

  return (
    <div>
      <PageHeader
        title="Entities"
        description="Manage entity instances"
        actions={
          <Button asChild>
            <Link href="/entities/create">
              <Plus className="mr-2 h-4 w-4" />
              Create Entity
            </Link>
          </Button>
        }
      />

      <EntityFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedType={selectedType}
        onTypeChange={handleTypeChange}
        entityTypeOptions={entityTypeOptions}
      />

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-xl" />
          ))}
        </div>
      ) : (
        <EntityCardList
          entities={entities}
          currentPage={page}
          totalPages={pagination.total_pages}
          pageSize={pageSize}
          totalItems={pagination.total_items}
          onPageChange={setPage}
          onPageSizeChange={handlePageSizeChange}
          onDelete={setDeleteId}
        />
      )}

      <DeleteConfirmationDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        onConfirm={handleDelete}
        isPending={deleteMutation.isPending}
        title="Delete Entity"
        description="Are you sure you want to delete this entity? This will also delete associated workflow records."
      />
    </div>
  );
}
