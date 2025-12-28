"use client";

import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  restrictToVerticalAxis,
  restrictToWindowEdges,
} from "@dnd-kit/modifiers";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Plus, Split } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { StepCard } from "./StepCard";
import type { StepData } from "./StepEditModal";

interface StepsListProps {
  steps: StepData[];
  onDragEnd: (event: DragEndEvent) => void;
  onAddStep: () => void;
  onEditStep: (step: StepData) => void;
  onDeleteStep: (id: string) => void;
}

export function StepsList({
  steps,
  onDragEnd,
  onAddStep,
  onEditStep,
  onDeleteStep,
}: StepsListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  return (
    <Card className="md:bg-card h-full border-none bg-transparent shadow-none md:border md:shadow-sm">
      <CardHeader className="px-0 md:px-6">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <span className="bg-primary/10 text-primary rounded-md p-1.5">
                <Split className="h-4 w-4" />
              </span>
              Workflow Steps
            </CardTitle>
            <CardDescription className="mt-1">
              Drag and drop to reorder steps
            </CardDescription>
          </div>
          <Button type="button" size="sm" onClick={onAddStep}>
            <Plus className="mr-2 h-4 w-4" />
            Add Step
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-0 pt-0 md:px-6">
        {steps.length === 0 ? (
          <div className="border-border bg-muted/20 rounded-lg border-2 border-dashed py-12 text-center">
            <p className="text-muted-foreground mb-4 text-sm">
              No steps added yet. Start building your workflow.
            </p>
            <Button type="button" variant="outline" onClick={onAddStep}>
              <Plus className="mr-2 h-4 w-4" />
              Add First Step
            </Button>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={onDragEnd}
            modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
          >
            <SortableContext
              items={steps.map((s) => s.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-6 pt-4">
                {steps.map((step, index) => (
                  <div key={step.id} className="group relative">
                    {/* Timeline Line */}
                    {index !== steps.length - 1 && (
                      <div className="bg-border absolute top-10 -bottom-6 left-[1.15rem] w-0.5" />
                    )}
                    <StepCard
                      id={step.id}
                      name={step.name}
                      formName={step.formName}
                      order={index}
                      onEdit={() => onEditStep(step)}
                      onDelete={() => onDeleteStep(step.id)}
                    />
                  </div>
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </CardContent>
    </Card>
  );
}
