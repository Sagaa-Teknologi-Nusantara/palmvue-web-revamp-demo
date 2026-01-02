"use client";

import { useRouter } from "next/navigation";
import { use } from "react";

import type { UpdateWorkflowRequest } from "@/api/types/workflow";
import { PageHeader } from "@/components/layout";
import {
  useEntityTypeOptionsQuery,
  useUpdateWorkflowMutation,
  useWorkflowDetailQuery,
} from "@/hooks/queries";

import { WorkflowEditForm } from "./components";

export default function WorkflowEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const { workflow, isLoading } = useWorkflowDetailQuery(id);
  const { options: entityTypeOptions, isLoading: isLoadingOptions } =
    useEntityTypeOptionsQuery();
  const updateMutation = useUpdateWorkflowMutation();

  const handleSubmit = async (data: UpdateWorkflowRequest) => {
    await updateMutation.mutateAsync({ id, data });
    router.push(`/workflows/${id}`);
  };

  if (isLoading || !workflow) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Edit Workflow"
          description="Loading workflow details..."
        />
        <div className="bg-muted h-96 animate-pulse rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Workflow"
        description={`Editing ${workflow.name}`}
      />

      <WorkflowEditForm
        workflow={workflow}
        entityTypeOptions={entityTypeOptions || []}
        onSubmit={handleSubmit}
        onCancel={() => router.push(`/workflows/${id}`)}
        isLoading={updateMutation.isPending || isLoadingOptions}
      />
    </div>
  );
}
