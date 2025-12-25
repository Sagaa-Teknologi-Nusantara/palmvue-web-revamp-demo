"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Database, Network } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CreateEntityInput, Entity, EntityType } from "@/types";

import { JsonSchemaForm } from "./JsonSchemaForm";

const baseSchema = z.object({
  name: z.string().min(1, "Name is required"),
  entity_type_id: z.string().min(1, "Entity type is required"),
  parent_id: z.string().optional(),
});

interface EntityFormProps {
  entityTypes: EntityType[];
  entities: Entity[];
  onSubmit: (data: CreateEntityInput) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function EntityForm({
  entityTypes,
  entities,
  onSubmit,
  onCancel,
  isLoading,
}: EntityFormProps) {
  const form = useForm({
    resolver: zodResolver(baseSchema),
    defaultValues: {
      name: "",
      entity_type_id: "",
      parent_id: "",
    },
  });

  const selectedTypeId = form.watch("entity_type_id");
  const selectedType = entityTypes.find((t) => t.id === selectedTypeId);

  const possibleParents = entities;

  const handleSubmit = (values: z.infer<typeof baseSchema>) => {
    const metadata: Record<string, unknown> = {};

    if (selectedType?.metadata_schema.properties) {
      Object.keys(selectedType.metadata_schema.properties).forEach((key) => {
        const value = form.getValues(key as keyof typeof values);
        if (value !== undefined && value !== "") {
          metadata[key] = value;
        }
      });
    }

    onSubmit({
      name: values.name,
      entity_type_id: values.entity_type_id,
      parent_id: values.parent_id || null,
      metadata,
    });
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <span className="bg-primary/10 text-primary rounded-md p-1.5">
                  <Box className="h-4 w-4" />
                </span>
                Basic Information
              </CardTitle>
              <CardDescription>Core details for the new entity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="entity_type_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Entity Type</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an entity type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {entityTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.name} ({type.prefix})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      The type determines the metadata fields and auto-generated
                      code prefix.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Palm Tree Alpha" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <span className="bg-primary/10 text-primary rounded-md p-1.5">
                  <Network className="h-4 w-4" />
                </span>
                Relationships
              </CardTitle>
              <CardDescription>
                Optional hierarchical connections
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="parent_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parent Entity (Optional)</FormLabel>
                    <Select
                      value={field.value || "none"}
                      onValueChange={(val) =>
                        field.onChange(val === "none" ? "" : val)
                      }
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a parent entity" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">No parent</SelectItem>
                        {possibleParents.map((entity) => (
                          <SelectItem key={entity.id} value={entity.id}>
                            {entity.code} - {entity.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Link this entity to a parent for hierarchical
                      organization.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </div>

        {selectedType && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <span className="bg-primary/10 text-primary rounded-md p-1.5">
                  <Database className="h-4 w-4" />
                </span>
                Metadata
              </CardTitle>
              <CardDescription>
                Custom fields defined by the entity type schema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <JsonSchemaForm schema={selectedType.metadata_schema} />
            </CardContent>
          </Card>
        )}

        <div className="h-20" />

        <div className="bg-background fixed right-0 bottom-0 left-64 z-50 flex items-center justify-end gap-3 border-t p-4 shadow-sm transition-all duration-300">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading || !selectedTypeId}>
            {isLoading ? "Creating..." : "Create Entity"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
