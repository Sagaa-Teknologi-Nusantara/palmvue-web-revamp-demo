"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { BoxSelect, Edit2, GripVertical, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";
import { getFieldConfig } from "@/lib/field-types";

import { type FieldConfig } from "./types";

interface FieldCardProps {
  field: FieldConfig;
  onEdit: () => void;
  onDelete: () => void;
}

export function FieldCard({ field, onEdit, onDelete }: FieldCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const config = getFieldConfig(field.type);
  const FieldIcon = config?.icon || BoxSelect;

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        "group bg-card hover:border-primary/30 border p-0 shadow-sm transition-all duration-200 hover:shadow-md",
        isDragging && "ring-primary/20 rotate-1 opacity-50 ring-2",
      )}
    >
      <div className="flex items-center gap-0 p-3">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="text-muted-foreground/40 hover:text-foreground hover:bg-muted mr-2 cursor-grab rounded-md p-1.5 transition-colors"
        >
          <GripVertical className="h-4 w-4" />
        </button>

        <div
          className={cn(
            "bg-muted/30 border-border/50 mr-3 rounded-md border p-2",
            config?.iconContainerColor,
          )}
        >
          <FieldIcon className="h-4 w-4" />
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-center">
          <div className="flex items-center gap-2">
            <span className="text-foreground truncate text-sm font-semibold">
              {field.label}
            </span>
            {field.required && (
              <span className="text-destructive bg-destructive/10 rounded-sm px-1.5 py-0.5 text-[10px] font-bold tracking-wider uppercase">
                Required
              </span>
            )}
          </div>
          <div className="mt-0.5 flex items-center gap-2">
            <code className="text-muted-foreground bg-muted/50 border-border/50 rounded border px-1 py-0.5 font-mono text-[10px]">
              {field.name}
            </code>
            <span className="text-muted-foreground/70 flex items-center gap-1 text-[10px] capitalize">
              • {config.label}
              {field.type === "dropdown" &&
                field.options &&
                ` (${field.options.length})`}
            </span>
          </div>
        </div>

        <div className="ml-2 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onEdit}
            className="text-muted-foreground hover:text-foreground hover:bg-muted h-8 w-8"
          >
            <Edit2 className="h-3.5 w-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onDelete}
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 w-8"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
