export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
  },
  ENTITY_TYPES: {
    LIST: "/entity-types",
    CREATE: "/entity-types",
    DETAIL: (id: string) => `/entity-types/${id}`,
  },
  WORKFLOWS: {
    OPTIONS: "/workflows/options",
  },
} as const;
