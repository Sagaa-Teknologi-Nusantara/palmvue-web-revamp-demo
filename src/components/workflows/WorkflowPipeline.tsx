"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { StepDetailModal } from "./StepDetailModal";
import type { WorkflowRecord, WorkflowStep, StepSubmission } from "@/types";
import { useWorkflowRecords } from "@/hooks";

interface WorkflowPipelineProps {
  workflowRecord: WorkflowRecord;
}

export function WorkflowPipeline({ workflowRecord }: WorkflowPipelineProps) {
  const { getWorkflowSteps, getStepSubmission } = useWorkflowRecords();
  const [selectedStep, setSelectedStep] = useState<{
    step: WorkflowStep;
    status: "completed" | "current" | "pending";
    submission: StepSubmission | null;
  } | null>(null);

  const steps = getWorkflowSteps(workflowRecord.id).sort(
    (a, b) => a.order_index - b.order_index,
  );

  const getStepStatus = (
    step: WorkflowStep,
  ): "completed" | "current" | "pending" => {
    const submission = getStepSubmission(workflowRecord.id, step.id);
    if (submission) return "completed";

    if (workflowRecord.current_step_id === step.id) return "current";
    if (workflowRecord.status === "completed" && !submission) {
      return "completed";
    }

    return "pending";
  };

  const handleStepClick = (step: WorkflowStep) => {
    const status = getStepStatus(step);
    const submission = getStepSubmission(workflowRecord.id, step.id);
    setSelectedStep({ step, status, submission });
  };

  return (
    <>
      <div className="scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-muted w-full overflow-x-auto px-1 pt-2 pb-4">
        <div className="flex min-w-max items-center">
          {steps.map((step, index) => {
            const status = getStepStatus(step);
            const isLast = index === steps.length - 1;

            return (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => handleStepClick(step)}
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
                    {step.order_index}
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
                        ? "Completed"
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

      {selectedStep && (
        <StepDetailModal
          open={!!selectedStep}
          onOpenChange={(open) => !open && setSelectedStep(null)}
          step={selectedStep.step}
          submission={selectedStep.submission}
          status={selectedStep.status}
        />
      )}
    </>
  );
}
