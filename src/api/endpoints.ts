export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
  },
  ENTITY_TYPES: {
    LIST: "/entity-types",
    DETAIL: (id: string) => `/entity-types/${id}`,
  },
} as const;
