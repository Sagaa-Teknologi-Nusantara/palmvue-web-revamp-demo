export const STORAGE_KEYS = {
  ENTITY_TYPES: "palmvue_entity_types",
  ENTITIES: "palmvue_entities",
  WORKFLOWS: "palmvue_workflows",
  WORKFLOW_RECORDS: "palmvue_workflow_records",
  ENTITY_TYPE_WORKFLOWS: "palmvue_entity_type_workflows",
  INITIALIZED: "palmvue_initialized",
  AUTH_TOKEN: "palmvue_auth_token",
} as const;

export const DEFAULT_USER_ID = "user-demo-001";

export const PAGINATION_OPTIONS = [10, 25, 50] as const;
