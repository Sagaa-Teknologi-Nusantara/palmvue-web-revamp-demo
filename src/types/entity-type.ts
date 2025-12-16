export interface PropertySchema {
  type: "string" | "number" | "boolean" | "integer";
  enum?: string[];
  format?: "date" | "date-time" | "email" | "uri";
  title?: string;
  description?: string;
}

export interface JSONSchema {
  type: "object";
  properties: Record<string, PropertySchema>;
  required?: string[];
}

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
