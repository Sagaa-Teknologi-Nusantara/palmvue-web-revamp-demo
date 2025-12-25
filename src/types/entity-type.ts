import type { JSONSchema } from "./json-schema";

export interface EntityType {
  id: string;
  name: string;
  description: string;
  prefix: string;
  icon: string;
  bg_color: string;
  fg_color: string;
  metadata_schema: JSONSchema;
  created_at: string;
  updated_at: string;
}

export interface CreateEntityTypeInput {
  name: string;
  description: string;
  prefix: string;
  icon: string;
  bg_color: string;
  fg_color: string;
  metadata_schema: JSONSchema;
}

export interface UpdateEntityTypeInput {
  name?: string;
  description?: string;
  prefix?: string;
  metadata_schema?: JSONSchema;
}
