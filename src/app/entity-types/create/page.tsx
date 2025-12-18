"use client";

import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout";
import { EntityTypeForm } from "@/components/entity-types";
import { useEntityTypes, useWorkflows } from "@/hooks";

export default function CreateEntityTypePage() {
  const router = useRouter();
  const { create, assignWorkflow } = useEntityTypes();
  const { workflows } = useWorkflows();

  const handleSubmit = (
    data: Parameters<typeof create>[0] & { assignedWorkflowIds: string[] },
  ) => {
    const { assignedWorkflowIds, ...createData } = data;
    const newEntityType = create(createData);

    // Assign selected workflows
    if (assignedWorkflowIds && assignedWorkflowIds.length > 0) {
      assignedWorkflowIds.forEach((workflowId) => {
        assignWorkflow(newEntityType.id, workflowId);
      });
    }

    router.push("/entity-types");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Entity Type"
        description="Define a new entity type with its metadata schema and default workflows"
      />

      <EntityTypeForm
        availableWorkflows={workflows}
        onSubmit={handleSubmit}
        onCancel={() => router.push("/entity-types")}
      />
    </div>
  );
}
