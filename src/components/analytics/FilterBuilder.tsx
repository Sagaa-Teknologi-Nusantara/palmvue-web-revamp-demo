"use client";

import { Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";
import { type Control, useFieldArray, useFormContext, useWatch } from "react-hook-form";

import type {
  CreateAnalyticsDefinitionFormValues,
  FieldOption,
  FilterOperator,
} from "@/api/types/analytics";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  MultiSelect,
  type MultiSelectOption,
} from "@/components/ui/multi-select";
import {
  SearchableSelect,
  type SearchableSelectOption,
} from "@/components/ui/searchable-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEntityOptionsQuery } from "@/hooks/queries/useEntityOptionsQuery";
import { useEntityTypeOptionsQuery } from "@/hooks/queries/useEntityTypeOptionsQuery";
import { useUserOptionsQuery } from "@/hooks/queries/useUserOptionsQuery";
import { useWorkflowOptionsQuery } from "@/hooks/queries/useWorkflowOptionsQuery";
import { useWorkflowStepOptionsQuery } from "@/hooks/queries/useWorkflowStepOptionsQuery";

interface FilterBuilderProps {
  control: Control<CreateAnalyticsDefinitionFormValues>;
  filterFields: FieldOption[];
}

const operatorLabels: Record<FilterOperator, string> = {
  "=": "equals",
  "!=": "not equals",
  ">": "greater than",
  "<": "less than",
  ">=": "greater or equal",
  "<=": "less or equal",
  in: "in list",
};

const operatorsByFieldType: Record<string, FilterOperator[]> = {
  uuid: ["=", "!=", "in"],
  enum: ["=", "!=", "in"],
  number: ["=", "!=", ">", "<", ">=", "<="],
  calculated: ["=", "!=", ">", "<", ">=", "<="],
  count: ["=", "!=", ">", "<", ">=", "<="],
  datetime: ["=", "!=", ">", "<", ">=", "<="],
};

function getValidOperators(fieldType?: string): FilterOperator[] {
  if (!fieldType) return ["=", "!=", ">", "<", ">=", "<=", "in"];
  return operatorsByFieldType[fieldType] ?? ["=", "!="];
}

