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

export const STATUS_COLORS = {
  not_started: "bg-gray-100 text-gray-800",
  in_progress: "bg-yellow-100 text-yellow-800",
  completed: "bg-green-100 text-green-800",
} as const;
