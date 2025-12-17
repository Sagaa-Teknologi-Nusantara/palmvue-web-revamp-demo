"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { PageHeader } from "@/components/layout";
import { WorkflowCardList } from "@/components/workflows/WorkflowCardList";
import { WorkflowFilters } from "@/components/workflows/WorkflowFilters";
import { useWorkflows, useEntityTypes, useWorkflowRecords } from "@/hooks";
import { Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function WorkflowsPage() {
  const { workflows, isLoaded, remove } = useWorkflows();
  const {
    entityTypes,
    entityTypeWorkflows,
    isLoaded: isEntityTypesLoaded,
  } = useEntityTypes();
  const { workflowRecords, isLoaded: isWorkflowRecordsLoaded } =
    useWorkflowRecords();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEntityType, setSelectedEntityType] = useState("all");

  const workflowStats = useMemo(() => {
    const stats: Record<string, { assigned: number; active: number }> = {};

    workflowRecords.forEach((record) => {
      if (!stats[record.workflow_id]) {
        stats[record.workflow_id] = { assigned: 0, active: 0 };
      }

      stats[record.workflow_id].assigned += 1;

      if (record.status === "in_progress") {
        stats[record.workflow_id].active += 1;
      }
    });

    return stats;
  }, [workflowRecords]);

  const filteredWorkflows = useMemo(() => {
    return workflows.filter((w) => {
      if (selectedEntityType !== "all") {
        const allowedIds = entityTypeWorkflows[selectedEntityType] || [];
        if (!allowedIds.includes(w.id)) return false;
      }
      if (searchQuery) {
        if (!w.name.toLowerCase().includes(searchQuery.toLowerCase()))
          return false;
      }
      return true;
    });
  }, [workflows, searchQuery, selectedEntityType, entityTypeWorkflows]);

  const handleDelete = () => {
    if (deleteId) {
      remove(deleteId);
      setDeleteId(null);
    }
  };

  if (!isLoaded || !isEntityTypesLoaded || !isWorkflowRecordsLoaded) {
    return (
      <div>
        <PageHeader
          title="Workflows"
          description="Manage workflow definitions"
        />
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    );
  }

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
        selectedEntityType={selectedEntityType}
        onEntityTypeChange={setSelectedEntityType}
        entityTypes={entityTypes}
      />

      <WorkflowCardList
        workflows={filteredWorkflows}
        workflowStats={workflowStats}
      />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Workflow</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this workflow? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
