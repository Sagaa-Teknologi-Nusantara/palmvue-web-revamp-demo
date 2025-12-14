'use client';

import { STORAGE_KEYS } from '@/lib/constants';
import { storage } from '@/lib/storage';
import { mockEntityTypes } from './mock-entity-types';
import { mockEntities } from './mock-entities';
import { mockWorkflows } from './mock-workflows';
import { mockWorkflowRecords, mockEntityTypeWorkflows } from './mock-workflow-records';

export function seedDatabase(): void {
  const isInitialized = storage.get(STORAGE_KEYS.INITIALIZED, false);

  if (!isInitialized) {
    storage.set(STORAGE_KEYS.ENTITY_TYPES, mockEntityTypes);
    storage.set(STORAGE_KEYS.ENTITIES, mockEntities);
    storage.set(STORAGE_KEYS.WORKFLOWS, mockWorkflows);
    storage.set(STORAGE_KEYS.WORKFLOW_RECORDS, mockWorkflowRecords);
    storage.set(STORAGE_KEYS.ENTITY_TYPE_WORKFLOWS, mockEntityTypeWorkflows);
    storage.set(STORAGE_KEYS.INITIALIZED, true);

    console.log('Database seeded with mock data');
  }
}

export function resetDatabase(): void {
  storage.set(STORAGE_KEYS.ENTITY_TYPES, mockEntityTypes);
  storage.set(STORAGE_KEYS.ENTITIES, mockEntities);
  storage.set(STORAGE_KEYS.WORKFLOWS, mockWorkflows);
  storage.set(STORAGE_KEYS.WORKFLOW_RECORDS, mockWorkflowRecords);
  storage.set(STORAGE_KEYS.ENTITY_TYPE_WORKFLOWS, mockEntityTypeWorkflows);
  storage.set(STORAGE_KEYS.INITIALIZED, true);

  console.log('Database reset to initial mock data');
}
