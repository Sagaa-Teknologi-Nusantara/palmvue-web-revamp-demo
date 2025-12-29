"use client";

import { Database } from "lucide-react";
import { useRouter } from "next/navigation";
import { use, useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useDeleteEntityTypeMutation,
  useEntityTypeDetailQuery,
  useEntityTypeWorkflowsQuery,
} from "@/hooks/queries";

import {
  AssignedWorkflowsList,
  DeleteConfirmDialog,
  EntityTypeDetailsCard,
  EntityTypeHeader,
  MetadataSchemaDisplay,
} from "./components";

export default function EntityTypeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { entityType, isLoading } = useEntityTypeDetailQuery(id);
  const { workflows: assignedWorkflows, isLoading: isLoadingWorkflows } =
    useEntityTypeWorkflowsQuery(id);
  const deleteMutation = useDeleteEntityTypeMutation();

  if (isLoading || !entityType) {
    return (
      <div>
        <div className="mb-6">
          <Skeleton className="h-8 w-32" />
        </div>
        <div className="space-y-6">
          <div className="flex items-start justify-between">
            <div className="flex gap-4">
              <Skeleton className="h-16 w-16 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(id);
    router.push("/entity-types");
  };

  return (
    <div className="space-y-6">
      <EntityTypeHeader
        entityType={entityType}
        onDeleteClick={() => setShowDeleteDialog(true)}
      />

      <div className="grid gap-6 md:grid-cols-2">
        <EntityTypeDetailsCard entityType={entityType} />

        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <span className="bg-primary/10 text-primary rounded-md p-1.5">
                <Database className="h-4 w-4" />
              </span>
              Metadata Fields
            </CardTitle>
            <CardDescription>
              Fields available for entities of this type
            </CardDescription>
          </CardHeader>
          <CardContent className="max-h-[500px] overflow-y-auto p-4">
            <MetadataSchemaDisplay schema={entityType.metadata_schema} />
          </CardContent>
        </Card>
      </div>

      <AssignedWorkflowsList
        workflows={assignedWorkflows}
        isLoading={isLoadingWorkflows}
      />

      <DeleteConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        entityTypeName={entityType.name}
        onConfirm={handleDelete}
        isPending={deleteMutation.isPending}
      />
    </div>
  );
}
