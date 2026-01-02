"use client";

import { Check, Loader2, X } from "lucide-react";
import { useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
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
import {
  SubmissionStatusBadge,
  SubmissionStatusDot,
} from "@/components/workflows";
import {
  useApproveSubmissionMutation,
  useRejectSubmissionMutation,
  useStepSubmissionsQuery,
} from "@/hooks/queries";
import { cn } from "@/lib/cn";
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
  const [confirmAction, setConfirmAction] = useState<
    "approve" | "reject" | null
  >(null);

  const approveMutation = useApproveSubmissionMutation();
  const rejectMutation = useRejectSubmissionMutation();

  const selectedSubmission = selectedSubmissionId
    ? submissions.find((s) => s.id === selectedSubmissionId)
    : submissions[0];

  const handleApprove = () => {
    if (!selectedSubmission) return;
    approveMutation.mutate(selectedSubmission.id, {
      onSuccess: () => setConfirmAction(null),
    });
  };

  const handleReject = () => {
    if (!selectedSubmission) return;
    rejectMutation.mutate(selectedSubmission.id, {
      onSuccess: () => setConfirmAction(null),
    });
  };

  const isPending = approveMutation.isPending || rejectMutation.isPending;

  const renderLoadingState = () => (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className="text-primary h-8 w-8 animate-spin opacity-50" />
      <p className="text-muted-foreground mt-3 text-sm font-medium">
        Loading submissions...
      </p>
    </div>
  );

  const renderEmptyState = () => (
    <div className="text-muted-foreground flex flex-col items-center justify-center py-12 text-center">
      <p className="font-medium">No submissions found</p>
      <p className="pt-1 text-sm">
        There are no submission records for this step yet.
      </p>
    </div>
  );

  const renderSubmissionData = () => {
    if (!selectedSubmission || !selectedSubmission.data) return null;

    return (
      <div className="space-y-6">
        {submissions.length > 1 && (
          <div className="rounded-lg border bg-gray-50/50 p-3">
            <div className="space-y-2">
              <label className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                Submission History
              </label>
              <Select
                value={selectedSubmissionId || selectedSubmission.id}
                onValueChange={setSelectedSubmissionId}
              >
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Select submission" />
                </SelectTrigger>
                <SelectContent>
                  {submissions.map((submission, index) => (
                    <SelectItem key={submission.id} value={submission.id}>
                      <div className="flex items-center gap-2">
                        <SubmissionStatusDot status={submission.status} />
                        <span className="font-medium">
                          Version {submissions.length - index}
                        </span>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-muted-foreground">
                          {formatDate(submission.submitted_at)}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div className="space-y-1">
              <h4 className="text-sm font-semibold">Submission Details</h4>
              <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
                <span>
                  Submitted by {selectedSubmission.submitted_by.username}
                </span>
                <span>•</span>
                <span>{formatDate(selectedSubmission.submitted_at)}</span>
              </div>
            </div>
            <SubmissionStatusBadge status={selectedSubmission.status} />
          </div>

          <div className="grid gap-4">
            {Object.entries(selectedSubmission.data).map(([key, value]) => {
              const prop = step.form.schema.properties?.[key];
              const label = prop?.title || key;

              return (
                <div
                  key={key}
                  className="group rounded-md border p-3 transition-colors hover:bg-gray-50/50"
                >
                  <p className="text-muted-foreground mb-1.5 text-xs font-medium tracking-wider uppercase">
                    {label}
                  </p>
                  <p className="text-sm leading-relaxed font-medium break-all">
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

          {selectedSubmission.reviewed_by && (
            <div className="text-muted-foreground bg-muted/20 mt-4 flex items-center justify-between rounded border-t p-2 pt-4 text-xs">
              <span className="font-medium">Reviewed by</span>
              <span>{selectedSubmission.reviewed_by.username}</span>
            </div>
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
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-[550px]">
          <DialogHeader className="border-b bg-gray-50/50 px-6 py-5">
            <div className="mr-6 flex items-center justify-between">
              <div className="space-y-1">
                <DialogTitle className="text-xl leading-none font-semibold">
                  {step.name}
                </DialogTitle>
                <DialogDescription className="text-xs font-medium">
                  Step {step.order_index + 1}
                </DialogDescription>
              </div>
              <div
                className={cn(
                  "rounded-full border px-2.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase",
                  step.requires_approval
                    ? "border-yellow-200 bg-yellow-50 text-yellow-700"
                    : "border-green-200 bg-green-50 text-green-700",
                )}
              >
                {step.requires_approval ? "Requires Approval" : "Auto Approved"}
              </div>
            </div>
          </DialogHeader>

          <ScrollArea className="max-h-[60vh]">
            <div className="p-6">{renderContent()}</div>
          </ScrollArea>

          {true &&
            true && (
              <div className="border-t bg-gray-50/50 p-4">
                <div className="flex gap-2">
                  <Button
                    className="flex-1"
                    onClick={() => setConfirmAction("approve")}
                    disabled={isPending}
                  >
                    <Check className="mr-1.5 h-4 w-4" />
                    Approve
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => setConfirmAction("reject")}
                    disabled={isPending}
                  >
                    <X className="mr-1.5 h-4 w-4" />
                    Reject
                  </Button>
                </div>
              </div>
            )}
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={confirmAction !== null}
        onOpenChange={(open) => !open && setConfirmAction(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmAction === "approve"
                ? "Approve Submission"
                : "Reject Submission"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmAction === "approve"
                ? "Are you sure you want to approve this submission? The workflow will advance to the next step."
                : "Are you sure you want to reject this submission? The user will need to re-submit."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={
                confirmAction === "approve" ? handleApprove : handleReject
              }
              disabled={isPending}
              className={
                confirmAction === "reject"
                  ? "bg-destructive hover:bg-destructive/90"
                  : ""
              }
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {confirmAction === "approve" ? "Approve" : "Reject"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
