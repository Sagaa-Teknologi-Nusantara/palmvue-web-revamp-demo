"use client";

import { Boxes } from "lucide-react";
import { useRouter } from "next/navigation";

import { Separator } from "@/components/ui/separator";
import { useCreateEntityMutation } from "@/hooks/queries";
import type { CreateEntityInput } from "@/types";

import { EntityForm } from "./components";

export default function CreateEntityPage() {
  const router = useRouter();
  const createMutation = useCreateEntityMutation();

  const handleSubmit = async (data: CreateEntityInput) => {
    await createMutation.mutateAsync({
      entity_type_id: data.entity_type_id,
      parent_id: data.parent_id || undefined,
      name: data.name,
      metadata: data.metadata,
    });
    router.push("/entities");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 text-primary border-primary/20 flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border shadow-sm transition-transform hover:scale-105">
              <Boxes className="h-8 w-8" />
            </div>
            <div className="space-y-1">
              <h1 className="text-foreground text-3xl font-bold tracking-tight">
                Create Entity
              </h1>
              <p className="text-muted-foreground text-sm">
                Create a new entity instance with metadata.
              </p>
            </div>
          </div>
        </div>
        <Separator />
      </div>

      <EntityForm
        onSubmit={handleSubmit}
        onCancel={() => router.push("/entities")}
        isLoading={createMutation.isPending}
      />
    </div>
  );
}
