"use client";

import { useRouter } from "next/navigation";
import { use } from "react";

import type { UpdateEntityRequest } from "@/api/types/entity";
import { PageHeader } from "@/components/layout";
import {
  useEntityDetailQuery,
  useEntityTypeDetailQuery,
  useUpdateEntityMutation,
} from "@/hooks/queries";

import { EntityEditForm } from "./components";

export default function EntityEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const { entity, isLoading } = useEntityDetailQuery(id);
  const { entityType, isLoading: isLoadingType } = useEntityTypeDetailQuery(
    entity?.entity_type_id || "",
  );
  const updateMutation = useUpdateEntityMutation();

  const handleSubmit = async (data: UpdateEntityRequest) => {
    await updateMutation.mutateAsync({ id, data });
    router.push(`/entities/${id}`);
  };

  if (isLoading || !entity) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Edit Entity"
          description="Loading entity details..."
        />
        <div className="bg-muted h-96 animate-pulse rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Edit Entity" description={`Editing ${entity.name}`} />

      <EntityEditForm
        entity={entity}
        metadataSchema={entityType?.metadata_schema}
        onSubmit={handleSubmit}
        onCancel={() => router.push(`/entities/${id}`)}
        isLoading={updateMutation.isPending || isLoadingType}
      />
    </div>
  );
}
