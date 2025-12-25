import { Box, Calendar, Clock } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/date";
import type { EntityType } from "@/types";

interface EntityTypeDetailsCardProps {
  entityType: EntityType;
}

export function EntityTypeDetailsCard({
  entityType,
}: EntityTypeDetailsCardProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <span className="bg-primary/10 text-primary rounded-md p-1.5">
            <Box className="h-4 w-4" />
          </span>
          Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4">
          <div className="bg-muted/40 border-muted/60 flex items-center justify-between rounded-lg border p-3">
            <div className="space-y-1">
              <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                Prefix
              </p>
              <p className="font-mono text-sm font-semibold">
                {entityType.prefix}
              </p>
            </div>
            <div className="bg-background text-muted-foreground flex h-8 w-8 items-center justify-center rounded-md border text-xs font-bold shadow-sm">
              #
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
                <Calendar className="h-3.5 w-3.5" /> Created
              </p>
              <p className="text-sm font-medium">
                {formatDate(entityType.created_at)}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
                <Clock className="h-3.5 w-3.5" /> Updated
              </p>
              <p className="text-sm font-medium">
                {formatDate(entityType.updated_at)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
