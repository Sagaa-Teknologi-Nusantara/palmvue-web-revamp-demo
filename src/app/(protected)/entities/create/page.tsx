"use client";

import { useRouter } from "next/navigation";
import { EntityForm } from "@/components/entities";
import { useEntities, useEntityTypes } from "@/hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Boxes } from "lucide-react";

export default function CreateEntityPage() {
  const router = useRouter();
  const { entities, create, isLoaded: entitiesLoaded } = useEntities();
  const { entityTypes, isLoaded: typesLoaded } = useEntityTypes();

  const handleSubmit = (data: Parameters<typeof create>[0]) => {
    create(data);
    router.push("/entities");
  };

  if (!entitiesLoaded || !typesLoaded) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 text-primary border-primary/20 flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border shadow-sm">
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
          <Separator />
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

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
        entityTypes={entityTypes}
        entities={entities}
        onSubmit={handleSubmit}
        onCancel={() => router.push("/entities")}
      />
    </div>
  );
}
