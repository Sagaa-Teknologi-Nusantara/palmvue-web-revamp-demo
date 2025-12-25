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
    DELETE: (id: string) => `/entities/${id}`,
  },
  WORKFLOWS: {
    OPTIONS: "/workflows/options",
  },
} as const;
