"use client";

import { useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { useLocalStorage } from "./useLocalStorage";
import { STORAGE_KEYS } from "@/lib/constants";
import type {
  EntityType,
  CreateEntityTypeInput,
  UpdateEntityTypeInput,
  Workflow,
} from "@/types";

export function useEntityTypes() {
  const [entityTypes, setEntityTypes, isLoaded] = useLocalStorage<EntityType[]>(
    STORAGE_KEYS.ENTITY_TYPES,
    [],
  );
  const [entityTypeWorkflows, setEntityTypeWorkflows] = useLocalStorage<
    Record<string, string[]>
  >(STORAGE_KEYS.ENTITY_TYPE_WORKFLOWS, {});
  const [workflows] = useLocalStorage<Workflow[]>(STORAGE_KEYS.WORKFLOWS, []);

  const getById = useCallback(
    (id: string) => entityTypes.find((et) => et.id === id),
    [entityTypes],
  );

  const create = useCallback(
    (data: CreateEntityTypeInput): EntityType => {
      const now = new Date().toISOString();
      const newEntityType: EntityType = {
        id: uuidv4(),
        ...data,
        created_at: now,
        updated_at: now,
      };
      setEntityTypes((prev) => [...prev, newEntityType]);
      return newEntityType;
    },
    [setEntityTypes],
  );

  const update = useCallback(
    (id: string, data: UpdateEntityTypeInput): EntityType | null => {
      let updated: EntityType | null = null;
      setEntityTypes((prev) =>
        prev.map((et) => {
          if (et.id === id) {
            updated = { ...et, ...data, updated_at: new Date().toISOString() };
            return updated;
          }
          return et;
        }),
      );
      return updated;
    },
    [setEntityTypes],
  );

  const remove = useCallback(
    (id: string) => {
      setEntityTypes((prev) => prev.filter((et) => et.id !== id));
      setEntityTypeWorkflows((prev) => {
        const newMap = { ...prev };
        delete newMap[id];
        return newMap;
      });
    },
    [setEntityTypes, setEntityTypeWorkflows],
  );

  const assignWorkflow = useCallback(
    (entityTypeId: string, workflowId: string) => {
      setEntityTypeWorkflows((prev) => {
        const existing = prev[entityTypeId] || [];
        if (existing.includes(workflowId)) return prev;
        return { ...prev, [entityTypeId]: [...existing, workflowId] };
      });
    },
    [setEntityTypeWorkflows],
  );

  const unassignWorkflow = useCallback(
    (entityTypeId: string, workflowId: string) => {
      setEntityTypeWorkflows((prev) => {
        const existing = prev[entityTypeId] || [];
        return {
          ...prev,
          [entityTypeId]: existing.filter((id) => id !== workflowId),
        };
      });
    },
    [setEntityTypeWorkflows],
  );

  const getAssignedWorkflows = useCallback(
    (entityTypeId: string): Workflow[] => {
      const workflowIds = entityTypeWorkflows[entityTypeId] || [];
      return workflows.filter((w) => workflowIds.includes(w.id));
    },
    [entityTypeWorkflows, workflows],
  );

  const getAssignedWorkflowIds = useCallback(
    (entityTypeId: string): string[] => {
      return entityTypeWorkflows[entityTypeId] || [];
    },
    [entityTypeWorkflows],
  );

  return {
    entityTypes,
    isLoaded,
    getById,
    create,
    update,
    remove,
    assignWorkflow,
    unassignWorkflow,
    getAssignedWorkflows,
    getAssignedWorkflowIds,
    entityTypeWorkflows,
  };
}
