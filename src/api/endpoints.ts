export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
  },
  ENTITY_TYPES: {
    LIST: "/entity-types",
    CREATE: "/entity-types",
    DETAIL: (id: string) => `/entity-types/${id}`,
    DELETE: (id: string) => `/entity-types/${id}`,
    WORKFLOWS: (id: string) => `/entity-types/${id}/workflows`,
    OPTIONS: "/entity-types/options",
  },
  ENTITIES: {
    LIST: "/entities",
    CREATE: "/entities",
    DETAIL: (id: string) => `/entities/${id}`,
    DELETE: (id: string) => `/entities/${id}`,
    OPTIONS: "/entities/options",
    WORKFLOW_DETAILS: (id: string) => `/entities/${id}/workflows`,
  },
  WORKFLOWS: {
    LIST: "/workflows",
    CREATE: "/workflows",
    OPTIONS: "/workflows/options",
    DELETE: (id: string) => `/workflows/${id}`,
  },
  WORKFLOW_RECORDS: {
    STEP_SUBMISSIONS: (recordId: string, stepId: string) =>
      `/workflow-records/${recordId}/steps/${stepId}/submissions`,
  },
} as const;
