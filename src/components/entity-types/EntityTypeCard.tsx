"use client";

import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DynamicIcon, type IconName } from "lucide-react/dynamic";
import { MoreVertical, Eye, Trash2, FileCode, Calendar } from "lucide-react";
import type { EntityType } from "@/types";
import { formatDate } from "@/lib/code-generator";
import { Separator } from "@/components/ui/separator";

interface EntityTypeCardProps {
  entityType: EntityType;
}

export function EntityTypeCard({ entityType }: EntityTypeCardProps) {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/entity-types/${entityType.id}`);
  };

  const propertyNames = Object.values(entityType.metadata_schema.properties)
    .map((item) => item.title)
    .filter(Boolean);
  const displayProperties = propertyNames.slice(0, 5);

  return (
    <Card
      className="group relative cursor-pointer overflow-hidden p-0 transition-all duration-200 hover:shadow-lg"
      onClick={handleCardClick}
    >
      <div className="px-6 pt-6">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border-[0.5px]"
              style={{
                backgroundColor: entityType.bg_color,
                color: entityType.fg_color,
                borderColor: entityType.fg_color,
              }}
            >
              <DynamicIcon
                name={(entityType.icon as IconName) || "box"}
                className="h-5 w-5"
              />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">{entityType.name}</h2>
              <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs font-medium text-gray-500">
                {entityType.prefix}
              </code>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button
                variant="ghost"
                size="icon"
                className="-mr-2 h-8 w-8 text-gray-400 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/entity-types/${entityType.id}`);
                }}
              >
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600 focus:text-red-600"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <p className="line-clamp-2 min-h-10 text-sm text-gray-500">
          {entityType.description}
        </p>

        <div className="min-h-24 rounded-md border border-gray-100 bg-gray-50/50 p-3">
          <div className="mb-2 flex items-center gap-2">
            <FileCode className="h-3 w-3 text-gray-400" />
            <span className="text-xs font-medium text-gray-500">
              Schema Properties
            </span>
          </div>
          <div className="flex h-14 flex-wrap content-start gap-1.5 overflow-hidden">
            {displayProperties.map((prop) => (
              <Badge
                key={prop}
                variant="outline"
                className="bg-white text-[10px] font-normal text-gray-600"
              >
                {prop}
              </Badge>
            ))}
            {propertyNames.length === 0 && (
              <span className="text-[10px] text-gray-400 italic">
                No properties defined
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-gray-200 bg-primary-light/40 px-6 py-3 text-xs text-gray-600">
        <div className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5 text-gray-400" />
          <span>Updated {formatDate(entityType.updated_at)}</span>
        </div>
      </div>
    </Card>
  );
}
