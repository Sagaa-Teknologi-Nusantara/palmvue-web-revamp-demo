---
trigger: always_on
---

# API Integration

## Stack

- **Axios** → HTTP client (`src/api/client.ts`)
- **React Query** → Server state (`src/hooks/queries/`)

## API Client (src/api/client.ts)

- Auto-injects auth token from `tokenUtils`
- Handles 401 → clears token and dispatches auth error event
- Base URL from `NEXT_PUBLIC_API_URL`

## Directory Structure

```
src/api/
├── client.ts           # Axios instance
├── endpoints.ts        # API endpoint constants
├── services/           # Domain services (authService.ts)
└── types/              # API types (common.ts, auth.ts)
```

## Service Pattern

```typescript
// src/api/services/entityService.ts
import apiClient from "../client";
import { ENDPOINTS } from "../endpoints";

export const entityService = {
  getAll: async () => {
    const res = await apiClient.get(ENDPOINTS.ENTITIES.LIST);
    return res.data.data;
  },
  create: async (data) => {
    const res = await apiClient.post(ENDPOINTS.ENTITIES.CREATE, data);
    return res.data.data;
  },
};
```

## Response Types (src/api/types/common.ts)

```typescript
interface ApiResponse<T> {
  success: true;
  data: T;
  meta?: PaginationMeta;
}
interface ApiErrorResponse {
  success: false;
  error: { code: string; message: string };
}
```

## Endpoint Constants

```typescript
// src/api/endpoints.ts
export const ENDPOINTS = {
  AUTH: { LOGIN: "/auth/login" },
  ENTITIES: {
    LIST: "/entities",
    DETAIL: (id: string) => `/entities/${id}`,
  },
} as const;
```
