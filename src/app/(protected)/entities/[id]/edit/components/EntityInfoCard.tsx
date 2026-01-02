"use client";

import { Calendar, Clock, GitFork } from "lucide-react";
import { DynamicIcon, type IconName } from "lucide-react/dynamic";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getColorByLabel } from "@/lib/colors";
import { formatDate } from "@/lib/date";
import type { Entity } from "@/types";

interface EntityInfoCardProps {
  entity: Entity;
}

export function EntityInfoCard({ entity }: EntityInfoCardProps) {
  const colors = getColorByLabel(entity.entity_type.color);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <span className="bg-primary/10 text-primary rounded-md p-1.5">
            <GitFork className="h-4 w-4" />
          </span>
          Entity Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4">
          {/* Entity Type */}
          <div className="bg-muted/40 border-muted/60 flex items-center justify-between rounded-lg border p-3">
            <div className="space-y-1">
              <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                Entity Type
              </p>
              <p className="text-sm font-medium">{entity.entity_type.name}</p>
            </div>
            <div
              className="flex h-8 w-8 items-center justify-center rounded-md"
              style={{ backgroundColor: colors.bg, color: colors.fg }}
            >
              <DynamicIcon
                name={(entity.entity_type.icon as IconName) || "box"}
                className="h-4 w-4"
              />
            </div>
          </div>

          {/* Entity Code */}
          <div className="bg-muted/40 border-muted/60 flex items-center justify-between rounded-lg border p-3">
            <div className="space-y-1">
              <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                Code
              </p>
              <p className="text-sm font-medium">{entity.code}</p>
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
