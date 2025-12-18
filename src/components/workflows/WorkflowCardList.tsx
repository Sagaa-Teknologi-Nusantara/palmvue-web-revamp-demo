"use client";

import { useState, useMemo, useCallback } from "react";
import { PaginationBar } from "@/components/ui/pagination-bar";
import { Search } from "lucide-react";
import { WorkflowCard } from "./WorkflowCard";
import type { Workflow, EntityType } from "@/types";

interface WorkflowCardListProps {
  workflows: Workflow[];
  workflowStats: Record<string, { assigned: number; active: number }>;
  workflowEntityTypeMap: Record<string, string>;
  entityTypes: EntityType[];
}

export function WorkflowCardList({
  workflows,
  workflowStats,
}: WorkflowCardListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  const totalPages = Math.ceil(workflows.length / pageSize);

  const paginatedWorkflows = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return workflows.slice(startIndex, startIndex + pageSize);
  }, [workflows, currentPage, pageSize]);

  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  }, []);

  return (
    <div className="space-y-6">
      {workflows.length === 0 ? (
        <div className="border-border bg-muted/40 rounded-lg border border-dashed py-12 text-center">
          <div className="bg-background mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
            <Search className="text-muted-foreground h-6 w-6" />
          </div>
          <h3 className="text-foreground mb-1 text-lg font-medium">
            No workflows found
          </h3>
          <p className="text-muted-foreground text-sm">
            Try adjusting your filters or create your first workflow.
          </p>
        </div>
      ) : (
        <div className="grid auto-rows-min grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
          {paginatedWorkflows.map((workflow) => {
            return (
              <WorkflowCard
                key={workflow.id}
                workflow={workflow}
                assignedCount={workflowStats[workflow.id]?.assigned || 0}
                activeCount={workflowStats[workflow.id]?.active || 0}
              />
            );
          })}
        </div>
      )}

      {workflows.length > 0 && (
        <PaginationBar
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={workflows.length}
          onPageChange={setCurrentPage}
          onPageSizeChange={handlePageSizeChange}
        />
      )}
    </div>
  );
}
