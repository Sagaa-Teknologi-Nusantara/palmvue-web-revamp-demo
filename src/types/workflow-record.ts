import { JSONSchema } from "./json-schema";

export type WorkflowRecordStatus = "not_started" | "in_progress" | "completed";

export interface WorkflowRef {
  id: string;
  name: string;
}

export interface StepRef {
  id: string;
  name: string;
  order_index: number;
}

export interface StepSubmission {
  step_id: string;
  data: Record<string, unknown>;
  submitted_at: string;
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
