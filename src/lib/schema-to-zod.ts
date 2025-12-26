import { z } from "zod";

import type { JSONSchema, PropertySchema } from "@/types";

function propertyToZod(
  prop: PropertySchema,
  isRequired: boolean,
): z.ZodTypeAny {
  let schema: z.ZodTypeAny;

  if (prop.enum && prop.enum.length > 0) {
    schema = z.enum(prop.enum as [string, ...string[]]);
  } else {
    switch (prop.type) {
      case "string":
        schema = z.string();
        if (isRequired) {
          schema = (schema as z.ZodString).min(1);
        }
        break;
      case "number":
      case "integer":
        schema = z.number();
        break;
      case "boolean":
        schema = z.boolean();
        break;
      default:
        schema = z.unknown();
    }
  }

  if (!isRequired) {
    schema = schema.optional();
  }

  return schema;
}

export function buildMetadataSchema(
  jsonSchema: JSONSchema | undefined,
): z.ZodObject<Record<string, z.ZodTypeAny>> {
  if (!jsonSchema?.properties) {
    return z.object({});
  }

  const shape: Record<string, z.ZodTypeAny> = {};
  const requiredFields = jsonSchema.required || [];

  for (const [key, prop] of Object.entries(jsonSchema.properties)) {
    const isRequired = requiredFields.includes(key);
    shape[key] = propertyToZod(prop, isRequired);
  }

  return z.object(shape);
}

export function validateMetadata(
  jsonSchema: JSONSchema | undefined,
  metadata: Record<string, unknown>,
):
  | { success: true; data: Record<string, unknown> }
  | { success: false; errors: Record<string, string> } {
  const schema = buildMetadataSchema(jsonSchema);
  const result = schema.safeParse(metadata);

  if (result.success) {
    return { success: true, data: result.data as Record<string, unknown> };
  }

  const errors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0] as string;
    if (key && !errors[key]) {
      const fieldName = jsonSchema?.properties?.[key]?.title || key;
      errors[key] = `${fieldName} is required`;
    }
  }

  return { success: false, errors };
}
