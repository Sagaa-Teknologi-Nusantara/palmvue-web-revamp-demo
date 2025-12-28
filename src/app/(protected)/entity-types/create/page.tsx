"use client";

import { useRouter } from "next/navigation";

import type { CreateEntityTypeRequest } from "@/api/types/entity-type";
import { PageHeader } from "@/components/layout";
import {
  useCreateEntityTypeMutation,
  useWorkflowOptionsQuery,
} from "@/hooks/queries";
import type { CreateEntityTypeInput } from "@/types";

import { EntityTypeForm } from "./components";

export default function CreateEntityTypePage() {
  const router = useRouter();
  const createMutation = useCreateEntityTypeMutation();
  const { workflowOptions, isLoading: isLoadingWorkflows } =
    useWorkflowOptionsQuery();

  const handleSubmit = async (data: CreateEntityTypeInput) => {
    const request: CreateEntityTypeRequest = {
      name: data.name,
      description: data.description,
      prefix: data.prefix,
      icon: data.icon,
      color: data.color,
      metadata_schema: data.metadata_schema,
      workflow_ids: data.workflow_ids,
    };

    await createMutation.mutateAsync(request);
    router.push("/entity-types");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Entity Type"
        description="Define a new entity type with its metadata schema and default workflows"
      />

      <EntityTypeForm
        availableWorkflows={workflowOptions}
        onSubmit={handleSubmit}
        onCancel={() => router.push("/entity-types")}
        isLoading={createMutation.isPending || isLoadingWorkflows}
      />
    </div>
  );
}
