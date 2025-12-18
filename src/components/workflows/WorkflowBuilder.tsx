"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  restrictToVerticalAxis,
  restrictToWindowEdges,
} from "@dnd-kit/modifiers";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { StepCard } from "./StepCard";
import { StepEditModal, type StepData } from "./StepEditModal";
import { Plus, PlayCircle, Split } from "lucide-react";
import type { CreateWorkflowInput } from "@/types";

const workflowSchema = z.object({
  name: z.string().min(1, "Workflow name is required"),
});

interface WorkflowBuilderProps {
  onSubmit: (data: CreateWorkflowInput) => void;
  onCancel: () => void;
}

export function WorkflowBuilder({ onSubmit, onCancel }: WorkflowBuilderProps) {
  const [steps, setSteps] = useState<StepData[]>([]);
  const [editingStep, setEditingStep] = useState<StepData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteStepId, setDeleteStepId] = useState<string | null>(null);

  const form = useForm({
    resolver: zodResolver(workflowSchema),
    defaultValues: { name: "" },
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setSteps((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleAddStep = () => {
    setEditingStep(null);
    setIsModalOpen(true);
  };

  const handleEditStep = (step: StepData) => {
    setEditingStep(step);
    setIsModalOpen(true);
  };

  const handleSaveStep = (data: Omit<StepData, "id">) => {
    if (editingStep) {
      setSteps((prev) =>
        prev.map((s) => (s.id === editingStep.id ? { ...s, ...data } : s)),
      );
    } else {
      setSteps((prev) => [...prev, { id: uuidv4(), ...data }]);
    }
  };

  const handleDeleteStep = () => {
    if (deleteStepId) {
      setSteps((prev) => prev.filter((s) => s.id !== deleteStepId));
      setDeleteStepId(null);
    }
  };

  const handleSubmit = (values: { name: string }) => {
    if (steps.length === 0) {
      return;
    }

    const workflowData: CreateWorkflowInput = {
      name: values.name,
      steps: steps.map((step, index) => ({
        name: step.name,
        order_index: index,
        form: {
          name: step.formName,
          schema: step.formSchema,
        },
      })),
    };

    onSubmit(workflowData);
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="grid gap-6 md:grid-cols-5">
            {/* Left Column: Details */}
            <div className="space-y-6 md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <span className="bg-primary/10 text-primary rounded-md p-1.5">
                      <PlayCircle className="h-4 w-4" />
                    </span>
                    Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Workflow Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Palm Tree Assessment"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          A descriptive name for your workflow.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex flex-col gap-3 pt-4">
                    <Button
                      type="submit"
                      disabled={steps.length === 0}
                      className="w-full"
                    >
                      Create Workflow
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onCancel}
                      className="w-full"
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Steps */}
            <div className="md:col-span-3">
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
                    <Button type="button" size="sm" onClick={handleAddStep}>
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
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleAddStep}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add First Step
                      </Button>
                    </div>
                  ) : (
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={handleDragEnd}
                      modifiers={[
                        restrictToVerticalAxis,
                        restrictToWindowEdges,
                      ]}
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
                                onEdit={() => handleEditStep(step)}
                                onDelete={() => setDeleteStepId(step.id)}
                              />
                            </div>
                          ))}
                        </div>
                      </SortableContext>
                    </DndContext>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </Form>

      <StepEditModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveStep}
        step={editingStep}
      />

      <AlertDialog
        open={!!deleteStepId}
        onOpenChange={() => setDeleteStepId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Step</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this step? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteStep}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
