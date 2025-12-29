"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { JSONSchema, PropertySchema } from "@/types";

interface MetadataFormProps {
  schema: JSONSchema;
  value: Record<string, unknown>;
  onChange: (value: Record<string, unknown>) => void;
  errors?: Record<string, string>;
}

export function MetadataForm({
  schema,
  value,
  onChange,
  errors = {},
}: MetadataFormProps) {
  if (!schema.properties) {
    return null;
  }

  const properties = Object.entries(schema.properties);
  const requiredFields = schema.required || [];

  const handleFieldChange = (key: string, fieldValue: unknown) => {
    onChange({ ...value, [key]: fieldValue });
  };

  return (
    <div className="space-y-4">
      {properties.map(([key, prop]) => {
        const isRequired = requiredFields.includes(key);
        const fieldValue = value[key];
        const error = errors[key];

        return (
          <div key={key} className="space-y-2">
            <Label className={error ? "text-destructive" : undefined}>
              {prop.title || key}
              {isRequired && <span className="ml-1 text-red-500">*</span>}
            </Label>
            {renderField(
              prop,
              fieldValue,
              (val) => handleFieldChange(key, val),
              !!error,
            )}
            {error && <p className="text-destructive text-sm">{error}</p>}
            {!error && prop.description && (
              <p className="text-muted-foreground text-sm">
                {prop.description}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

function renderField(
  prop: PropertySchema,
  value: unknown,
  onChange: (value: unknown) => void,
  hasError: boolean,
) {
  const errorClass = hasError ? "border-destructive" : "";

  if (prop.enum) {
    return (
      <Select value={(value as string) || ""} onValueChange={onChange}>
        <SelectTrigger className={errorClass}>
          <SelectValue placeholder={`Select ${prop.title || "option"}...`} />
        </SelectTrigger>
        <SelectContent>
          {prop.enum.map((option) => (
            <SelectItem key={option} value={option}>
              {option.charAt(0).toUpperCase() +
                option.slice(1).replace(/_/g, " ")}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  if (prop.type === "boolean") {
    return (
      <div className="flex items-center space-x-2">
        <Checkbox checked={value as boolean} onCheckedChange={onChange} />
        <span className="text-muted-foreground text-sm">Yes</span>
      </div>
    );
  }

  if (prop.format === "date") {
    return (
      <Input
        type="date"
        value={(value as string) || ""}
        onChange={(e) => onChange(e.target.value)}
        className={errorClass}
      />
    );
  }

  if (prop.type === "number" || prop.type === "integer") {
    return (
      <Input
        type="number"
        step={prop.type === "integer" ? "1" : "any"}
        value={(value as number) ?? ""}
        onChange={(e) => onChange(e.target.value ? Number(e.target.value) : "")}
        placeholder={prop.title || ""}
        className={errorClass}
      />
    );
  }

  return (
    <Input
      type="text"
      value={(value as string) || ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={prop.title || ""}
      className={errorClass}
    />
  );
}
