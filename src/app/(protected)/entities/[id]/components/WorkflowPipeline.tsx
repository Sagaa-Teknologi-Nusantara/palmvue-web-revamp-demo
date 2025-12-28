"use client";

import { ChevronRight } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/cn";
import type { EntityWorkflowDetail, EntityWorkflowStep } from "@/types";

import { FormSchemaModal } from "./FormSchemaModal";
import { SubmissionListModal } from "./SubmissionListModal";

interface WorkflowPipelineProps {
  workflowDetail: EntityWorkflowDetail;
}

export function WorkflowPipeline({ workflowDetail }: WorkflowPipelineProps) {
  const [formSchemaStep, setFormSchemaStep] =
    useState<EntityWorkflowStep | null>(null);
  const [submissionStep, setSubmissionStep] = useState<{
    step: EntityWorkflowStep;
  } | null>(null);

  const steps = [...workflowDetail.steps].sort(
    (a, b) => a.order_index - b.order_index,
  );

  const currentStepIndex = workflowDetail.current_step_id
    ? steps.findIndex((s) => s.id === workflowDetail.current_step_id)
    : -1;

  const getStepStatus = (
    step: EntityWorkflowStep,
    stepIndex: number,
  ): "completed" | "current" | "pending" => {
    if (workflowDetail.status === "completed") {
      return "completed";
    }

    if (step.submission_count > 0) {
      return "completed";
    }

    if (workflowDetail.current_step_id === step.id) {
      return "current";
    }

    if (currentStepIndex >= 0 && stepIndex < currentStepIndex) {
      return "completed";
    }

    return "pending";
  };

  const handleStepClick = (step: EntityWorkflowStep, stepIndex: number) => {
    const status = getStepStatus(step, stepIndex);
    const hasSubmissions = step.submission_count > 0;

    // Show SubmissionListModal for completed steps or steps with submissions
    if (status === "completed" || hasSubmissions) {
      setSubmissionStep({ step });
    } else {
      // Show FormSchemaModal for pending/current steps with no submissions
      setFormSchemaStep(step);
    }
  };

  return (
    <>
      <div className="scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-muted w-full overflow-x-auto px-1 pt-2 pb-4">
        <div className="flex min-w-max items-center">
          {steps.map((step, index) => {
            const status = getStepStatus(step, index);
            const isLast = index === steps.length - 1;

            return (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => handleStepClick(step, index)}
                  className={cn(
                    "group focus:ring-ring relative flex items-center gap-3 rounded-lg border px-4 py-3 transition-all focus:ring-2 focus:ring-offset-2 focus:outline-none",
                    "min-w-[180px] text-left hover:shadow-md",
                    status === "completed" &&
                      "border-emerald-200 bg-emerald-50/50 hover:border-emerald-300 hover:bg-emerald-50",
                    status === "current" &&
                      "border-blue-200 bg-blue-50/50 shadow-sm ring-1 ring-blue-100 hover:border-blue-300 hover:bg-blue-50",
                    status === "pending" &&
                      "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50",
                  )}
                >
                  <div
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold transition-colors",
                      status === "completed" &&
                        "border-emerald-500 bg-emerald-100 text-emerald-700",
                      status === "current" &&
                        "animate-pulse border-blue-500 bg-blue-100 text-blue-700",
                      status === "pending" &&
                        "border-gray-200 bg-gray-100 text-gray-400",
                    )}
                  >
                    {step.order_index + 1}
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span
                      className={cn(
                        "truncate text-sm font-semibold",
                        status === "completed" && "text-emerald-900",
                        status === "current" && "text-blue-900",
                        status === "pending" && "text-foreground",
                      )}
                    >
                      {step.name}
                    </span>
                    <span
                      className={cn(
                        "truncate text-xs",
                        status === "completed" &&
                          "font-medium text-emerald-600",
                        status === "current" && "font-medium text-blue-600",
                        status === "pending" && "text-muted-foreground",
                      )}
                    >
                      {status === "completed"
                        ? `Completed${step.submission_count > 0 ? ` (${step.submission_count})` : ""}`
                        : status === "current"
                          ? "In Progress"
                          : "Pending"}
                    </span>
                  </div>
                </button>

                {!isLast && (
                  <div className="flex items-center">
                    <div className="bg-border relative h-[2px] w-8">
                      <ChevronRight
                        className={cn(
                          "text-muted-foreground absolute top-1/2 left-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2",
                          status === "completed" && "text-emerald-500",
                        )}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
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
          workflowRecordId={workflowDetail.id}
        />
      )}
    </>
  );
}
