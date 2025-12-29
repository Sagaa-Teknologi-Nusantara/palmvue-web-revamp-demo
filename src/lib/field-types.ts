import { Calendar, CheckCircle2, Hash, List, Type } from "lucide-react";

import type { PropertySchema } from "@/types";

export type FieldType =
  | "string"
  | "number"
  | "integer"
  | "boolean"
  | "date"
  | "dropdown";

export interface FieldTypeConfig {
  label: string;
  icon: typeof Type;
  badgeColor: string;
  iconContainerColor: string;
}

export const FIELD_TYPE_CONFIG: Record<FieldType, FieldTypeConfig> = {
  string: {
    label: "Text",
    icon: Type,
    badgeColor:
      "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400",
    iconContainerColor: "border-blue-100 bg-blue-50/50 text-blue-500",
  },
  number: {
    label: "Number",
    icon: Hash,
    badgeColor:
      "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400",
    iconContainerColor: "border-purple-100 bg-purple-50/50 text-purple-500",
  },
  integer: {
    label: "Integer",
    icon: Hash,
    badgeColor:
      "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400",
    iconContainerColor: "border-indigo-100 bg-indigo-50/50 text-indigo-500",
  },
  boolean: {
    label: "Boolean",
    icon: CheckCircle2,
    badgeColor:
      "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400",
    iconContainerColor: "border-green-100 bg-green-50/50 text-green-500",
  },
  date: {
    label: "Date",
    icon: Calendar,
    badgeColor:
      "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400",
    iconContainerColor: "border-orange-100 bg-orange-50/50 text-orange-500",
  },
  dropdown: {
    label: "Dropdown",
    icon: List,
    badgeColor:
      "bg-pink-100 text-pink-700 dark:bg-pink-500/20 dark:text-pink-400",
    iconContainerColor: "border-pink-100 bg-pink-50/50 text-pink-500",
  },
};

export const DEFAULT_FIELD_CONFIG: FieldTypeConfig = FIELD_TYPE_CONFIG.string;

export function getFieldTypeFromSchema(prop: PropertySchema): FieldType {
  if (prop.enum) return "dropdown";
  if (prop.format === "date") return "date";
  return (prop.type as FieldType) || "string";
}

export function getFieldConfig(type: string): FieldTypeConfig {
  return FIELD_TYPE_CONFIG[type as FieldType] || DEFAULT_FIELD_CONFIG;
}
