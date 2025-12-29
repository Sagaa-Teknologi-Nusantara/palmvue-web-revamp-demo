import { Code2 } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Entity } from "@/types/entity";
import type { EntityType } from "@/types/entity-type";

interface EntityMetadataCardProps {
  entity: Entity;
  entityType: EntityType | undefined;
  isLoadingEntityType: boolean;
}

export function EntityMetadataCard({
  entity,
  entityType,
  isLoadingEntityType,
}: EntityMetadataCardProps) {
  const typeInfo = entity.entity_type;

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <span className="bg-primary/10 text-primary rounded-md p-1.5">
            <Code2 className="h-4 w-4" />
          </span>
          Metadata
        </CardTitle>
        <CardDescription>
          Custom attributes for this {typeInfo?.name ?? "entity"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {Object.keys(entity.metadata).length > 0 ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {Object.entries(entity.metadata).map(([key, value]) => {
              // Get proper label from entity type schema if available
              const propSchema = entityType?.metadata_schema?.properties?.[key];
              const label = propSchema?.title || key;

              return (
                <div
                  key={key}
                  className="bg-card group rounded-lg border p-3 shadow-sm transition-shadow hover:shadow-md"
                >
                  <p className="text-muted-foreground group-hover:text-primary mb-1 text-xs font-medium transition-colors">
                    {label}
                  </p>
                  <p className="text-sm font-medium break-all">
                    {typeof value === "boolean"
                      ? value
                        ? "Yes"
                        : "No"
                      : String(value)}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-muted-foreground bg-muted/20 flex flex-col items-center justify-center rounded-lg border border-dashed py-8 text-center">
            <p>No metadata configured.</p>
          </div>
        )}
        {isLoadingEntityType && (
          <p className="text-muted-foreground mt-2 text-xs">
            Loading field labels...
          </p>
        )}
      </CardContent>
    </Card>
  );
}
