"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  useEntityTypeDetailQuery,
  useEntityTypeOptionsQuery,
} from "@/hooks/queries";
import { validateMetadata } from "@/lib/schema-to-zod";
import type { CreateEntityInput } from "@/types";

import { BasicInfoCard } from "./BasicInfoCard";
import { MetadataCard } from "./MetadataCard";
import { RelationshipsCard } from "./RelationshipsCard";

const baseSchema = z.object({
  name: z.string().min(1, "Name is required"),
  entity_type_id: z.string().min(1, "Entity type is required"),
  parent_id: z.string().optional(),
});

interface EntityFormProps {
  onSubmit: (data: CreateEntityInput) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function EntityForm({ onSubmit, onCancel, isLoading }: EntityFormProps) {
  const form = useForm({
    resolver: zodResolver(baseSchema),
    defaultValues: {
      name: "",
      entity_type_id: "",
      parent_id: "",
    },
  });

  const selectedTypeId = useWatch({
    control: form.control,
    name: "entity_type_id",
  });

  const { options: entityTypeOptions, isLoading: isLoadingOptions } =
    useEntityTypeOptionsQuery();

  const { entityType: selectedType, isLoading: isLoadingSchema } =
    useEntityTypeDetailQuery(selectedTypeId || "");

  const [metadataByType, setMetadataByType] = useState<
    Record<string, Record<string, unknown>>
  >({});

  const [metadataErrors, setMetadataErrors] = useState<Record<string, string>>(
    {},
  );

  const metadata = metadataByType[selectedTypeId] ?? {};
  const setMetadata = (value: Record<string, unknown>) => {
    setMetadataByType((prev) => ({
      ...prev,
      [selectedTypeId]: value,
    }));

    if (Object.keys(metadataErrors).length > 0) {
      setMetadataErrors({});
    }
  };

  const handleSubmit = (values: z.infer<typeof baseSchema>) => {
    const result = validateMetadata(selectedType?.metadata_schema, metadata);

    if (!result.success) {
      setMetadataErrors(result.errors);
      return;
    }

    onSubmit({
      name: values.name,
      entity_type_id: values.entity_type_id,
      parent_id: values.parent_id || null,
      metadata: result.data,
    });
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div className="grid gap-6 md:grid-cols-2">
          <BasicInfoCard
            entityTypeOptions={entityTypeOptions}
            isLoadingOptions={isLoadingOptions}
          />
          <RelationshipsCard />
        </div>

        {selectedTypeId && (
          <MetadataCard
            schema={selectedType?.metadata_schema}
            value={metadata}
            onChange={setMetadata}
            isLoading={isLoadingSchema}
            errors={metadataErrors}
          />
        )}

        <div className="h-20" />

        <div className="bg-background fixed right-0 bottom-0 left-64 z-50 flex items-center justify-end gap-3 border-t p-4 shadow-sm transition-all duration-300">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading || !selectedTypeId || isLoadingSchema}
          >
            {isLoading ? "Creating..." : "Create Entity"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
