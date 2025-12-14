'use client';

import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS } from '@/lib/constants';
import type { WorkflowRecord, Workflow, StepWithForm } from '@/types';

export function useWorkflowRecords() {
  const [workflowRecords, setWorkflowRecords, isLoaded] = useLocalStorage<WorkflowRecord[]>(
    STORAGE_KEYS.WORKFLOW_RECORDS,
    []
  );
  const [workflows] = useLocalStorage<Workflow[]>(STORAGE_KEYS.WORKFLOWS, []);

  const getByEntityId = useCallback(
    (entityId: string) => workflowRecords.filter((wr) => wr.entity_id === entityId),
    [workflowRecords]
  );

  const getById = useCallback(
    (id: string) => workflowRecords.find((wr) => wr.id === id),
    [workflowRecords]
  );

  const getCurrentStepWithForm = useCallback(
    (recordId: string): StepWithForm | null => {
      const record = workflowRecords.find((wr) => wr.id === recordId);
      if (!record || !record.current_step_id) return null;

      const workflow = workflows.find((w) => w.id === record.workflow_id);
      if (!workflow) return null;

      const step = workflow.steps.find((s) => s.id === record.current_step_id);
      if (!step) return null;

      return {
        id: step.id,
        name: step.name,
        order_index: step.order_index,
        form: step.form,
      };
    },
    [workflowRecords, workflows]
  );

  const getWorkflowSteps = useCallback(
    (recordId: string) => {
      const record = workflowRecords.find((wr) => wr.id === recordId);
      if (!record) return [];

      const workflow = workflows.find((w) => w.id === record.workflow_id);
      return workflow?.steps || [];
    },
    [workflowRecords, workflows]
  );

  const submitStep = useCallback(
    (recordId: string, stepId: string, data: Record<string, unknown>) => {
      setWorkflowRecords((prev) =>
        prev.map((wr) => {
          if (wr.id !== recordId) return wr;

          const workflow = workflows.find((w) => w.id === wr.workflow_id);
          if (!workflow) return wr;

          const currentStep = workflow.steps.find((s) => s.id === stepId);
          if (!currentStep) return wr;

          const now = new Date().toISOString();
          const newSubmission = {
            step_id: stepId,
            data,
            submitted_at: now,
          };

          // Find next step
          const nextStep = workflow.steps.find(
            (s) => s.order_index === currentStep.order_index + 1
          );

          const isCompleted = !nextStep;

          return {
            ...wr,
            step_submissions: [...wr.step_submissions, newSubmission],
            current_step_id: nextStep?.id || null,
            current_step: nextStep
              ? { id: nextStep.id, name: nextStep.name, order_index: nextStep.order_index }
              : null,
            status: isCompleted ? 'completed' : 'in_progress',
            started_at: wr.started_at || now,
            completed_at: isCompleted ? now : null,
            updated_at: now,
          };
        })
      );
    },
    [setWorkflowRecords, workflows]
  );

  const isStepCompleted = useCallback(
    (recordId: string, stepId: string): boolean => {
      const record = workflowRecords.find((wr) => wr.id === recordId);
      if (!record) return false;
      return record.step_submissions.some((s) => s.step_id === stepId);
    },
    [workflowRecords]
  );

  const getStepSubmission = useCallback(
    (recordId: string, stepId: string) => {
      const record = workflowRecords.find((wr) => wr.id === recordId);
      if (!record) return null;
      return record.step_submissions.find((s) => s.step_id === stepId) || null;
    },
    [workflowRecords]
  );

  return {
    workflowRecords,
    isLoaded,
    getByEntityId,
    getById,
    getCurrentStepWithForm,
    getWorkflowSteps,
    submitStep,
    isStepCompleted,
    getStepSubmission,
  };
}
