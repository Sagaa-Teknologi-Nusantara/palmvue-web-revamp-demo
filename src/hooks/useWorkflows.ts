"use client";

import { useCallback } from "react";
import { v4 as uuidv4 } from "uuid";

import { STORAGE_KEYS } from "@/lib/constants";
import type {
  CreateWorkflowInput,
  UpdateWorkflowInput,
  Workflow,
  WorkflowStep,
} from "@/types";

import { useLocalStorage } from "./useLocalStorage";

export function useWorkflows() {
  const [workflows, setWorkflows, isLoaded] = useLocalStorage<Workflow[]>(
    STORAGE_KEYS.WORKFLOWS,
    [],
  );

  const getById = useCallback(
    (id: string) => workflows.find((w) => w.id === id),
    [workflows],
  );

  const create = useCallback(
    (data: CreateWorkflowInput): Workflow => {
      const now = new Date().toISOString();
      const steps: WorkflowStep[] = data.steps.map((step, index) => ({
        id: uuidv4(),
        name: step.name,
        order_index: index,
        requires_approval: false,
        form: {
          id: uuidv4(),
          name: step.form.name,
          schema: step.form.schema,
        },
      }));

      const newWorkflow: Workflow = {
        id: uuidv4(),
        name: data.name,
        is_loopable: false,
        is_auto_start: false,
        steps,
        created_at: now,
        updated_at: now,
      };
      setWorkflows((prev) => [...prev, newWorkflow]);
      return newWorkflow;
    },
    [setWorkflows],
  );

  const update = useCallback(
    (id: string, data: UpdateWorkflowInput): Workflow | null => {
      let updated: Workflow | null = null;
      setWorkflows((prev) =>
        prev.map((w) => {
          if (w.id === id) {
            const steps = data.steps
              ? data.steps.map((step, index) => ({
                  id: uuidv4(),
                  name: step.name,
                  order_index: index,
                  requires_approval: false,
                  form: {
                    id: uuidv4(),
                    name: step.form.name,
                    schema: step.form.schema,
                  },
                }))
              : w.steps;

            updated = {
              ...w,
              name: data.name ?? w.name,
              steps,
              updated_at: new Date().toISOString(),
            };
            return updated;
          }
          return w;
        }),
      );
      return updated;
    },
    [setWorkflows],
  );

  const remove = useCallback(
    (id: string) => {
      setWorkflows((prev) => prev.filter((w) => w.id !== id));
    },
    [setWorkflows],
  );

  return {
    workflows,
    isLoaded,
    getById,
    create,
    update,
    remove,
  };
}
