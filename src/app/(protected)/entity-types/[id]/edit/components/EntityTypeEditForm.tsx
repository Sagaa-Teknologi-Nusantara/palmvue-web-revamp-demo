"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import type { EntityType, JSONSchema, Workflow, WorkflowOption } from "@/types";

import { GeneralInfoCard } from "./GeneralInfoCard";
import { MetadataSchemaCard } from "./MetadataSchemaCard";
import { WorkflowsCard } from "./WorkflowsCard";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  icon: z.string().min(1, "Icon is required"),
  color: z.string().min(1, "Color is required"),
  add_workflow_ids: z.array(z.string()),
  include_existing: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

interface EntityTypeEditFormProps {
  entityType: EntityType;
  assignedWorkflows: Workflow[];
  availableWorkflows: WorkflowOption[];
  onSubmit: (data: FormValues) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function EntityTypeEditForm({
  entityType,
  assignedWorkflows,
  availableWorkflows,
  onSubmit,
  onCancel,
  isLoading,
}: EntityTypeEditFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: entityType.name,
      description: entityType.description || "",
      icon: entityType.icon || "box",
      color: entityType.color || "Neutral",
      add_workflow_ids: [],
      include_existing: false,
    },
  });

  const handleSubmit = (values: FormValues) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div className="grid gap-6 md:grid-cols-2">
          <GeneralInfoCard control={form.control} prefix={entityType.prefix} />
          <WorkflowsCard
            control={form.control}
            form={form}
            assignedWorkflows={assignedWorkflows}
            availableWorkflows={availableWorkflows}
          />
        </div>

        <MetadataSchemaCard schema={entityType.metadata_schema as JSONSchema} />

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
