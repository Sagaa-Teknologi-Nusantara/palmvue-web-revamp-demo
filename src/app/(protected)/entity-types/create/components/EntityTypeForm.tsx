"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Database } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { SchemaBuilder } from "@/components/schema-builder";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import type {
  CreateEntityTypeInput,
  EntityType,
  JSONSchema,
  WorkflowOption,
} from "@/types";

import { FormFooter } from "./FormFooter";
import { GeneralInfoCard } from "./GeneralInfoCard";
import { WorkflowsCard } from "./WorkflowsCard";

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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div className="grid gap-6 md:grid-cols-2">
          <GeneralInfoCard control={form.control} />
          <WorkflowsCard
            control={form.control}
            availableWorkflows={availableWorkflows}
          />
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

        <FormFooter
          onCancel={onCancel}
          isLoading={isLoading}
          isEditing={!!entityType}
        />
      </form>
    </Form>
  );
}
