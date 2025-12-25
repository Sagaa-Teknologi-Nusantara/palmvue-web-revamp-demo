import type { JSONSchema } from "./json-schema";

export interface EntityType {
  id: string;
  name: string;
  description: string;
  prefix: string;
  icon: string;
  color: string;
  metadata_schema: JSONSchema;
  created_at: string;
  updated_at: string;
}

export interface CreateEntityTypeInput {
  name: string;
  description: string;
  prefix: string;
  icon: string;
  color: string;
  metadata_schema: JSONSchema;
  workflow_ids: string[];
}

export interface UpdateEntityTypeInput {
  name?: string;
  description?: string;
  prefix?: string;
  metadata_schema?: JSONSchema;
}
