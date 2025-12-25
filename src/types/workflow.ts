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
  form: StepForm;
}

export interface Workflow {
  id: string;
  name: string;
  steps: WorkflowStep[];
  created_at: string;
  updated_at: string;
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
