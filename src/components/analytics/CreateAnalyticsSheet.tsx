"use client";

import type { AnalyticsDefinition } from "@/api/types/analytics";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { AnalyticsForm } from "./AnalyticsForm";

interface CreateAnalyticsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  definition?: AnalyticsDefinition;
}

export function CreateAnalyticsSheet({
  open,
  onOpenChange,
  definition,
}: CreateAnalyticsSheetProps) {
  const isEditing = !!definition;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>
            {isEditing ? "Edit Analytics" : "Create Analytics"}
          </SheetTitle>
          <SheetDescription>
            {isEditing
              ? "Update your analytics definition"
              : "Define a custom analytics query with visualizations"}
          </SheetDescription>
        </SheetHeader>
        <div className="p-4">
          <AnalyticsForm
            definition={definition}
            onSuccess={() => onOpenChange(false)}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
