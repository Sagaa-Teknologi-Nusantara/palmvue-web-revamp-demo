import type { WorkflowRecordStatus } from "@/types/workflow-record";

export const WORKFLOW_STATUSES: readonly WorkflowRecordStatus[] = [
  "not_started",
  "in_progress",
  "pending_approval",
  "completed",
] as const;

export const WORKFLOW_STATUS_LABELS: Record<WorkflowRecordStatus, string> = {
  not_started: "Not Started",
  in_progress: "In Progress",
  pending_approval: "Pending Approval",
  completed: "Completed",
};

export function isValidWorkflowStatus(
  status: string,
): status is WorkflowRecordStatus {
  return WORKFLOW_STATUSES.includes(status as WorkflowRecordStatus);
}
