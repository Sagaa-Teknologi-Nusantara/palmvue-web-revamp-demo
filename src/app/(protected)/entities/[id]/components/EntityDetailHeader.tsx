import { ArrowLeft, Trash2 } from "lucide-react";
import { DynamicIcon, type IconName } from "lucide-react/dynamic";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/workflows";
import { getColorByLabel } from "@/lib/colors";
import type { Entity } from "@/types/entity";
import type { WorkflowRecordStatus } from "@/types/workflow-record";

interface EntityDetailHeaderProps {
  entity: Entity;
  entityStatus: WorkflowRecordStatus;
  onDeleteClick: () => void;
}

export function EntityDetailHeader({
  entity,
  entityStatus,
  onDeleteClick,
}: EntityDetailHeaderProps) {
  const typeInfo = entity.entity_type;
  const { bg: typeBgColor, fg: typeColor } = getColorByLabel(
    typeInfo?.color ?? "neutral",
  );

  return (
    <div>
      <Button
        variant="ghost"
        asChild
        className="hover:text-primary mb-4 pl-0 hover:bg-transparent"
      >
        <Link href="/entities">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Entities
        </Link>
      </Button>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex items-center gap-4">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border-[0.5px] shadow-sm"
              style={{
                backgroundColor: typeBgColor,
                color: typeColor,
                borderColor: typeColor,
              }}
            >
              <DynamicIcon
                name={(typeInfo?.icon as IconName) || "box"}
                className="h-6 w-6"
              />
            </div>
            <div className="space-y-1">
              <h1 className="text-foreground text-3xl font-bold tracking-tight">
                {entity.name}
              </h1>
              <div className="flex flex-wrap items-center gap-3">
                <div className="bg-muted text-muted-foreground flex items-center gap-1.5 rounded-md px-2 py-0.5 font-mono text-xs font-medium">
                  <span>{entity.code}</span>
                </div>

                <StatusBadge status={entityStatus} />
              </div>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20 h-9"
            onClick={onDeleteClick}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Entity
          </Button>
        </div>
        <Separator />
      </div>
    </div>
  );
}
