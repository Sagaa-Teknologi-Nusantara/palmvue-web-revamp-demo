"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GripVertical, Edit2, Trash2, FileText } from "lucide-react";
import { cn } from "@/lib/cn";

interface StepCardProps {
  id: string;
  name: string;
  formName: string;
  order: number;
  onEdit: () => void;
  onDelete: () => void;
}

export function StepCard({
  id,
  name,
  formName,
  order,
  onEdit,
  onDelete,
}: StepCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn("group relative flex gap-4", isDragging && "opacity-50")}
    >
      {/* Number Bubble - Acts as Drag Handle Target visually but sortable logic is on the car/grip */}
      <div className="border-background bg-muted text-muted-foreground group-hover:border-primary/20 group-hover:bg-primary group-hover:text-primary-foreground relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-4 text-sm font-bold shadow-sm transition-colors">
        {order + 1}
      </div>

      {/* Step Content Card */}
      <Card
        className={cn(
          "w-full border p-0 transition-all hover:shadow-md",
          isDragging ? "shadow-lg" : "shadow-sm",
        )}
      >
        <div className="flex items-center gap-4 p-4">
          {/* Drag Handle */}
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="hover:bg-muted text-muted-foreground cursor-grab rounded-md p-1.5 transition-colors"
          >
            <GripVertical className="h-5 w-5" />
          </button>

          <div className="min-w-0 flex-1">
            <div className="mb-1 flex items-center justify-between">
              <h4 className="truncate pr-2 text-base font-semibold">{name}</h4>
              <Badge variant="secondary" className="shrink-0 text-[10px]">
                Step {order + 1}
              </Badge>
            </div>
            <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
              <FileText className="h-3 w-3" />
              Form:{" "}
              <span className="text-foreground font-medium">{formName}</span>
            </div>
          </div>

          <div className="ml-2 flex items-center gap-1 border-l pl-3">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onEdit}
              className="text-muted-foreground hover:text-foreground h-8 w-8"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onDelete}
              className="text-muted-foreground hover:text-destructive h-8 w-8"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
