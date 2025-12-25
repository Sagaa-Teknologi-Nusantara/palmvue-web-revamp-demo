"use client";

import { ArrowRight, Calendar, Eye, MoreVertical, Trash2 } from "lucide-react";
import { DynamicIcon, type IconName } from "lucide-react/dynamic";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getColorByLabel } from "@/lib/colors";
import { formatDate } from "@/lib/date";
import type { Entity } from "@/types";

interface EntityCardProps {
  entity: Entity;
  onDelete: (id: string) => void;
}

export function EntityCard({ entity, onDelete }: EntityCardProps) {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/entities/${entity.id}`);
  };

  const { icon, color, name: typeName } = entity.entity_type;
  const colorOption = getColorByLabel(color);

  return (
    <Card
      className="group relative cursor-pointer gap-2 space-y-0 overflow-hidden p-0 transition-all duration-200 hover:shadow-md"
      onClick={handleCardClick}
    >
      <div className="p-6 pb-4">
        <div className="flex items-center gap-4">
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border-[0.5px] shadow-sm"
            style={{
              backgroundColor: colorOption.bg,
              color: colorOption.fg,
              borderColor: colorOption.fg,
            }}
          >
            <DynamicIcon
              name={(icon as IconName) || "box"}
              className="h-6 w-6"
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2">
                <span
                  className="truncate text-xs font-bold tracking-wider uppercase opacity-90"
                  style={{ color: colorOption.fg }}
                >
                  {typeName}
                </span>
                <span className="text-muted-foreground/30 shrink-0">•</span>
                <span className="bg-muted/50 text-muted-foreground shrink-0 rounded px-1.5 py-0.5 font-mono text-xs font-medium">
                  {entity.code}
                </span>
              </div>

              <div className="flex shrink-0 items-center gap-1">
                <DropdownMenu>
                  <DropdownMenuTrigger
                    asChild
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground -mr-2 h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/entities/${entity.id}`);
                      }}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(entity.id);
                      }}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <h3 className="text-foreground text-lg leading-tight font-bold">
              {entity.name}
            </h3>
          </div>
        </div>
      </div>

      <div className="border-border bg-primary-light/40 text-muted-foreground flex items-center justify-between border-t px-6 py-[0.6rem] text-xs">
        <div className="flex items-center gap-1.5">
          <Calendar className="text-muted-foreground/70 h-3.5 w-3.5" />
          <span>Updated {formatDate(entity.updated_at)}</span>
        </div>
        <ArrowRight className="text-muted-foreground/70 h-4 w-4 opacity-0 transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-100" />
      </div>
    </Card>
  );
}
