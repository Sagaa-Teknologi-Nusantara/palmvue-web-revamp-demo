"use client";

import { PlayCircle } from "lucide-react";
import { useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { WorkflowRecordCard } from "@/components/workflows";
import { useStartWorkflowRecordMutation } from "@/hooks/queries";
import type { EntityWorkflowDetail, EntityWorkflowStep } from "@/types";

import { FormSchemaModal } from "./FormSchemaModal";
import { SubmissionListModal } from "./SubmissionListModal";

interface EntityWorkflowSectionProps {
  workflows: EntityWorkflowDetail[];
  isLoading: boolean;
}

export function EntityWorkflowSection({
  workflows,
  isLoading,
}: EntityWorkflowSectionProps) {
  const startMutation = useStartWorkflowRecordMutation();
  const [formSchemaStep, setFormSchemaStep] =
    useState<EntityWorkflowStep | null>(null);
  const [submissionStep, setSubmissionStep] = useState<{
    step: EntityWorkflowStep;
    workflowRecordId: string;
  } | null>(null);

  const handleStart = (recordId: string) => {
    startMutation.mutate(recordId);
  };

  const handleStepClick = (
    step: EntityWorkflowStep,
    hasSubmissions: boolean,
    workflowRecordId: string,
  ) => {
    if (hasSubmissions) {
      setSubmissionStep({ step, workflowRecordId });
    } else {
      setFormSchemaStep(step);
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">
              Workflow Progress
            </h2>
            <p className="text-muted-foreground text-sm">
              Track status and view details for assigned workflows
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="grid gap-6">
            <Skeleton className="h-48 w-full" />
          </div>
        ) : workflows.length > 0 ? (
          <div className="grid gap-6">
            {workflows.map((workflowDetail) => (
              <WorkflowRecordCard
                key={workflowDetail.id}
                workflowDetail={workflowDetail}
                onStart={handleStart}
                isStarting={
                  startMutation.isPending &&
                  startMutation.variables === workflowDetail.id
                }
                onStepClick={(step, hasSubmissions) =>
                  handleStepClick(step, hasSubmissions, workflowDetail.id)
                }
              />
            ))}
          </div>
        ) : (
          <Card className="border-dashed shadow-none">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="bg-muted/50 mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                <PlayCircle className="text-muted-foreground h-8 w-8 opacity-50" />
              </div>
              <h3 className="text-lg font-medium">No workflows found</h3>
              <p className="text-muted-foreground mt-2 max-w-sm text-sm">
                Assign workflows to this entity&apos;s type to automatically
                start tracking progress here.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {formSchemaStep && (
        <FormSchemaModal
          open={!!formSchemaStep}
          onOpenChange={(open) => !open && setFormSchemaStep(null)}
          step={formSchemaStep}
        />
      )}

      {submissionStep && (
        <SubmissionListModal
          open={!!submissionStep}
          onOpenChange={(open) => !open && setSubmissionStep(null)}
          step={submissionStep.step}
          workflowRecordId={submissionStep.workflowRecordId}
        />
      )}
    </>
  );
}
