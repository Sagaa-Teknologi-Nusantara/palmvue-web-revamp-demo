"use client";

import { ArrowRight, CheckCircle2 } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";

import { JsonSchemaForm } from "@/components/entities/JsonSchemaForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { StatusBadge } from "@/components/workflows/StatusBadge";
import { useWorkflowRecords, useWorkflows } from "@/hooks";
import { cn } from "@/lib/cn";
import { formatDateTime } from "@/lib/date";

interface WorkflowProgressProps {
  recordId: string;
  open: boolean;
  onClose: () => void;
}

export function WorkflowProgress({
  recordId,
  open,
  onClose,
}: WorkflowProgressProps) {
  const {
    getById,
    getWorkflowSteps,
    getCurrentStepWithForm,
    submitStep,
    isStepCompleted,
    getStepSubmissions,
  } = useWorkflowRecords();
  const { getById: getWorkflow } = useWorkflows();

  const record = getById(recordId);
  const steps = getWorkflowSteps(recordId);
  const currentStepWithForm = getCurrentStepWithForm(recordId);
  const workflow = record ? getWorkflow(record.workflow_id) : null;

  const form = useForm({
    defaultValues: {},
  });

  if (!record || !workflow) {
    return null;
  }

  const handleSubmitStep = (data: Record<string, unknown>) => {
    if (currentStepWithForm) {
      submitStep(recordId, currentStepWithForm.id, data);
      form.reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>{workflow.name}</DialogTitle>
            <StatusBadge status={record.status} />
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Step Timeline */}
          <div className="relative">
            <div className="flex items-center justify-between">
              {steps
                .sort((a, b) => a.order_index - b.order_index)
                .map((step, index) => {
                  const isCompleted = isStepCompleted(recordId, step.id);
                  const isCurrent = record.current_step_id === step.id;
                  const submissions = getStepSubmissions(recordId, step.id);
                  const submission = submissions[0]; // Get latest submission

                  return (
                    <div
                      key={step.id}
                      className="flex flex-1 flex-col items-center"
                    >
                      <div className="flex w-full items-center">
                        {index > 0 && (
                          <div
                            className={cn(
                              "h-0.5 flex-1",
                              isCompleted || isCurrent
                                ? "bg-primary"
                                : "bg-gray-200",
                            )}
                          />
                        )}
                        <div
                          className={cn(
                            "flex h-10 w-10 items-center justify-center rounded-full border-2",
                            isCompleted
                              ? "bg-primary border-primary text-white"
                              : isCurrent
                                ? "border-primary text-primary bg-white"
                                : "border-gray-200 bg-white text-gray-400",
                          )}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="h-6 w-6" />
                          ) : (
                            <span className="text-sm font-medium">
                              {index + 1}
                            </span>
                          )}
                        </div>
                        {index < steps.length - 1 && (
                          <div
                            className={cn(
                              "h-0.5 flex-1",
                              isCompleted ? "bg-primary" : "bg-gray-200",
                            )}
                          />
                        )}
                      </div>
                      <p
                        className={cn(
                          "mt-2 text-center text-xs font-medium",
                          isCurrent ? "text-primary" : "text-gray-500",
                        )}
                      >
                        {step.name}
                      </p>
                      {submission && (
                        <p className="mt-0.5 text-xs text-gray-400">
                          {formatDateTime(submission.submitted_at)}
                        </p>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Current Step Form or Completed Message */}
          {record.status === "completed" ? (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="font-medium text-green-800">
                      Workflow Completed
                    </p>
                    <p className="text-sm text-green-600">
                      Completed on {formatDateTime(record.completed_at!)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : currentStepWithForm ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Step {currentStepWithForm.order_index + 1}:{" "}
                  {currentStepWithForm.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FormProvider {...form}>
                  <form
                    onSubmit={form.handleSubmit(handleSubmitStep)}
                    className="space-y-6"
                  >
                    <JsonSchemaForm schema={currentStepWithForm.form.schema} />
                    <div className="flex justify-end">
                      <Button type="submit">
                        {currentStepWithForm.order_index < steps.length - 1 ? (
                          <>
                            Complete & Next
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                        ) : (
                          "Complete Workflow"
                        )}
                      </Button>
                    </div>
                  </form>
                </FormProvider>
              </CardContent>
            </Card>
          ) : null}

          {/* Submitted Data Summary */}
          {record.step_submissions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Submitted Data</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {record.step_submissions.map((submission) => {
                    const step = steps.find((s) => s.id === submission.step_id);
                    if (!step) return null;

                    return (
                      <div
                        key={submission.step_id}
                        className="rounded-lg bg-gray-50 p-3"
                      >
                        <div className="mb-2 flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          <p className="text-sm font-medium">{step.name}</p>
                          <span className="text-xs text-gray-400">
                            {formatDateTime(submission.submitted_at)}
                          </span>
                        </div>
                        <dl className="grid grid-cols-2 gap-2 text-sm">
                          {Object.entries(submission.data).map(
                            ([key, value]) => (
                              <div key={key}>
                                <dt className="text-gray-500">{key}</dt>
                                <dd>
                                  {typeof value === "boolean"
                                    ? value
                                      ? "Yes"
                                      : "No"
                                    : String(value)}
                                </dd>
                              </div>
                            ),
                          )}
                        </dl>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
