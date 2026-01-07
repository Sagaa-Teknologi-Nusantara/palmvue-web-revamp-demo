"use client";

import { ChevronRight, ChevronUp } from "lucide-react";
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

  const isLoopable = workflowDetail.workflow.is_loopable;

  const getStepStatus = (
    step: EntityWorkflowStep,
    stepIndex: number,
  ): "completed" | "recorded" | "current" | "pending" => {
    if (workflowDetail.status === "completed") {
      return "completed";
    }

    if (workflowDetail.current_step_id === step.id) {
      return "current";
    }

    if (step.submission_count > 0) {
      return isLoopable ? "recorded" : "completed";
    }

    if (currentStepIndex >= 0 && stepIndex < currentStepIndex) {
      return isLoopable ? "recorded" : "completed";
    }

    return "pending";
  };

  const handleStepClick = (step: EntityWorkflowStep, stepIndex: number) => {
    const status = getStepStatus(step, stepIndex);
    const hasSubmissions = step.submission_count > 0;

    if (status === "completed" || status === "recorded" || hasSubmissions) {
      setSubmissionStep({ step });
    } else {
      setFormSchemaStep(step);
    }
  };

  return (
    <>
      <div className="w-full overflow-x-auto scroll-smooth px-6 pt-8 pb-14">
        <div className="relative flex min-w-max items-center">
          {steps.map((step, index) => {
            const status = getStepStatus(step, index);
            const isLast = index === steps.length - 1;

            return (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => handleStepClick(step, index)}
                  className={cn(
                    "group focus:ring-ring relative flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition-all focus:ring-2 focus:ring-offset-2 focus:outline-none",
                    "min-w-[180px] text-left hover:shadow-md",
                    status === "completed" &&
                      "border-emerald-200 bg-emerald-50/50 hover:border-emerald-300 hover:bg-emerald-50",
                    status === "recorded" &&
                      "border-violet-200 bg-violet-50/50 hover:border-violet-300 hover:bg-violet-50",
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
                      status === "recorded" &&
                        "border-violet-500 bg-violet-100 text-violet-700",
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
                        status === "recorded" && "text-violet-900",
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
                        status === "recorded" && "font-medium text-violet-600",
                        status === "current" && "font-medium text-blue-600",
                        status === "pending" && "text-muted-foreground",
                      )}
                    >
                      {status === "completed"
                        ? "Completed"
                        : status === "recorded"
                          ? "Recorded"
                          : status === "current"
                            ? "In Progress"
                            : "Pending"}
                    </span>
                    {(status === "completed" ||
                      status === "recorded" ||
                      status === "current") &&
                      step.submission_count > 0 && (
                        <span className="text-muted-foreground/80 mt-0.5 truncate text-[10px]">
                          {step.submission_count}{" "}
                          {step.submission_count === 1
                            ? "Submission"
                            : "Submissions"}
                        </span>
                      )}
                  </div>
                </button>

                {!isLast && (
                  <div className="flex items-center">
                    <div className="bg-border relative h-[2px] w-8">
                      <ChevronRight
                        className={cn(
                          "text-muted-foreground absolute top-1/2 left-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2",
                          status === "completed" && "text-emerald-500",
                          status === "recorded" && "text-violet-500",
                        )}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          {/* Loop indicator for multi-step workflows */}
          {isLoopable && steps.length > 1 && (
            <div
              className="text-muted-foreground/40 pointer-events-none absolute h-5 rounded-b-lg border-r-2 border-b-2 border-l-2 border-dashed"
              style={{
                top: "calc(100%)",
                left: "90px",
                right: `calc(100% - ${steps.length * 180 + (steps.length - 1) * 32 - 90}px)`,
              }}
            >
              <ChevronUp className="absolute -top-px -left-px h-4 w-4 -translate-x-1/2" />
            </div>
          )}
          {/* Self-loop indicator for single-step workflows */}
          {isLoopable && steps.length === 1 && (
            <div
              className="text-muted-foreground/40 pointer-events-none absolute h-5 w-16 rounded-b-lg border-r-2 border-b-2 border-l-2 border-dashed"
              style={{
                top: "calc(100%)",
                left: "90px",
                transform: "translateX(-50%)",
              }}
            >
              <ChevronUp className="absolute -top-px -left-[1.5px] h-4 w-4 -translate-x-1/2" />
            </div>
          )}
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
