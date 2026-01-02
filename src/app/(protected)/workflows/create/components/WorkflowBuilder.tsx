"use client";

import { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlayCircle, Repeat, Zap } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import type {
  CompletionAction,
  CreateWorkflowInput,
  StartWorkflowConfig,
} from "@/types";

import {
  CompletionActionEditor,
  type CompletionActionsErrors,
  hasCompletionActionErrors,
  validateCompletionActions,
} from "./CompletionActionEditor";
import { EntityTypePicker } from "./EntityTypePicker";
import { FormFooter } from "./FormFooter";
import { type StepData, StepEditModal } from "./StepEditModal";
import { StepsList } from "./StepsList";

const workflowSchema = z.object({
  name: z.string().min(1, "Workflow name is required"),
  isAutoStart: z.boolean(),
  isLoopable: z.boolean(),
});

interface WorkflowBuilderProps {
  onSubmit: (data: CreateWorkflowInput) => void;
  onCancel: () => void;
}

export function WorkflowBuilder({ onSubmit, onCancel }: WorkflowBuilderProps) {
  const [steps, setSteps] = useState<StepData[]>([]);
  const [completionActions, setCompletionActions] = useState<
    CompletionAction[]
  >([]);
  const [selectedEntityTypeIds, setSelectedEntityTypeIds] = useState<string[]>(
    [],
  );
  const [includeExisting, setIncludeExisting] = useState(false);
  const [completionActionErrors, setCompletionActionErrors] =
    useState<CompletionActionsErrors>({});

  const [editingStep, setEditingStep] = useState<StepData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalKey, setModalKey] = useState(0);

  const [deleteStepId, setDeleteStepId] = useState<string | null>(null);

  const form = useForm({
    resolver: zodResolver(workflowSchema),
    defaultValues: {
      name: "",
      isAutoStart: false,
      isLoopable: false,
    },
  });

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
    setModalKey((prev) => prev + 1);
    setIsModalOpen(true);
  };

  const handleEditStep = (step: StepData) => {
    setEditingStep(step);
    setModalKey((prev) => prev + 1);
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

  const handleEntityTypeIdsChange = (newIds: string[]) => {
    setSelectedEntityTypeIds(newIds);

    if (newIds.length === 0) {
      setCompletionActions([]);
      setIncludeExisting(false);
      return;
    }

    setCompletionActions((prev) =>
      prev.filter((action) => {
        if (action.type === "create_entities") {
          return true;
        }
        if (action.type === "start_workflow") {
          const config = action.config as StartWorkflowConfig;
          return (
            !config.entity_type_id || newIds.includes(config.entity_type_id)
          );
        }
        return true;
      }),
    );
  };

  const handleSubmit = (values: {
    name: string;
    isAutoStart: boolean;
    isLoopable: boolean;
  }) => {
    if (steps.length === 0) {
      return;
    }

    const actionErrors = validateCompletionActions(completionActions, steps);
    if (hasCompletionActionErrors(actionErrors)) {
      setCompletionActionErrors(actionErrors);
      return;
    }
    setCompletionActionErrors({});

    const workflowData: CreateWorkflowInput = {
      name: values.name,
      entity_type_ids: selectedEntityTypeIds,
      include_existing: includeExisting,
      is_auto_start: values.isAutoStart,
      is_loopable: values.isLoopable,
      steps: steps.map((step, index) => ({
        name: step.name,
        order_index: index,
        requires_approval: step.requiresApproval,
        form: {
          name: step.formName,
          schema: step.formSchema,
        },
      })),
      on_complete: completionActions,
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
                <CardContent className="space-y-6">
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

                  {/* Entity Type Multi-Select */}
                  <EntityTypePicker
                    selectedIds={selectedEntityTypeIds}
                    onChange={handleEntityTypeIdsChange}
                    includeExisting={includeExisting}
                    onIncludeExistingChange={setIncludeExisting}
                  />

                  {/* Toggles */}
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="isAutoStart"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                          <div className="space-y-0.5">
                            <FormLabel className="flex items-center gap-2">
                              <Zap className="text-muted-foreground h-4 w-4" />
                              Auto Start
                            </FormLabel>
                            <FormDescription className="text-xs">
                              Automatically start when entity is created.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="isLoopable"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                          <div className="space-y-0.5">
                            <FormLabel className="flex items-center gap-2">
                              <Repeat className="text-muted-foreground h-4 w-4" />
                              Loopable
                            </FormLabel>
                            <FormDescription className="text-xs">
                              Allow workflow to restart after completion.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Completion Actions */}
              <CompletionActionEditor
                value={completionActions}
                onChange={setCompletionActions}
                selectedEntityTypeIds={selectedEntityTypeIds}
                steps={steps}
                errors={completionActionErrors}
              />
            </div>

            {/* Right Column: Steps */}
            <div className="md:col-span-3">
              <StepsList
                steps={steps}
                onDragEnd={handleDragEnd}
                onAddStep={handleAddStep}
                onEditStep={handleEditStep}
                onDeleteStep={setDeleteStepId}
              />
            </div>
          </div>
          <FormFooter onCancel={onCancel} isDisabled={steps.length === 0} />
        </form>
      </Form>

      <StepEditModal
        key={modalKey}
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
