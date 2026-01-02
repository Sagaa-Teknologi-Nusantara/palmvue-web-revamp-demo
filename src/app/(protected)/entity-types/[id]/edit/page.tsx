"use client";

import { useRouter } from "next/navigation";
import { use } from "react";

import type { UpdateEntityTypeRequest } from "@/api/types/entity-type";
import { PageHeader } from "@/components/layout";
import {
  useEntityTypeDetailQuery,
  useEntityTypeWorkflowsQuery,
  useUpdateEntityTypeMutation,
  useWorkflowOptionsQuery,
} from "@/hooks/queries";

import { EntityTypeEditForm } from "./components";

export default function EntityTypeEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const { entityType, isLoading } = useEntityTypeDetailQuery(id);
  const { workflows: assignedWorkflows, isLoading: isLoadingWorkflows } =
    useEntityTypeWorkflowsQuery(id);
  const { workflowOptions, isLoading: isLoadingOptions } =
    useWorkflowOptionsQuery();
  const updateMutation = useUpdateEntityTypeMutation();

  const handleSubmit = async (data: {
    name: string;
    description: string;
    icon: string;
    color: string;
    add_workflow_ids: string[];
    include_existing: boolean;
  }) => {
    const request: UpdateEntityTypeRequest = {
      name: data.name,
      description: data.description,
      icon: data.icon,
      color: data.color,
    };

    if (data.add_workflow_ids.length > 0) {
      request.add_workflow_ids = data.add_workflow_ids;
      request.include_existing = data.include_existing;
    }

    await updateMutation.mutateAsync({ id, data: request });
    router.push(`/entity-types/${id}`);
  };

  if (isLoading || !entityType) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Edit Entity Type"
          description="Loading entity type details..."
        />
        <div className="bg-muted h-96 animate-pulse rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Entity Type"
        description={`Editing ${entityType.name}`}
      />

      <EntityTypeEditForm
        entityType={entityType}
        assignedWorkflows={assignedWorkflows || []}
        availableWorkflows={workflowOptions || []}
        onSubmit={handleSubmit}
        onCancel={() => router.push(`/entity-types/${id}`)}
        isLoading={
          updateMutation.isPending || isLoadingWorkflows || isLoadingOptions
        }
      />
    </div>
  );
}
