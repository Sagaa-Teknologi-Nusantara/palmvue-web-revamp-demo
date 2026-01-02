"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FileText, RotateCcw } from "lucide-react";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import type { UpdateEntityRequest } from "@/api/types/entity";
import { EntitySelector } from "@/components/entities";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { validateMetadata } from "@/lib/schema-to-zod";
import type { Entity, JSONSchema } from "@/types";

import { EntityInfoCard } from "./EntityInfoCard";
import { MetadataCard } from "./MetadataCard";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  parent_id: z.string().optional(),
});

interface EntityEditFormProps {
  entity: Entity;
  metadataSchema?: JSONSchema;
  onSubmit: (data: UpdateEntityRequest) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function EntityEditForm({
  entity,
  metadataSchema,
  onSubmit,
  onCancel,
  isLoading,
}: EntityEditFormProps) {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: entity.name,
      parent_id: entity.parent_id || "",
    },
  });

  const [metadata, setMetadata] = useState<Record<string, unknown>>(
    entity.metadata || {},
  );
  const [metadataErrors, setMetadataErrors] = useState<Record<string, string>>(
    {},
  );

  const handleSubmit = (values: z.infer<typeof schema>) => {
    const result = validateMetadata(metadataSchema, metadata);

    if (!result.success) {
      setMetadataErrors(result.errors);
      return;
    }

    onSubmit({
      name: values.name,
      parent_id: values.parent_id || null,
      metadata: result.data,
    });
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Entity Info - Read Only */}
          <EntityInfoCard entity={entity} />

          {/* Editable Fields */}
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <span className="bg-primary/10 text-primary rounded-md p-1.5">
                  <FileText className="h-4 w-4" />
                </span>
                Basic Information
              </CardTitle>
              <CardDescription>Update entity name and parent</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Entity name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="parent_id"
                render={({ field }) => {
                  const originalParentId = entity.parent_id || "";
                  const hasChanged = field.value !== originalParentId;

                  return (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Parent Entity (Optional)</FormLabel>
                        {hasChanged && (
                          <button
                            type="button"
                            onClick={() => field.onChange(originalParentId)}
                            className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-xs transition-colors"
                          >
                            <RotateCcw className="h-3 w-3" />
                            Reset to{" "}
                            {entity.parent ? entity.parent.name : "none"}
                          </button>
                        )}
                      </div>
                      <FormControl>
                        <EntitySelector
                          value={field.value || null}
                          onChange={(id) => field.onChange(id || "")}
                          excludeId={entity.id}
                          placeholder="Select a parent entity..."
                        />
                      </FormControl>
                      <FormDescription>
                        Link this entity to a parent for hierarchical
                        organization.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </CardContent>
          </Card>
        </div>

        {/* Metadata */}
        <MetadataCard
          schema={metadataSchema}
          value={metadata}
          onChange={(value: Record<string, unknown>) => {
            setMetadata(value);
            if (Object.keys(metadataErrors).length > 0) {
              setMetadataErrors({});
            }
          }}
          isLoading={isLoading}
          errors={metadataErrors}
        />

        <div className="h-20" />

        <div className="bg-background fixed right-0 bottom-0 left-64 z-50 flex items-center justify-end gap-3 border-t p-4 shadow-sm transition-all duration-300">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
