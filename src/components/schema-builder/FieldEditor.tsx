"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Plus, X } from "lucide-react";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
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
import { Textarea } from "@/components/ui/textarea";

import { FIELD_TYPE_OPTIONS, type FieldConfig } from "./types";

const formSchema = z.object({
  name: z
    .string()
    .min(1, "Field name is required")
    .regex(
      /^[a-zA-Z_][a-zA-Z0-9_]*$/,
      "Must start with letter/underscore, contain only letters, numbers, underscores",
    ),
  label: z.string().min(1, "Display label is required"),
  type: z.enum([
    "string",
    "number",
    "integer",
    "boolean",
    "date",
    "dropdown",
  ] as const),
  required: z.boolean(),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface FieldEditorProps {
  onSave: (field: Omit<FieldConfig, "id">) => void;
  onCancel: () => void;
  field?: FieldConfig | null;
  variant?: "default" | "modal";
}

export function FieldEditor({
  onSave,
  onCancel,
  field,
  variant = "default",
}: FieldEditorProps) {
  // Derive a stable key from the field prop to reset state when field changes
  const fieldKey = field?.id ?? "new";

  // Track the previous field key to detect changes
  const [prevFieldKey, setPrevFieldKey] = useState(fieldKey);
  const [options, setOptions] = useState<string[]>(() => field?.options || []);
  const [newOption, setNewOption] = useState("");

  // Reset state when field changes (recommended pattern for prop-driven resets)
  if (prevFieldKey !== fieldKey) {
    setPrevFieldKey(fieldKey);
    setOptions(field?.options || []);
    setNewOption("");
  }

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: field?.name ?? "",
      label: field?.label ?? "",
      type: field?.type ?? "string",
      required: field?.required ?? false,
      description: field?.description ?? "",
    },
    values: field
      ? {
          name: field.name,
          label: field.label,
          type: field.type,
          required: field.required,
          description: field.description || "",
        }
      : undefined,
  });

  const watchedType = useWatch({ control: form.control, name: "type" });

  const handleAddOption = () => {
    if (newOption.trim() && !options.includes(newOption.trim())) {
      setOptions([...options, newOption.trim()]);
      setNewOption("");
    }
  };

  const handleRemoveOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleSubmit = (values: FormValues) => {
    if (values.type === "dropdown" && options.length === 0) {
      return;
    }

    onSave({
      name: values.name,
      label: values.label,
      type: values.type,
      required: values.required,
      description: values.description || undefined,
      options: values.type === "dropdown" ? options : undefined,
    });
  };

  return (
    <div
      className={`animate-in fade-in slide-in-from-right-4 flex h-full flex-col duration-200 ${variant === "modal" ? "p-5" : "p-4"}`}
    >
      {variant !== "modal" && (
        <div className="border-border/40 mb-4 flex items-center gap-2 border-b pb-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onCancel}
            className="-ml-2 h-8 w-8"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-semibold">
            {field ? "Edit Field" : "New Field"}
          </span>
        </div>
      )}

      <Form {...form}>
        <div className="flex-1 space-y-4 overflow-y-auto p-1">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Field Name (JSON Key)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., firstName"
                    {...field}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        form.handleSubmit(handleSubmit)();
                      }
                    }}
                  />
                </FormControl>
                <FormDescription>
                  Used as the key in the JSON schema
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="label"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Display Label</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., First Name"
                    {...field}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        form.handleSubmit(handleSubmit)();
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Field Type</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {FIELD_TYPE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {watchedType === "dropdown" && (
            <div className="space-y-2">
              <FormLabel>Dropdown Options</FormLabel>
              <div className="flex gap-2">
                <Input
                  value={newOption}
                  onChange={(e) => setNewOption(e.target.value)}
                  placeholder="Add an option"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddOption();
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddOption}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {options.length > 0 ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  {options.map((option, index) => (
                    <div
                      key={index}
                      className="bg-muted flex items-center gap-1 rounded-md px-2 py-1 text-sm"
                    >
                      <span>{option}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveOption(index)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-amber-600">
                  Add at least one option for the dropdown
                </p>
              )}
            </div>
          )}

          <FormField
            control={form.control}
            name="required"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2 space-y-0 rounded-md border p-3">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="font-medium">Required field</FormLabel>
                  <FormDescription className="text-xs">
                    User must fill this field to proceed
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Help text for this field"
                    {...field}
                    className="min-h-[80px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="border-border/40 flex gap-3 border-t pt-4">
            <Button
              type="button"
              className="flex-1"
              disabled={watchedType === "dropdown" && options.length === 0}
              onClick={form.handleSubmit(handleSubmit)}
            >
              {field ? "Update Field" : "Add Field"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
}
