import { EntityTypeRef } from "./entity-type";
import type { JSONSchema } from "./json-schema";

export interface StepForm {
  id: string;
  name: string;
  schema: JSONSchema;
}

export interface WorkflowStep {
  id: string;
  name: string;
  order_index: number;
  requires_approval: boolean;
  form: StepForm;
}

export interface Workflow {
  id: string;
  name: string;
  is_loopable: boolean;
  is_auto_start: boolean;
  steps: WorkflowStep[];
  created_at: string;
  updated_at: string;
}

export interface WorkflowStepRef {
  id: string;
  name: string;
  order_index: number;
  requires_approval: boolean;
}

export interface WorkflowListItem {
  id: string;
  name: string;
  is_loopable: boolean;
  is_auto_start: boolean;
  step_count: number;
  active_record_count: number;
  steps: WorkflowStepRef[];
  entity_types: EntityTypeRef[];
  created_at: string;
  updated_at: string;
}

export interface WorkflowOption {
  id: string;
  name: string;
  is_loopable: boolean;
  is_auto_start: boolean;
}

export interface CreateStepInput {
  name: string;
  order_index: number;
  form: {
    name: string;
    schema: JSONSchema;
  };
}

export interface CreateWorkflowInput {
  name: string;
  steps: CreateStepInput[];
}

export interface UpdateWorkflowInput {
  name?: string;
  steps?: CreateStepInput[];
}
