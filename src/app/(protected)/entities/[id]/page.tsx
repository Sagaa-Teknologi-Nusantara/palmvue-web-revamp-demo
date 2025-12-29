"use client";

import { AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useDeleteEntityMutation,
  useEntityDetailQuery,
  useEntityTypeDetailQuery,
  useEntityWorkflowsQuery,
} from "@/hooks/queries";
import { WORKFLOW_STATUSES } from "@/lib/status";
import type { WorkflowRecordStatus } from "@/types/workflow-record";

import {
  DeleteEntityDialog,
  EntityDetailHeader,
  EntityDetailsCard,
  EntityMetadataCard,
  EntityWorkflowSection,
} from "./components";

const [NOT_STARTED, IN_PROGRESS, PENDING_APPROVAL, COMPLETED] =
  WORKFLOW_STATUSES;

function computeEntityStatus(
  workflows: { status: WorkflowRecordStatus }[],
): WorkflowRecordStatus {
  if (workflows.length === 0) return NOT_STARTED;

  const statuses = new Set(workflows.map((r) => r.status));
  if (statuses.size === 1) return workflows[0].status;

  if (statuses.has(IN_PROGRESS)) return IN_PROGRESS;
  if (statuses.has(PENDING_APPROVAL)) return PENDING_APPROVAL;
  if (statuses.has(NOT_STARTED)) return IN_PROGRESS;
  return COMPLETED;
}

export default function EntityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { entity, isLoading, isError, error } = useEntityDetailQuery(id);
  const { entityType, isLoading: isLoadingEntityType } =
    useEntityTypeDetailQuery(entity?.entity_type_id ?? "");
  const deleteMutation = useDeleteEntityMutation();

  const { workflows, isLoading: isLoadingWorkflows } =
    useEntityWorkflowsQuery(id);

  const entityStatus = useMemo(() => {
    return computeEntityStatus(workflows);
  }, [workflows]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="mb-6">
          <Skeleton className="h-8 w-32" />
        </div>
        <div className="flex items-start justify-between">
          <div className="flex gap-4">
            <Skeleton className="h-12 w-12 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <Skeleton className="h-9 w-32" />
        </div>
        <Separator />
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (isError || !entity) {
    return (
      <div className="space-y-6">
        <Button
          variant="ghost"
          asChild
          className="hover:text-primary pl-0 hover:bg-transparent"
        >
          <Link href="/entities">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Entities
          </Link>
        </Button>

        <Card className="border-destructive/50">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="bg-destructive/10 mb-4 flex h-12 w-12 items-center justify-center rounded-full">
              <AlertCircle className="text-destructive h-6 w-6" />
            </div>
            <h2 className="text-lg font-semibold">Failed to load entity</h2>
            <p className="text-muted-foreground mt-1 max-w-sm text-sm">
              {error?.message || "Entity not found or an error occurred."}
            </p>
            <Button variant="outline" className="mt-4" asChild>
              <Link href="/entities">Return to Entities</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(id);
    router.push("/entities");
  };

  return (
    <div className="space-y-6">
      <EntityDetailHeader
        entity={entity}
        entityStatus={entityStatus}
        onDeleteClick={() => setShowDeleteDialog(true)}
      />

      <div className="grid gap-6 md:grid-cols-2">
        <EntityDetailsCard entity={entity} />
        <EntityMetadataCard
          entity={entity}
          entityType={entityType}
          isLoadingEntityType={isLoadingEntityType}
        />
      </div>

      <EntityWorkflowSection
        workflows={workflows}
        isLoading={isLoadingWorkflows}
      />

      <DeleteEntityDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        entityName={entity.name}
        onConfirm={handleDelete}
        isPending={deleteMutation.isPending}
      />
    </div>
  );
}
