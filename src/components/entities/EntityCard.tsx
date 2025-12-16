"use client";

import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DynamicIcon, type IconName } from "lucide-react/dynamic";
import { MoreVertical, Eye, Trash2, Calendar, ArrowRight } from "lucide-react";
import type { Entity } from "@/types";
import type { WorkflowRecordStatus } from "@/types/workflow-record";
import { formatDate } from "@/lib/code-generator";
import { StatusBadge } from "./StatusBadge";

interface EntityCardProps {
  entity: Entity;
  status: WorkflowRecordStatus;
  onDelete: (id: string) => void;
}

export function EntityCard({ entity, status, onDelete }: EntityCardProps) {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/entities/${entity.id}`);
  };

  const { icon, fg_color, name: typeName } = entity.entity_type;

  return (
    <Card
      className="group relative cursor-pointer space-y-0 overflow-hidden p-0 transition-all duration-200 hover:shadow-md"
      onClick={handleCardClick}
    >
      <div className="px-6 pt-6 space-y-4">
        <div className="flex items-center justify-between">
          <div
            className="flex items-center gap-2 text-xs font-medium tracking-wider uppercase opacity-80"
            style={{ color: fg_color }}
          >
            <DynamicIcon
              name={(icon as IconName) || "box"}
              className="h-3.5 w-3.5"
            />
            <span>{typeName}</span>
            <span className="text-gray-300">•</span>
            <span className="text-gray-500">{entity.code}</span>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button
                variant="ghost"
                size="icon"
                className="-mt-2 -mr-3 h-8 w-8 text-gray-400 opacity-0 transition-opacity group-hover:opacity-100"
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
                className="text-red-600 focus:text-red-600"
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

        <div className="flex items-start justify-between gap-4">
          <h3 className="line-clamp-2 text-lg leading-tight font-bold text-gray-900">
            {entity.name}
          </h3>
          <StatusBadge status={status} className="shrink-0" />
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50/70 px-6 py-4 text-xs text-gray-600">
        <div className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5 text-gray-400" />
          <span>Updated {formatDate(entity.updated_at)}</span>
        </div>
        <ArrowRight className="h-4 w-4 text-gray-400 opacity-0 transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-100" />
      </div>
    </Card>
  );
}
