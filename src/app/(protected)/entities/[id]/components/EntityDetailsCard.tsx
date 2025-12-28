import { Calendar, Clock, ExternalLink, GitFork } from "lucide-react";
import { DynamicIcon, type IconName } from "lucide-react/dynamic";
import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getColorByLabel } from "@/lib/colors";
import { formatDate } from "@/lib/date";
import type { Entity } from "@/types/entity";

interface EntityDetailsCardProps {
  entity: Entity;
}

export function EntityDetailsCard({ entity }: EntityDetailsCardProps) {
  const typeInfo = entity.entity_type;
  const { fg: typeColor } = getColorByLabel(typeInfo?.color ?? "neutral");

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <span className="bg-primary/10 text-primary rounded-md p-1.5">
            <GitFork className="h-4 w-4" />
          </span>
          Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4">
          <div className="bg-muted/40 border-muted/60 flex items-center justify-between rounded-lg border p-3">
            <div className="space-y-1">
              <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                Entity Type
              </p>
              <Link
                href={`/entity-types/${entity.entity_type_id}`}
                className="text-primary inline-flex items-center gap-1.5 text-sm font-medium hover:underline"
              >
                {typeInfo?.name ?? "Unknown"}
                <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
            <div
              className="bg-background flex h-8 w-8 items-center justify-center rounded-full border"
              style={{ color: typeColor }}
            >
              <DynamicIcon
                name={(typeInfo?.icon as IconName) || "box"}
                className="h-4 w-4"
              />
            </div>
          </div>

          <div className="bg-muted/40 border-muted/60 flex items-center justify-between rounded-lg border p-3">
            <div className="space-y-1">
              <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                Parent Entity
              </p>
              {entity.parent ? (
                <Link
                  href={`/entities/${entity.parent_id}`}
                  className="text-primary inline-flex items-center gap-1.5 text-sm font-medium hover:underline"
                >
                  {entity.parent.name}
                  <span className="text-muted-foreground font-mono text-xs font-normal">
                    ({entity.parent.code})
                  </span>
                  <ExternalLink className="h-3 w-3" />
                </Link>
              ) : (
                <p className="text-muted-foreground text-sm italic">None</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
                <Calendar className="h-3.5 w-3.5" /> Created
              </p>
              <p className="text-sm font-medium">
                {formatDate(entity.created_at)}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
                <Clock className="h-3.5 w-3.5" /> Updated
              </p>
              <p className="text-sm font-medium">
                {formatDate(entity.updated_at)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
