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
  },
  WORKFLOWS: {
    OPTIONS: "/workflows/options",
  },
} as const;
