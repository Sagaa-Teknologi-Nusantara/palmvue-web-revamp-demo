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

export interface WorkflowDetail {
  id: string;
  name: string;
  is_loopable: boolean;
  is_auto_start: boolean;
  steps: WorkflowStep[];
  entity_types: EntityTypeRef[];
  on_complete_actions: CompletionAction[];
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

export type CompletionActionType = "create_entities" | "start_workflow";
export type CountSourceType = "fixed" | "submission_field";

export interface CountSource {
  type: CountSourceType;
  step_order?: number;
  field_path?: string;
  value: number;
}

export interface CreateEntitiesConfig {
  entity_type_id: string;
  entity_type_info?: EntityTypeRef;
  count_source: CountSource;
}

export interface StartWorkflowConfig {
  workflow_id: string;
  workflow_name?: string;
  entity_type_id: string;
  entity_type_info?: EntityTypeRef;
}

export interface CompletionAction {
  type: CompletionActionType;
  config: CreateEntitiesConfig | StartWorkflowConfig;
}

export interface CreateStepInput {
  name: string;
  order_index: number;
  requires_approval: boolean;
  form: {
    name: string;
    schema: JSONSchema;
  };
}

export interface CreateWorkflowInput {
  name: string;
  entity_type_ids: string[];
  include_existing?: boolean;
  is_auto_start: boolean;
  is_loopable: boolean;
  steps: CreateStepInput[];
  on_complete: CompletionAction[];
}

export interface UpdateWorkflowInput {
  name?: string;
  steps?: CreateStepInput[];
}
