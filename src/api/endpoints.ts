export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
  },
  ENTITY_TYPES: {
    LIST: "/entity-types",
    CREATE: "/entity-types",
    DETAIL: (id: string) => `/entity-types/${id}`,
    DELETE: (id: string) => `/entity-types/${id}`,
    UPDATE: (id: string) => `/entity-types/${id}`,
    WORKFLOWS: (id: string) => `/entity-types/${id}/workflows`,
    OPTIONS: "/entity-types/options",
    COUNT: "/entity-types/count",
  },
  ENTITIES: {
    LIST: "/entities",
    CREATE: "/entities",
    DETAIL: (id: string) => `/entities/${id}`,
    UPDATE: (id: string) => `/entities/${id}`,
    DELETE: (id: string) => `/entities/${id}`,
    OPTIONS: "/entities/options",
    WORKFLOW_DETAILS: (id: string) => `/entities/${id}/workflows`,
    WORKFLOW_HISTORY: (id: string) => `/entities/${id}/workflow-history`,
    COUNT: "/entities/count",
  },
  WORKFLOWS: {
    LIST: "/workflows",
    CREATE: "/workflows",
    OPTIONS: "/workflows/options",
    DETAIL: (id: string) => `/workflows/${id}`,
    DELETE: (id: string) => `/workflows/${id}`,
    UPDATE: (id: string) => `/workflows/${id}`,
    COUNT: "/workflows/count",
  },
  WORKFLOW_RECORDS: {
    LIST: "/workflow-records",
    STEP_SUBMISSIONS: (recordId: string, stepId: string) =>
      `/workflow-records/${recordId}/steps/${stepId}/submissions`,
    START: (recordId: string) => `/workflow-records/${recordId}/start`,
  },
  FORM_SUBMISSIONS: {
    LIST: "/form-submissions",
    APPROVE: (id: string) => `/form-submissions/${id}/approve`,
    REJECT: (id: string) => `/form-submissions/${id}/reject`,
  },
  ANALYTICS: {
    DEFINITIONS: "/analytics/definitions",
    DEFINITION_DETAIL: (id: string) => `/analytics/definitions/${id}`,
    QUERY: (id: string) => `/analytics/query/${id}`,
    FIELD_OPTIONS: "/analytics/field-options",
  },
  USERS: {
    OPTIONS: "/users/options",
  },
  WORKFLOW_STEPS: {
    OPTIONS: "/workflow-steps/options",
  },
} as const;
