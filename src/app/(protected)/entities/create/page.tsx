"use client";

import { Boxes } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { EntityForm, EntitySelector } from "@/components/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useEntities, useEntityTypes } from "@/hooks";

export default function CreateEntityPage() {
  const router = useRouter();
  const { entities, create, isLoaded: entitiesLoaded } = useEntities();
  const { entityTypes, isLoaded: typesLoaded } = useEntityTypes();

  // Demo state for EntitySelector
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null);

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

      {/* Demo: EntitySelector Component */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-base">
            EntitySelector Demo (for testing)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <EntitySelector
            value={selectedParentId}
            onChange={setSelectedParentId}
            placeholder="Select a parent entity..."
          />
          <p className="text-muted-foreground mt-2 text-sm">
            Selected ID: {selectedParentId || "None"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
