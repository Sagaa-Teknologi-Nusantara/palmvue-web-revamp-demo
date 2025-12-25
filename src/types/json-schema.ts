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
