"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout";
import { EntityTypeCardList } from "@/components/entity-types";
import { useEntityTypes } from "@/hooks";
import { Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function EntityTypesPage() {
  const { entityTypes, isLoaded } = useEntityTypes();

  if (!isLoaded) {
    return (
      <div>
        <PageHeader
          title="Entity Types"
          description="Manage entity type definitions"
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Entity Types"
        description="Manage entity type definitions"
        actions={
          <Button asChild>
            <Link href="/entity-types/create">
              <Plus className="mr-2 h-4 w-4" />
              Create Entity Type
            </Link>
          </Button>
        }
      />

      <EntityTypeCardList entityTypes={entityTypes} />
    </div>
  );
}
