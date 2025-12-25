"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { EntityCardList, EntityFilters } from "@/components/entities";
import { PageHeader } from "@/components/layout";
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
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useEntities, useEntityTypes, useWorkflowRecords } from "@/hooks";
import type { WorkflowRecordStatus } from "@/types/workflow-record";

function computeEntityStatus(
  entityId: string,
  workflowRecords: { entity_id: string; status: WorkflowRecordStatus }[],
): WorkflowRecordStatus {
  const records = workflowRecords.filter((r) => r.entity_id === entityId);
  if (records.length === 0) return "not_started";

  const statuses = new Set(records.map((r) => r.status));
  if (statuses.size === 1) return records[0].status;

  if (statuses.has("in_progress")) return "in_progress";
  if (statuses.has("not_started")) return "in_progress";
  return "completed";
}

export default function EntitiesPage() {
  const { entities, isLoaded, remove } = useEntities();
  const { entityTypes } = useEntityTypes();
  const { workflowRecords } = useWorkflowRecords();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState(() => {
    return searchParams.get("type") || "all";
  });
  const [selectedParent, setSelectedParent] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  useEffect(() => {
    const typeParam = searchParams.get("type");
    if (typeParam) {
      setSelectedType(typeParam);
    }
  }, [searchParams]);

  const entitiesWithStatus = useMemo(() => {
    return entities.map((entity) => ({
      entity,
      status: computeEntityStatus(entity.id, workflowRecords),
    }));
  }, [entities, workflowRecords]);

  const filteredEntities = useMemo(() => {
    return entitiesWithStatus.filter(({ entity, status }) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (
          !entity.name.toLowerCase().includes(query) &&
          !entity.code.toLowerCase().includes(query)
        ) {
          return false;
        }
      }

      if (selectedType !== "all" && entity.entity_type_id !== selectedType) {
        return false;
      }

      if (selectedParent === "none" && entity.parent_id !== null) {
        return false;
      }
      if (
        selectedParent !== "all" &&
        selectedParent !== "none" &&
        entity.parent_id !== selectedParent
      ) {
        return false;
      }

      if (selectedStatus !== "all" && status !== selectedStatus) {
        return false;
      }

      return true;
    });
  }, [
    entitiesWithStatus,
    searchQuery,
    selectedType,
    selectedParent,
    selectedStatus,
  ]);

  const handleDelete = () => {
    if (deleteId) {
      remove(deleteId);
      setDeleteId(null);
    }
  };

  if (!isLoaded) {
    return (
      <div>
        <PageHeader title="Entities" description="Manage entity instances" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

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
        onTypeChange={setSelectedType}
        selectedParent={selectedParent}
        onParentChange={setSelectedParent}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        entityTypes={entityTypes}
        entities={entities}
      />

      <EntityCardList entities={filteredEntities} onDelete={setDeleteId} />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Entity</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this entity? This will also delete
              associated workflow records.
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
