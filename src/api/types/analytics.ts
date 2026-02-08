import { z } from "zod";

export const AnalyticsSources = [
  "form_submissions",
  "workflow_records",
  "entities",
] as const;
export type AnalyticsSource = (typeof AnalyticsSources)[number];

export const AnalyticsAggregations = [
  "COUNT",
  "SUM",
  "AVG",
  "MIN",
  "MAX",
] as const;
export type AnalyticsAggregation = (typeof AnalyticsAggregations)[number];

export const AnalyticsTimeRanges = [
  "today",
  "this_week",
  "this_month",
  "all_time",
] as const;
export type AnalyticsTimeRange = (typeof AnalyticsTimeRanges)[number];

export const AnalyticsGroupBys = [
  "workflow",
  "entity_type",
  "user",
  "parent",
] as const;
export type AnalyticsGroupBy = (typeof AnalyticsGroupBys)[number];

export const AnalyticsSortOrders = ["asc", "desc"] as const;
export type AnalyticsSortOrder = (typeof AnalyticsSortOrders)[number];

export const AnalyticsChartTypes = ["line", "bar", "pie", "number"] as const;
export type AnalyticsChartType = (typeof AnalyticsChartTypes)[number];

export const FilterOperators = [
  "=",
  "!=",
  ">",
  "<",
  ">=",
  "<=",
  "in",
] as const;
export type FilterOperator = (typeof FilterOperators)[number];

export const filterConfigSchema = z.object({
  field: z.string().min(1),
  operator: z.enum(FilterOperators),
  value: z.string().min(1),
});

export const analyticsDefinitionConfigSchema = z
  .object({
    source: z.enum(AnalyticsSources),
    aggregation: z.enum(AnalyticsAggregations),
    field: z.string().min(1),
    filters: z.array(filterConfigSchema).optional(),
    time_range: z.enum(AnalyticsTimeRanges),
    group_by: z.enum(AnalyticsGroupBys).nullable().optional(),
    sort: z.enum(AnalyticsSortOrders).nullable().optional(),
    chart_type: z.enum(AnalyticsChartTypes),
  })
  .refine(
    (data) => {
      if (data.chart_type === "number") return !data.group_by;
      return true;
    },
    { message: "KPI number chart requires no grouping", path: ["chart_type"] }
  )
  .refine(
    (data) => {
      if (data.group_by && data.chart_type === "number") return false;
      return true;
    },
    { message: "Grouped analytics requires a chart type other than number", path: ["group_by"] }
  );

export const createAnalyticsDefinitionSchema = z.object({
  name: z.string().min(2).max(255),
  description: z.string().max(1000).optional(),
  definition: analyticsDefinitionConfigSchema,
});

export type FilterConfig = z.infer<typeof filterConfigSchema>;
export type AnalyticsDefinitionConfig = z.infer<
  typeof analyticsDefinitionConfigSchema
>;
export type CreateAnalyticsDefinitionFormValues = z.infer<
  typeof createAnalyticsDefinitionSchema
>;

export interface AnalyticsDefinition {
  id: string;
  name: string;
  description?: string;
  definition: AnalyticsDefinitionConfig;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateAnalyticsDefinitionRequest {
  name: string;
  description?: string;
  definition: AnalyticsDefinitionConfig;
}

export interface UpdateAnalyticsDefinitionRequest {
  name?: string;
  description?: string;
  definition?: AnalyticsDefinitionConfig;
  display_order?: number;
  is_active?: boolean;
}

export interface FieldOption {
  field: string;
  label: string;
  type: "count" | "calculated" | "number" | "uuid" | "enum" | "datetime";
  options?: string[];
  options_endpoint?: string;
}

export interface FieldOptionsResponse {
  aggregation_fields: FieldOption[];
  filter_fields: FieldOption[];
  time_field: string;
}

export type AnalyticsQueryData =
  | { type: "number"; value: number }
  | { type: "series"; labels: string[]; values: number[] }
  | { type: "grouped"; data: Record<string, number> };

export interface AnalyticsQueryResponse {
  definition_id: string;
  name: string;
  chart_type: AnalyticsChartType;
  data: AnalyticsQueryData;
}
