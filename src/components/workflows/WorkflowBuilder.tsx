'use client';

import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { StepCard } from './StepCard';
import { StepEditModal, type StepData } from './StepEditModal';
import { Plus } from 'lucide-react';
import type { CreateWorkflowInput } from '@/types';

const workflowSchema = z.object({
  name: z.string().min(1, 'Workflow name is required'),
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
    defaultValues: { name: '' },
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
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

  const handleSaveStep = (data: Omit<StepData, 'id'>) => {
    if (editingStep) {
      setSteps((prev) =>
        prev.map((s) =>
          s.id === editingStep.id ? { ...s, ...data } : s
        )
      );
    } else {
      setSteps((prev) => [
        ...prev,
        { id: uuidv4(), ...data },
      ]);
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
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Workflow Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Palm Tree Assessment" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Steps</h3>
              <Button type="button" variant="outline" onClick={handleAddStep}>
                <Plus className="mr-2 h-4 w-4" />
                Add Step
              </Button>
            </div>

            {steps.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-gray-500 mb-4">
                  No steps added yet. Add steps to define your workflow.
                </p>
                <Button type="button" onClick={handleAddStep}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add First Step
                </Button>
              </Card>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={steps.map((s) => s.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-3">
                    {steps.map((step, index) => (
                      <StepCard
                        key={step.id}
                        id={step.id}
                        name={step.name}
                        formName={step.formName}
                        order={index}
                        onEdit={() => handleEditStep(step)}
                        onDelete={() => setDeleteStepId(step.id)}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={steps.length === 0}>
              Create Workflow
            </Button>
          </div>
        </form>
      </Form>

      <StepEditModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveStep}
        step={editingStep}
      />

      <AlertDialog open={!!deleteStepId} onOpenChange={() => setDeleteStepId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Step</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this step? This action cannot be undone.
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
