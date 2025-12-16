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
import { Eye, Trash2, ArrowRight, EllipsisVertical } from "lucide-react";
import type { Entity } from "@/types";
import type { WorkflowRecordStatus } from "@/types/workflow-record";
import { formatDate } from "@/lib/code-generator";
import { Separator } from "../ui/separator";
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

  return (
    <Card
      className="group cursor-pointer gap-4 p-6 transition-all duration-200 hover:shadow-lg"
      onClick={handleCardClick}
    >
      <div className="flex items-center justify-between gap-2">
        <Badge variant="info" className="rounded-md">
          {entity.entity_type.name}
        </Badge>
        <StatusBadge status={status} className="ml-auto" />
      </div>
      <div className="flex items-center justify-between px-0.5">
        <div className="space-y-2">
          <h1 className="text-lg font-semibold">{entity.name}</h1>
          <p className="text-muted-foreground text-xs">{entity.code}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
            >
              <EllipsisVertical className="h-4 w-4" />
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
              className="text-red-600"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(entity.id);
              }}
            >
              <Trash2 className="mr-2 h-4 w-4 text-red-600" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Separator />
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-xs">
          Updated {formatDate(entity.updated_at)}
        </p>
        <ArrowRight className="text-muted-foreground h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
      </div>
    </Card>
  );
}