function DynamicValueSelect({
  optionsEndpoint,
  value,
  onChange,
  options: staticOptions,
  operator,
  fieldType,
}: {
  optionsEndpoint?: string;
  value: string;
  onChange: (value: string) => void;
  options?: string[];
  operator?: FilterOperator;
  fieldType?: string;
}) {
  const { workflowOptions } = useWorkflowOptionsQuery();
  const { options: entityOptions } = useEntityOptionsQuery({});
  const { options: entityTypeOptions } = useEntityTypeOptionsQuery();
  const { userOptions } = useUserOptionsQuery();
  const { stepOptions } = useWorkflowStepOptionsQuery();

  const isInOperator = operator === "in";
  const isNumericField = fieldType === "number" || fieldType === "count" || fieldType === "calculated";

  let dynamicOptions: { id: string; name: string }[] = [];

  if (optionsEndpoint) {
    if (optionsEndpoint.includes("/workflows/options")) {
      dynamicOptions = workflowOptions.map((w) => ({ id: w.id, name: w.name }));
    } else if (optionsEndpoint.includes("/entities/options")) {
      dynamicOptions = entityOptions.map((e) => ({ id: e.id, name: e.name }));
    } else if (optionsEndpoint.includes("/entity-types/options")) {
      dynamicOptions = entityTypeOptions.map((et) => ({
        id: et.id,
        name: et.name,
      }));
    } else if (optionsEndpoint.includes("/users/options")) {
      dynamicOptions = userOptions.map((u) => ({ id: u.id, name: u.name }));
    } else if (optionsEndpoint.includes("/workflow-steps/options")) {
      dynamicOptions = stepOptions.map((s) => ({ id: s.id, name: s.name }));
    }
  }

  if (isInOperator) {
    const hasExpectedOptions = !!(optionsEndpoint || (staticOptions && staticOptions.length > 0));
    const multiOptions: MultiSelectOption[] =
      staticOptions && staticOptions.length > 0
        ? staticOptions.map((opt) => ({ value: opt, label: opt }))
        : dynamicOptions.map((opt) => ({ value: opt.id, label: opt.name }));

    if (hasExpectedOptions && multiOptions.length === 0) {
      return (
        <Input type="text" placeholder="Loading options..." disabled />
      );
    }

    if (multiOptions.length > 0) {
      const selectedValues = value ? value.split(",").filter(Boolean) : [];
      return (
        <MultiSelect
          options={multiOptions}
          value={selectedValues}
          onChange={(vals) => onChange(vals.join(","))}
          placeholder="Select values..."
        />
      );
    }
  }

  if (staticOptions && staticOptions.length > 0) {
    const searchableOpts: SearchableSelectOption[] = staticOptions.map((opt) => ({
      value: opt,
      label: opt,
    }));
    return (
      <SearchableSelect
        options={searchableOpts}
        value={value}
        onChange={onChange}
        placeholder="Select value"
      />
    );
  }

  if (dynamicOptions.length > 0) {
    const searchableOpts: SearchableSelectOption[] = dynamicOptions.map((opt) => ({
      value: opt.id,
      label: opt.name,
    }));
    return (
      <SearchableSelect
        options={searchableOpts}
        value={value}
        onChange={onChange}
        placeholder="Select value"
      />
    );
  }

  if (isNumericField) {
    return (
      <Input
        type="number"
        placeholder="Value"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }

  if (fieldType === "datetime") {
    return (
      <Input
        type="datetime-local"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }

  return (
    <Input
      type="text"
      placeholder="Value"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

export function FilterBuilder({ control, filterFields }: FilterBuilderProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "definition.filters",
  });

  const { setValue } = useFormContext<CreateAnalyticsDefinitionFormValues>();

  const watchedFilters = useWatch({
    control,
    name: "definition.filters",
  });

  const prevFiltersRef = useRef<typeof watchedFilters>(watchedFilters);

  const getFilterField = useCallback(
    (fieldName: string | undefined): FieldOption | undefined => {
      if (!fieldName) return undefined;
      return filterFields.find((f) => f.field === fieldName);
    },
    [filterFields]
  );

  useEffect(() => {
    const prev = prevFiltersRef.current;
    if (!watchedFilters || !prev) {
      prevFiltersRef.current = watchedFilters;
      return;
    }

    for (let i = 0; i < watchedFilters.length; i++) {
      const current = watchedFilters[i];
      const previous = prev[i];
      if (!current || !previous) continue;

      if (current.field !== previous.field && previous.field !== "") {
        const newFieldMeta = getFilterField(current.field);
        const validOps = getValidOperators(newFieldMeta?.type);
        if (!validOps.includes(current.operator as FilterOperator)) {
          setValue(`definition.filters.${i}.operator`, validOps[0]);
        }
        setValue(`definition.filters.${i}.value`, "");
      } else if (current.operator !== previous.operator) {
        setValue(`definition.filters.${i}.value`, "");
      }
    }

    prevFiltersRef.current = watchedFilters;
  }, [watchedFilters, setValue, getFilterField]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Filters</span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ field: "", operator: "=", value: "" })}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Filter
        </Button>
      </div>

      {fields.length === 0 && (
        <p className="text-sm text-muted-foreground">No filters applied</p>
      )}

      {fields.map((item, index) => {
        const selectedFieldName = watchedFilters?.[index]?.field;
        const selectedOperator = watchedFilters?.[index]?.operator;
        const selectedField = getFilterField(selectedFieldName);
        const validOperators = getValidOperators(selectedField?.type);

        return (
          <div key={item.id} className="flex items-start gap-2">
            <FormField
              control={control}
              name={`definition.filters.${index}.field`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <SearchableSelect
                      options={filterFields.map((f) => ({
                        value: f.field,
                        label: f.label,
                      }))}
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      placeholder="Field"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`definition.filters.${index}.operator`}
              render={({ field }) => (
                <FormItem className="w-32">
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Op" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {validOperators.map((op) => (
                        <SelectItem key={op} value={op}>
                          {operatorLabels[op]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`definition.filters.${index}.value`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <DynamicValueSelect
                      optionsEndpoint={selectedField?.options_endpoint}
                      options={selectedField?.options}
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      operator={selectedOperator}
                      fieldType={selectedField?.type}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="mt-0.5"
              onClick={() => remove(index)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        );
      })}
    </div>
  );
}
