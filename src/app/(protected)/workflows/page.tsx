"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { PageHeader } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { WorkflowCardList } from "@/components/workflows/WorkflowCardList";
import { WorkflowFilters } from "@/components/workflows/WorkflowFilters";
import { useDeleteWorkflowMutation, useWorkflowsQuery } from "@/hooks/queries";

export default function WorkflowsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Parse entity_type_ids from URL (comma-separated)
  const entityTypeIdsParam = searchParams.get("types") || "";
  const selectedEntityTypeIds = entityTypeIdsParam
    ? entityTypeIdsParam.split(",")
    : [];

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { workflows, pagination, isLoading } = useWorkflowsQuery({
    page,
    size: pageSize,
    search: debouncedSearch || undefined,
    entity_type_ids:
      selectedEntityTypeIds.length > 0 ? selectedEntityTypeIds : undefined,
  });

  const deleteMutation = useDeleteWorkflowMutation();

  const handleEntityTypeChange = useCallback(
    (typeIds: string[]) => {
      const params = new URLSearchParams(searchParams.toString());
      if (typeIds.length === 0) {
        params.delete("types");
      } else {
        params.set("types", typeIds.join(","));
      }
      router.push(
        `/workflows${params.toString() ? `?${params.toString()}` : ""}`,
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
        title="Workflows"
        description="Manage workflow definitions"
        actions={
          <Button asChild>
            <Link href="/workflows/create">
              <Plus className="mr-2 h-4 w-4" />
              Create Workflow
            </Link>
          </Button>
        }
      />

      <WorkflowFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedEntityTypeIds={selectedEntityTypeIds}
        onEntityTypeChange={handleEntityTypeChange}
      />

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-48 w-full rounded-xl" />
          <Skeleton className="h-48 w-full rounded-xl" />
          <Skeleton className="h-48 w-full rounded-xl" />
        </div>
      ) : (
        <WorkflowCardList
          workflows={workflows}
          currentPage={page}
          totalPages={pagination.total_pages}
          pageSize={pageSize}
          totalItems={pagination.total_items}
          onPageChange={setPage}
          onPageSizeChange={handlePageSizeChange}
        />
      )}

      <DeleteConfirmationDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        onConfirm={handleDelete}
        isPending={deleteMutation.isPending}
        title="Delete Workflow"
        description="Are you sure you want to delete this workflow? This action cannot be undone."
      />
    </div>
  );
}
