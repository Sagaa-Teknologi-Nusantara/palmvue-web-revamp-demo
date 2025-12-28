import { JSONSchema } from "./json-schema";

export type WorkflowRecordStatus =
  | "not_started"
  | "in_progress"
  | "completed"
  | "pending_approval";

export interface WorkflowRef {
  id: string;
  name: string;
}

export interface StepRef {
  id: string;
  name: string;
  order_index: number;
}

export type SubmissionStatus =
  | "submitted"
  | "pending"
  | "approved"
  | "rejected";

export interface UserRef {
  id: string;
  username: string;
}

export interface StepSubmission {
  id: string;
  workflow_record_id: string;
  step_id: string;
  form_name: string;
  data: Record<string, unknown>;
  status: SubmissionStatus;
  submitted_by_id: string;
  submitted_by: UserRef;
  reviewed_by_id?: string;
  reviewed_by?: UserRef;
  submitted_at: string;
  reviewed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface WorkflowRecord {
  id: string;
  entity_id: string;
  workflow_id: string;
  workflow: WorkflowRef;
  current_step_id: string | null;
  current_step: StepRef | null;
  status: WorkflowRecordStatus;
  step_submissions: StepSubmission[];
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface StepWithForm extends StepRef {
  form: {
    id: string;
    name: string;
    schema: JSONSchema;
  };
}

export interface EntityWorkflowStep {
  id: string;
  name: string;
  order_index: number;
  requires_approval: boolean;
  form: {
    id: string;
    name: string;
    schema: JSONSchema;
  };
  submission_count: number;
}

export interface EntityWorkflowDetail {
  id: string;
  workflow_id: string;
  workflow: WorkflowRef;
  status: WorkflowRecordStatus;
  current_step_id: string | null;
  steps: EntityWorkflowStep[];
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}
