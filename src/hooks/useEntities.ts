"use client";

import { useCallback, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import { useLocalStorage } from "./useLocalStorage";
import { STORAGE_KEYS, DEFAULT_USER_ID } from "@/lib/constants";
import { generateEntityCode } from "@/lib/code-generator";
import type {
  Entity,
  CreateEntityInput,
  UpdateEntityInput,
  EntityType,
  WorkflowRecord,
  Workflow,
} from "@/types";

export function useEntities() {
  const [entities, setEntities, isLoaded] = useLocalStorage<Entity[]>(
    STORAGE_KEYS.ENTITIES,
    [],
  );
  const [entityTypes] = useLocalStorage<EntityType[]>(
    STORAGE_KEYS.ENTITY_TYPES,
    [],
  );
  const [workflowRecords, setWorkflowRecords] = useLocalStorage<
    WorkflowRecord[]
  >(STORAGE_KEYS.WORKFLOW_RECORDS, []);
  const [entityTypeWorkflows] = useLocalStorage<Record<string, string[]>>(
    STORAGE_KEYS.ENTITY_TYPE_WORKFLOWS,
    {},
  );
  const [workflows] = useLocalStorage<Workflow[]>(STORAGE_KEYS.WORKFLOWS, []);

  const getById = useCallback(
    (id: string) => entities.find((e) => e.id === id),
    [entities],
  );

  const create = useCallback(
    (data: CreateEntityInput): Entity => {
      const entityType = entityTypes.find(
        (et) => et.id === data.entity_type_id,
      );
      if (!entityType) {
        throw new Error("Entity type not found");
      }

      const existingCodes = entities.map((e) => e.code);
      const code = generateEntityCode(entityType.prefix, existingCodes);
      const now = new Date().toISOString();

      const parent = data.parent_id
        ? entities.find((e) => e.id === data.parent_id)
        : null;

      const newEntity: Entity = {
        id: uuidv4(),
        entity_type_id: data.entity_type_id,
        entity_type: {
          id: entityType.id,
          name: entityType.name,
          prefix: entityType.prefix,
          icon: entityType.icon,
          bg_color: entityType.bg_color,
          fg_color: entityType.fg_color,
        },
        parent_id: data.parent_id || null,
        parent: parent
          ? { id: parent.id, code: parent.code, name: parent.name }
          : null,
        name: data.name,
        code,
        metadata: data.metadata,
        created_by: DEFAULT_USER_ID,
        created_at: now,
        updated_at: now,
      };

      setEntities((prev) => [...prev, newEntity]);

      // Auto-create workflow records for assigned workflows
      const assignedWorkflowIds =
        entityTypeWorkflows[data.entity_type_id] || [];
      const newWorkflowRecords: WorkflowRecord[] = assignedWorkflowIds.map(
        (workflowId) => {
          const workflow = workflows.find((w) => w.id === workflowId);
          const firstStep = workflow?.steps.find((s) => s.order_index === 0);

          return {
            id: uuidv4(),
            entity_id: newEntity.id,
            workflow_id: workflowId,
            workflow: { id: workflowId, name: workflow?.name || "Unknown" },
            current_step_id: firstStep?.id || null,
            current_step: firstStep
              ? {
                  id: firstStep.id,
                  name: firstStep.name,
                  order_index: firstStep.order_index,
                }
              : null,
            status: "not_started",
            step_submissions: [],
            started_at: null,
            completed_at: null,
            created_at: now,
            updated_at: now,
          };
        },
      );

      if (newWorkflowRecords.length > 0) {
        setWorkflowRecords((prev) => [...prev, ...newWorkflowRecords]);
      }

      return newEntity;
    },
    [
      entities,
      entityTypes,
      entityTypeWorkflows,
      workflows,
      setEntities,
      setWorkflowRecords,
    ],
  );

  const update = useCallback(
    (id: string, data: UpdateEntityInput): Entity | null => {
      let updated: Entity | null = null;
      setEntities((prev) =>
        prev.map((e) => {
          if (e.id === id) {
            const parent = data.parent_id
              ? prev.find((p) => p.id === data.parent_id)
              : data.parent_id === null
                ? null
                : e.parent;

            updated = {
              ...e,
              name: data.name ?? e.name,
              metadata: data.metadata ?? e.metadata,
              parent_id:
                data.parent_id !== undefined ? data.parent_id : e.parent_id,
              parent: parent
                ? { id: parent.id, code: parent.code, name: parent.name }
                : data.parent_id === null
                  ? null
                  : e.parent,
              updated_at: new Date().toISOString(),
            };
            return updated;
          }
          return e;
        }),
      );
      return updated;
    },
    [setEntities],
  );

  const remove = useCallback(
    (id: string) => {
      setEntities((prev) => prev.filter((e) => e.id !== id));
      setWorkflowRecords((prev) => prev.filter((wr) => wr.entity_id !== id));
    },
    [setEntities, setWorkflowRecords],
  );

  const search = useCallback(
    (query: string) => {
      const lowerQuery = query.toLowerCase();
      return entities.filter(
        (e) =>
          e.name.toLowerCase().includes(lowerQuery) ||
          e.code.toLowerCase().includes(lowerQuery),
      );
    },
    [entities],
  );

  const filterByType = useCallback(
    (typeId: string) => entities.filter((e) => e.entity_type_id === typeId),
    [entities],
  );

  const filterByParent = useCallback(
    (parentId: string) => entities.filter((e) => e.parent_id === parentId),
    [entities],
  );

  const getChildren = useCallback(
    (parentId: string) => entities.filter((e) => e.parent_id === parentId),
    [entities],
  );

  return {
    entities,
    isLoaded,
    getById,
    create,
    update,
    remove,
    search,
    filterByType,
    filterByParent,
    getChildren,
  };
}
