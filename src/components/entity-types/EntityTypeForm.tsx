"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SchemaBuilder } from "@/components/schema-builder";
import { WorkflowSelector } from "@/components/workflows";
import type {
  EntityType,
  CreateEntityTypeInput,
  JSONSchema,
  Workflow,
} from "@/types";
import { Box, PlayCircle, Database, Palette } from "lucide-react";
import { IconPicker } from "@/components/ui/IconPicker";
import { ColorPicker } from "@/components/ui/ColorPicker";
import { DynamicIcon } from "@/components/ui/DynamicIcon";

const defaultSchema: JSONSchema = {
  type: "object",
  properties: {},
  required: [],
};

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  prefix: z
    .string()
    .min(1, "Prefix is required")
    .max(5, "Prefix must be 5 characters or less")
    .refine((val) => val === val.toUpperCase(), {
      message: "Prefix must be uppercase",
    }),
  icon: z.string().min(1, "Icon is required"),
  bg_color: z.string().min(1, "Background color is required"),
  fg_color: z.string().min(1, "Foreground color is required"),
  assignedWorkflowIds: z.array(z.string()),
});

type FormValues = z.infer<typeof formSchema>;

interface EntityTypeFormProps {
  entityType?: EntityType;
  availableWorkflows?: Workflow[];
  assignedWorkflowIds?: string[];
  onSubmit: (
    data: CreateEntityTypeInput & { assignedWorkflowIds: string[] },
  ) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function EntityTypeForm({
  entityType,
  availableWorkflows = [],
  assignedWorkflowIds = [],
  onSubmit,
  onCancel,
  isLoading,
}: EntityTypeFormProps) {
  const [metadataSchema, setMetadataSchema] = useState<JSONSchema>(
    entityType?.metadata_schema || defaultSchema,
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: entityType?.name || "",
      description: entityType?.description || "",
      prefix: entityType?.prefix || "",
      icon: entityType?.icon || "Box",
      bg_color: entityType?.bg_color || "#dbeafe",
      fg_color: entityType?.fg_color || "#2563eb",
      assignedWorkflowIds: assignedWorkflowIds,
    },
  });

  const handleSubmit = (values: FormValues) => {
    onSubmit({
      name: values.name,
      description: values.description,
      prefix: values.prefix.toUpperCase(),
      icon: values.icon,
      bg_color: values.bg_color,
      fg_color: values.fg_color,
      metadata_schema: metadataSchema,
      assignedWorkflowIds: values.assignedWorkflowIds,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div className="grid gap-6 md:grid-cols-2">
          {/* General Information */}
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <span className="bg-primary/10 text-primary rounded-md p-1.5">
                  <Box className="h-4 w-4" />
                </span>
                General Information
              </CardTitle>
              <CardDescription>
                Basic details about the entity type
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Palm Tree" {...field} />
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
                        placeholder="Describe what this entity type represents..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="prefix"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prefix</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., TREE"
                        maxLength={5}
                        {...field}
                        onChange={(e) =>
                          field.onChange(e.target.value.toUpperCase())
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      Max 5 characters, uppercase. Used for generating unique
                      entity codes.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex w-full items-start gap-6">
                <div className="flex-1 space-y-6">
                  <FormField
                    control={form.control}
                    name="icon"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Icon</FormLabel>
                        <FormControl>
                          <IconPicker
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-2">
                    <FormLabel>Preview</FormLabel>
                    <div className="bg-muted/30 flex h-[6.3rem] items-center justify-center rounded-lg border border-dashed">
                      <div
                        className="flex h-12 w-12 items-center justify-center rounded-lg shadow-sm transition-colors"
                        style={{
                          backgroundColor: form.watch("bg_color"),
                          color: form.watch("fg_color"),
                        }}
                      >
                        <DynamicIcon
                          name={form.watch("icon")}
                          className="h-6 w-6"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <FormField
                    control={form.control}
                    name="bg_color"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Color Theme</FormLabel>
                        <FormControl>
                          <ColorPicker
                            value={{
                              bg: field.value,
                              fg: form.watch("fg_color"),
                            }}
                            onChange={(val) => {
                              form.setValue("bg_color", val.bg);
                              form.setValue("fg_color", val.fg);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Default Workflows */}
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <span className="bg-primary/10 text-primary rounded-md p-1.5">
                  <PlayCircle className="h-4 w-4" />
                </span>
                Default Workflows
              </CardTitle>
              <CardDescription>
                Workflows automatically assigned to new entities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="assignedWorkflowIds"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <WorkflowSelector
                        availableWorkflows={availableWorkflows}
                        selectedWorkflowIds={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormDescription>
                      Select workflows to be automatically assigned.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </div>

        {/* Metadata Schema */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <span className="bg-primary/10 text-primary rounded-md p-1.5">
                <Database className="h-4 w-4" />
              </span>
              Metadata Schema
            </CardTitle>
            <CardDescription>
              Define the custom fields and data structure for this entity type
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SchemaBuilder
              value={metadataSchema}
              onChange={setMetadataSchema}
              editMode="modal"
            />
          </CardContent>
        </Card>

        {/* Spacer for fixed footer */}
        <div className="h-20" />

        <div className="bg-background fixed right-0 bottom-0 left-64 z-50 flex items-center justify-end gap-3 border-t p-4 shadow-sm transition-all duration-300">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading
              ? "Saving..."
              : entityType
                ? "Update Entity Type"
                : "Create Entity Type"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
