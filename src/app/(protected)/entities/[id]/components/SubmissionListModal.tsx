"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  SubmissionStatusBadge,
  SubmissionStatusDot,
} from "@/components/workflows";
import { useStepSubmissionsQuery } from "@/hooks/queries";
import { formatDate } from "@/lib/date";
import type { EntityWorkflowStep } from "@/types";

interface SubmissionListModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  step: EntityWorkflowStep;
  workflowRecordId: string;
}

export function SubmissionListModal({
  open,
  onOpenChange,
  step,
  workflowRecordId,
}: SubmissionListModalProps) {
  const { submissions, isLoading } = useStepSubmissionsQuery(
    workflowRecordId,
    step.id,
    open,
  );

  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string>("");

  const selectedSubmission = selectedSubmissionId
    ? submissions.find((s) => s.id === selectedSubmissionId)
    : submissions[0];

  const renderLoadingState = () => (
    <div className="flex flex-col items-center justify-center py-8">
      <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
      <p className="text-muted-foreground mt-2 text-sm">
        Loading submissions...
      </p>
    </div>
  );

  const renderEmptyState = () => (
    <div className="text-muted-foreground flex flex-col items-center justify-center py-8 text-center">
      <p className="text-sm">No submissions yet</p>
    </div>
  );

  const renderSubmissionData = () => {
    if (!selectedSubmission || !selectedSubmission.data) return null;

    return (
      <div className="space-y-4">
        {submissions.length > 1 && (
          <div className="space-y-2">
            <label className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
              Submission History
            </label>
            <Select
              value={selectedSubmissionId || selectedSubmission.id}
              onValueChange={setSelectedSubmissionId}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select submission" />
              </SelectTrigger>
              <SelectContent>
                {submissions.map((submission, index) => (
                  <SelectItem key={submission.id} value={submission.id}>
                    <div className="flex items-center gap-2">
                      <SubmissionStatusDot status={submission.status} />
                      <span className="font-medium">
                        #{submissions.length - index}
                      </span>
                      <span className="text-muted-foreground">-</span>
                      <span className="text-muted-foreground text-xs">
                        {submission.submitted_by.username}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {formatDate(submission.submitted_at)}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {submissions.length > 1 && <Separator />}

        {/* Submission Status */}
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm">Status</span>
          <SubmissionStatusBadge status={selectedSubmission.status} />
        </div>

        {/* Submission Data */}
        <div className="space-y-3">
          <h4 className="text-muted-foreground text-sm font-medium tracking-wider uppercase">
            Submission Data
          </h4>
          <div className="grid grid-cols-1 gap-3">
            {Object.entries(selectedSubmission.data).map(([key, value]) => {
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
        </div>

        {/* Submission Metadata */}
        <div className="text-muted-foreground space-y-1 pt-2 text-xs">
          <p>Submitted by: {selectedSubmission.submitted_by.username}</p>
          <p>Submitted at: {formatDate(selectedSubmission.submitted_at)}</p>
          {selectedSubmission.reviewed_by && (
            <p>Reviewed by: {selectedSubmission.reviewed_by.username}</p>
          )}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (isLoading) {
      return renderLoadingState();
    }

    if (submissions.length === 0) {
      return renderEmptyState();
    }

    return renderSubmissionData();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl">{step.name}</DialogTitle>
          <DialogDescription className="mt-1.5">
            Step {step.order_index + 1} •{" "}
            {step.requires_approval ? "Requires approval" : "Auto-approved"}
          </DialogDescription>
        </DialogHeader>

        <Separator />

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6 py-4">{renderContent()}</div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
