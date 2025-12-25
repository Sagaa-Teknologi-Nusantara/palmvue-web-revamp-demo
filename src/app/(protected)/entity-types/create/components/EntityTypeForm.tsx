"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Database, PlayCircle } from "lucide-react";
import { DynamicIcon, type IconName } from "lucide-react/dynamic";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { ColorPicker } from "@/components/pickers";
import { IconPicker } from "@/components/pickers/IconPicker";
import { SchemaBuilder } from "@/components/schema-builder";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Textarea } from "@/components/ui/textarea";
import { WorkflowSelector } from "@/components/workflows";
import { getColorByLabel } from "@/lib/colors";
import type {
  CreateEntityTypeInput,
  EntityType,
  JSONSchema,
  WorkflowOption,
} from "@/types";

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
  color: z.string().min(1, "Color is required"),
  workflow_ids: z.array(z.string()),
});

type FormValues = z.infer<typeof formSchema>;

interface EntityTypeFormProps {
  entityType?: EntityType;
  availableWorkflows?: WorkflowOption[];
  onSubmit: (data: CreateEntityTypeInput) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function EntityTypeForm({
  entityType,
  availableWorkflows = [],
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
      icon: entityType?.icon || "box",
      color: "Neutral",
      workflow_ids: [],
    },
  });

  const handleSubmit = (values: FormValues) => {
    onSubmit({
      name: values.name,
      description: values.description,
      prefix: values.prefix.toUpperCase(),
      icon: values.icon,
      color: values.color,
      metadata_schema: metadataSchema,
      workflow_ids: values.workflow_ids,
    });
  };

  const watchedColor = useWatch({ control: form.control, name: "color" });
  const watchedIcon = useWatch({ control: form.control, name: "icon" });
  const selectedColor = getColorByLabel(watchedColor);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div className="grid gap-6 md:grid-cols-2">
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
                          backgroundColor: selectedColor.bg,
                          color: selectedColor.fg,
                        }}
                      >
                        <DynamicIcon
                          name={watchedIcon as IconName}
                          className="h-6 w-6"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <FormField
                    control={form.control}
                    name="color"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Color Theme</FormLabel>
                        <FormControl>
                          <ColorPicker
                            value={field.value}
                            onChange={field.onChange}
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
                name="workflow_ids"
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
