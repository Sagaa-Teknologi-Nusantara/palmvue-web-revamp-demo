"use client";

import { Plus, Trash2 } from "lucide-react";
import { type Control, useFieldArray, useWatch } from "react-hook-form";

import type {
  CreateAnalyticsDefinitionFormValues,
  FieldOption,
  FilterOperator,
} from "@/api/types/analytics";
import { FilterOperators } from "@/api/types/analytics";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

function DynamicValueSelect({
  optionsEndpoint,
  value,
  onChange,
  options: staticOptions,
}: {
  optionsEndpoint?: string;
  value: string;
  onChange: (value: string) => void;
  options?: string[];
}) {
  const { workflowOptions } = useWorkflowOptionsQuery();
  const { options: entityTypeOptions } = useEntityTypeOptionsQuery();
  const { userOptions } = useUserOptionsQuery();
  const { stepOptions } = useWorkflowStepOptionsQuery();

  if (staticOptions && staticOptions.length > 0) {
    return (
      <Select onValueChange={onChange} value={value}>
        <SelectTrigger>
          <SelectValue placeholder="Select value" />
        </SelectTrigger>
        <SelectContent>
          {staticOptions.map((opt) => (
            <SelectItem key={opt} value={opt}>
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  if (!optionsEndpoint) {
    return <Input placeholder="Value" value={value} onChange={(e) => onChange(e.target.value)} />;
  }

  let dynamicOptions: { id: string; name: string }[] = [];

  if (optionsEndpoint.includes("/workflows/options")) {
    dynamicOptions = workflowOptions.map((w) => ({ id: w.id, name: w.name }));
  } else if (optionsEndpoint.includes("/entities/options")) {
    // Entity options require params - use text input for now
    return <Input placeholder="Entity ID" value={value} onChange={(e) => onChange(e.target.value)} />;
  } else if (optionsEndpoint.includes("/entity-types/options")) {
    dynamicOptions = entityTypeOptions.map((et) => ({ id: et.id, name: et.name }));
  } else if (optionsEndpoint.includes("/users/options")) {
    dynamicOptions = userOptions.map((u) => ({ id: u.id, name: u.name }));
  } else if (optionsEndpoint.includes("/workflow-steps/options")) {
    dynamicOptions = stepOptions.map((s) => ({ id: s.id, name: s.name }));
  }

  if (dynamicOptions.length === 0) {
    return <Input placeholder="Value" value={value} onChange={(e) => onChange(e.target.value)} />;
  }

  return (
    <Select onValueChange={onChange} value={value}>
      <SelectTrigger>
        <SelectValue placeholder="Select value" />
      </SelectTrigger>
      <SelectContent>
        {dynamicOptions.map((opt) => (
          <SelectItem key={opt.id} value={opt.id}>
            {opt.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function FilterBuilder({ control, filterFields }: FilterBuilderProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "definition.filters",
  });

  const watchedFilters = useWatch({
    control,
    name: "definition.filters",
  });

  const getFilterField = (fieldName: string | undefined): FieldOption | undefined => {
    if (!fieldName) return undefined;
    return filterFields.find((f) => f.field === fieldName);
  };

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
        const selectedField = getFilterField(selectedFieldName);

        return (
          <div key={item.id} className="flex items-start gap-2">
            <FormField
              control={control}
              name={`definition.filters.${index}.field`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Field" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {filterFields.map((f) => (
                        <SelectItem key={f.field} value={f.field}>
                          {f.label}
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
              name={`definition.filters.${index}.operator`}
              render={({ field }) => (
                <FormItem className="w-32">
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Op" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {FilterOperators.map((op) => (
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
