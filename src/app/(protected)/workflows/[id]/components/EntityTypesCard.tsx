import { Box } from "lucide-react";
import { DynamicIcon, type IconName } from "lucide-react/dynamic";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getColorByLabel } from "@/lib/colors";
import type { EntityTypeRef } from "@/types";

interface EntityTypesCardProps {
  entityTypes: EntityTypeRef[];
}

export function EntityTypesCard({ entityTypes }: EntityTypesCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <span className="bg-primary/10 text-primary rounded-md p-1.5">
            <Box className="h-4 w-4" />
          </span>
          Assigned To
        </CardTitle>
        <CardDescription>Entity types using this workflow</CardDescription>
      </CardHeader>
      <CardContent>
        {entityTypes.length > 0 ? (
          <div className="space-y-3">
            {entityTypes.map((et) => {
              const { bg: typeBgColor, fg: typeColor } = getColorByLabel(
                et.color,
              );

              return (
                <Link
                  key={et.id}
                  href={`/entity-types/${et.id}`}
                  className="group bg-card hover:bg-muted/50 hover:border-primary/50 flex items-center gap-3 rounded-lg border p-3 transition-colors"
                >
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border-[0.5px] shadow-sm"
                    style={{
                      backgroundColor: typeBgColor,
                      color: typeColor,
                      borderColor: typeColor,
                    }}
                  >
                    <DynamicIcon
                      name={(et.icon as IconName) || "box"}
                      className="h-5 w-5"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="group-hover:text-primary truncate text-sm font-medium transition-colors">
                      {et.name}
                    </p>
                    <div className="flex items-center gap-1.5">
                      <span className="text-muted-foreground bg-muted rounded px-1.5 py-0.5 font-mono text-[10px]">
                        {et.prefix}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-muted-foreground py-6 text-center text-sm">
            <p>Not assigned to any entity types.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
