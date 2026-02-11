"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  AnalyticsAggregations,
  AnalyticsChartTypes,
  type AnalyticsDefinition,
  AnalyticsGroupBys,
  AnalyticsSortOrders,
  AnalyticsSources,
  AnalyticsTimeRanges,
  type CreateAnalyticsDefinitionFormValues,
  createAnalyticsDefinitionSchema,
} from "@/api/types/analytics";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SearchableSelect } from "@/components/ui/searchable-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCreateAnalyticsDefinitionMutation } from "@/hooks/queries/useCreateAnalyticsDefinitionMutation";
import { useFieldOptionsQuery } from "@/hooks/queries/useFieldOptionsQuery";
import { useUpdateAnalyticsDefinitionMutation } from "@/hooks/queries/useUpdateAnalyticsDefinitionMutation";

import { FilterBuilder } from "./FilterBuilder";

interface AnalyticsFormProps {
  definition?: AnalyticsDefinition;
  onSuccess: () => void;
}

const sourceLabels = {
  form_submissions: "Form Submissions",
  workflow_records: "Workflow Records",
  entities: "Entities",
};

const aggregationLabels = {
  COUNT: "Count",
  SUM: "Sum",
  AVG: "Average",
  MIN: "Minimum",
  MAX: "Maximum",
};

const timeRangeLabels = {
  today: "Today",
  this_week: "This Week",
  this_month: "This Month",
  all_time: "All Time",
};

const groupByLabels = {
  workflow: "Workflow",
  entity_type: "Entity Type",
  user: "User",
  parent: "Parent",
};

const chartTypeLabels = {
  line: "Line Chart",
  bar: "Bar Chart",
  pie: "Pie Chart",
  number: "KPI Number",
};

export function AnalyticsForm({ definition, onSuccess }: AnalyticsFormProps) {
  const isEditing = !!definition;

  const form = useForm<CreateAnalyticsDefinitionFormValues>({
    resolver: zodResolver(createAnalyticsDefinitionSchema),
    mode: "onChange",
    defaultValues: {
      name: definition?.name ?? "",
      description: definition?.description ?? "",
      definition: definition?.definition ?? {
        source: "form_submissions",
        aggregation: "COUNT",
        field: "count",
        filters: [],
        time_range: "this_month",
        group_by: null,
        sort: null,
        chart_type: "number",
      },
    },
  });

  const watchedSource = form.watch("definition.source");
  const watchedGroupBy = form.watch("definition.group_by");

  const { fieldOptions, isLoading: fieldOptionsLoading } =
    useFieldOptionsQuery(watchedSource);

  const createMutation = useCreateAnalyticsDefinitionMutation();
  const updateMutation = useUpdateAnalyticsDefinitionMutation();

  const prevSourceRef = useRef(watchedSource);

  useEffect(() => {
    if (prevSourceRef.current !== watchedSource) {
      form.setValue("definition.filters", []);
      const currentGroupBy = form.getValues("definition.group_by");
      if (currentGroupBy && !fieldOptions?.group_by_fields?.includes(currentGroupBy)) {
        form.setValue("definition.group_by", null, { shouldValidate: true });
      }
      prevSourceRef.current = watchedSource;
    }
  }, [watchedSource, fieldOptions, form]);

  useEffect(() => {
    if (fieldOptions?.aggregation_fields?.length) {
      const currentField = form.getValues("definition.field");
      const validFields = fieldOptions.aggregation_fields.map((f) => f.field);
      if (!validFields.includes(currentField)) {
        form.setValue("definition.field", validFields[0] ?? "count");
      }
    }
  }, [fieldOptions, form]);

  useEffect(() => {
    if (!watchedGroupBy) {
      form.setValue("definition.chart_type", "number", { shouldValidate: true });
      form.setValue("definition.sort", null);
    } else {
      const currentChartType = form.getValues("definition.chart_type");
      if (currentChartType === "number") {
        form.setValue("definition.chart_type", "bar", { shouldValidate: true });
      }
    }
  }, [watchedGroupBy, form]);

  const onSubmit = async (data: CreateAnalyticsDefinitionFormValues) => {
    try {
      if (isEditing && definition) {
        await updateMutation.mutateAsync({ id: definition.id, data });
        toast.success("Analytics updated");
      } else {
        await createMutation.mutateAsync(data);
        toast.success("Analytics created");
      }
      onSuccess();
    } catch (error: unknown) {
      const fallback = isEditing ? "Failed to update analytics" : "Failed to create analytics";
      const message =
        error instanceof Error
          ? error.message
          : typeof error === "object" && error !== null && "error" in error
            ? (error as { error: { message: string } }).error.message
            : fallback;
      toast.error(message || fallback);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;
  const { isValid } = form.formState;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Monthly Submissions" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Optional description..."
                  rows={2}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="definition.source"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data Source</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {AnalyticsSources.map((source) => (
                    <SelectItem key={source} value={source}>
                      {sourceLabels[source]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="definition.aggregation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Aggregation</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select aggregation" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {AnalyticsAggregations.map((agg) => (
                    <SelectItem key={agg} value={agg}>
                      {aggregationLabels[agg]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="definition.field"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Field</FormLabel>
              <FormControl>
                <SearchableSelect
                  options={(fieldOptions?.aggregation_fields ?? []).map((f) => ({
                    value: f.field,
                    label: f.label,
                  }))}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Select field"
                  disabled={fieldOptionsLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="definition.time_range"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Time Range</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time range" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {AnalyticsTimeRanges.map((range) => (
                    <SelectItem key={range} value={range}>
                      {timeRangeLabels[range]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="definition.group_by"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Group By (Optional)</FormLabel>
              <Select
                onValueChange={(val) => field.onChange(val === "__none__" ? null : val)}
                value={field.value ?? "__none__"}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="No grouping" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="__none__">No grouping (KPI)</SelectItem>
                  {AnalyticsGroupBys.filter(
                    (g) => fieldOptions?.group_by_fields?.includes(g)
                  ).map((groupBy) => (
                    <SelectItem key={groupBy} value={groupBy}>
                      {groupByLabels[groupBy]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {watchedGroupBy && (
          <FormField
            control={form.control}
            name="definition.sort"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sort Order</FormLabel>
                <Select
                  onValueChange={(val) => field.onChange(val === "__none__" ? null : val)}
                  value={field.value ?? "__none__"}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="No sorting" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="__none__">No sorting</SelectItem>
                    {AnalyticsSortOrders.map((order) => (
                      <SelectItem key={order} value={order}>
                        {order === "asc" ? "Ascending" : "Descending"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="definition.chart_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Chart Type</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select chart type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {AnalyticsChartTypes.filter((type) =>
                    watchedGroupBy ? type !== "number" : type === "number"
                  ).map((type) => (
                    <SelectItem key={type} value={type}>
                      {chartTypeLabels[type]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FilterBuilder
          control={form.control}
          filterFields={fieldOptions?.filter_fields ?? []}
        />

        <Button type="submit" className="w-full" disabled={isPending || !isValid}>
          {isPending
            ? isEditing
              ? "Updating..."
              : "Creating..."
            : isEditing
            ? "Update Analytics"
            : "Create Analytics"}
        </Button>
      </form>
    </Form>
  );
}
