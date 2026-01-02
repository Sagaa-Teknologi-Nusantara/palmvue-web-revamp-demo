import { ArrowLeft, Edit2, Trash2 } from "lucide-react";
import { DynamicIcon, type IconName } from "lucide-react/dynamic";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getColorByLabel } from "@/lib/colors";
import type { EntityType } from "@/types";

interface EntityTypeHeaderProps {
  entityType: EntityType;
  onDeleteClick: () => void;
}

export function EntityTypeHeader({
  entityType,
  onDeleteClick,
}: EntityTypeHeaderProps) {
  const { icon: typeIcon, color: typeColorLabel } = entityType;
  const { bg: typeBgColor, fg: typeColor } = getColorByLabel(typeColorLabel);

  return (
    <div>
      <Button
        variant="ghost"
        asChild
        className="hover:text-primary mb-4 pl-0 hover:bg-transparent"
      >
        <Link href="/entity-types">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Entity Types
        </Link>
      </Button>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex items-center gap-4">
            <div
              className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border-[0.5px] shadow-sm transition-transform hover:scale-105"
              style={{
                backgroundColor: typeBgColor,
                color: typeColor,
                borderColor: typeColor,
              }}
            >
              <DynamicIcon
                name={(typeIcon as IconName) || "box"}
                className="h-8 w-8"
              />
            </div>
            <div className="space-y-1">
              <h1 className="text-foreground text-3xl font-bold tracking-tight">
                {entityType.name}
              </h1>
              <p className="text-muted-foreground max-w-xl text-sm">
                {entityType.description || "No description provided."}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="h-9" asChild>
              <Link href={`/entity-types/${entityType.id}/edit`}>
                <Edit2 className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20 h-9"
              onClick={onDeleteClick}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
        <Separator />
      </div>
    </div>
  );
}
