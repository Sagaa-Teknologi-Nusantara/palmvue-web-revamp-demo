"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/entities/StatusBadge";
import type { WorkflowStep, StepSubmission } from "@/types";
import type { JSONSchema, PropertySchema } from "@/types";

interface StepDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  step: WorkflowStep;
  submission: StepSubmission | null;
  status: "completed" | "current" | "pending";
}

function getFieldType(prop: PropertySchema): string {
  if (prop.enum) return "dropdown";
  if (prop.format === "date") return "date";
  return prop.type || "string";
}

const FIELD_TYPE_COLORS: Record<string, string> = {
  string: "bg-blue-100 text-blue-800",
  number: "bg-purple-100 text-purple-800",
  integer: "bg-indigo-100 text-indigo-800",
  boolean: "bg-green-100 text-green-800",
  date: "bg-orange-100 text-orange-800",
  dropdown: "bg-pink-100 text-pink-800",
};

export function StepDetailModal({
  open,
  onOpenChange,
  step,
  submission,
  status,
}: StepDetailModalProps) {
  const renderSubmissionData = () => {
    if (!submission || !submission.data) return null;

    return (
      <div className="space-y-3">
        <h4 className="text-muted-foreground text-sm font-medium tracking-wider uppercase">
          Submission Data
        </h4>
        <div className="grid grid-cols-1 gap-3">
          {Object.entries(submission.data).map(([key, value]) => {
            const prop = step.form.schema.properties?.[key];
            const label = prop?.title || key;

            return (
              <div
                key={key}
                className="bg-muted/30 border-border rounded-lg border p-3"
              >
                <p className="text-muted-foreground mb-1 text-xs font-medium">
                  {label}
                </p>
                <p className="text-sm font-medium break-all">
                  {typeof value === "boolean"
                    ? value
                      ? "Yes"
                      : "No"
                    : String(value)}
                </p>
              </div>
            );
          })}
        </div>
        <div className="text-muted-foreground pt-2 text-xs">
          Submitted at: {new Date(submission.submitted_at).toLocaleString()}
        </div>
      </div>
    );
  };

  const renderFormSchema = () => {
    const schema = step.form.schema;
    if (!schema.properties || Object.keys(schema.properties).length === 0) {
      return (
        <p className="text-muted-foreground text-sm">
          No form fields defined for this step.
        </p>
      );
    }

    return (
      <div className="space-y-3">
        <h4 className="text-muted-foreground text-sm font-medium tracking-wider uppercase">
          Form Fields
        </h4>
        <div className="space-y-2">
          {Object.entries(schema.properties).map(([key, prop]) => {
            const type = getFieldType(prop);
            const isRequired = schema.required?.includes(key);

            return (
              <div
                key={key}
                className="bg-muted/20 border-border flex items-center justify-between rounded border p-2.5"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {prop.title || key}
                  </span>
                  {isRequired && (
                    <span className="text-destructive text-xs" title="Required">
                      *
                    </span>
                  )}
                </div>
                <Badge
                  variant="secondary"
                  className={`text-xs ${FIELD_TYPE_COLORS[type] || "bg-gray-100 text-gray-800"}`}
                >
                  {type}
                </Badge>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="mr-4 flex items-start justify-between gap-4">
            <div>
              <DialogTitle className="flex items-center gap-2 text-xl">
                {step.name}
              </DialogTitle>
              <DialogDescription className="mt-1.5">
                Step {step.order_index} in workflow
              </DialogDescription>
            </div>
            {/* Map 'current' to 'in_progress' for the badge if needed, or just pass proper status enum */}
            <StatusBadge
              status={
                status === "completed"
                  ? "completed"
                  : status === "current"
                    ? "in_progress"
                    : "not_started"
              }
            />
          </div>
        </DialogHeader>

        <Separator />

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6 py-4">
            {status === "completed"
              ? renderSubmissionData()
              : renderFormSchema()}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
