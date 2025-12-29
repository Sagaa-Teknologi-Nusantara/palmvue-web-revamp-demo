"use client";

import { Search } from "lucide-react";

import { PaginationBar } from "@/components/ui/pagination-bar";
import type { WorkflowListItem } from "@/types";

import { WorkflowCard } from "./WorkflowCard";

interface WorkflowCardListProps {
  workflows: WorkflowListItem[];
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export function WorkflowCardList({
  workflows,
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
}: WorkflowCardListProps) {
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
        <div className="grid auto-rows-min grid-cols-1 gap-4">
          {workflows.map((workflow) => (
            <WorkflowCard key={workflow.id} workflow={workflow} />
          ))}
        </div>
      )}

      {totalItems > 0 && (
        <PaginationBar
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={totalItems}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      )}
    </div>
  );
}
