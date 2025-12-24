# API Integration Pattern

## File Structure

```
src/api/
├── client.ts              # Axios instance + interceptors
├── endpoints.ts           # Endpoint constants
├── index.ts               # Barrel exports
├── types/
│   ├── common.ts          # ApiResponse, PaginationMeta
│   └── {domain}.ts        # Domain-specific types
└── services/
    └── {domain}Service.ts # API operations
```

## Adding a New Domain

### 1. Add Endpoint

```typescript
// src/api/endpoints.ts
export const ENDPOINTS = {
  // ...existing
  NEW_DOMAIN: "/new-domain",
} as const;
```

### 2. Create Service

```typescript
// src/api/services/newDomainService.ts
import apiClient from "../client";
import { buildEndpoint, ENDPOINTS } from "../endpoints";
import { ApiResponse, PaginationParams } from "../types";

export interface NewDomainCreateInput {
  name: string;
}

export const newDomainService = {
  getAll: async (params?: PaginationParams) => {
    const response = await apiClient.get<ApiResponse<NewDomain[]>>(
      ENDPOINTS.NEW_DOMAIN,
      { params },
    );
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<NewDomain>>(
      buildEndpoint(ENDPOINTS.NEW_DOMAIN, id),
    );
    return response.data;
  },

  create: async (data: NewDomainCreateInput) => {
    const response = await apiClient.post<ApiResponse<NewDomain>>(
      ENDPOINTS.NEW_DOMAIN,
      data,
    );
    return response.data;
  },

  update: async (id: string, data: Partial<NewDomainCreateInput>) => {
    const response = await apiClient.put<ApiResponse<NewDomain>>(
      buildEndpoint(ENDPOINTS.NEW_DOMAIN, id),
      data,
    );
    return response.data;
  },

  delete: async (id: string) => {
    const response = await apiClient.delete<ApiResponse<null>>(
      buildEndpoint(ENDPOINTS.NEW_DOMAIN, id),
    );
    return response.data;
  },
};

export default newDomainService;
```

### 3. Export Service

```typescript
// src/api/services/index.ts
export { default as newDomainService } from "./newDomainService";
```

### 4. Create Query Hooks (Optional)

```typescript
// src/hooks/queries/useNewDomainQuery.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { newDomainService } from "@/api/services/newDomainService";

export const newDomainKeys = {
  all: ["newDomain"] as const,
  list: (params?: unknown) => [...newDomainKeys.all, "list", params] as const,
  detail: (id: string) => [...newDomainKeys.all, "detail", id] as const,
};

export function useNewDomainList(params?: PaginationParams) {
  return useQuery({
    queryKey: newDomainKeys.list(params),
    queryFn: () => newDomainService.getAll(params),
  });
}

export function useNewDomain(id: string) {
  return useQuery({
    queryKey: newDomainKeys.detail(id),
    queryFn: () => newDomainService.getById(id),
    enabled: !!id,
  });
}

export function useCreateNewDomain() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: newDomainService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: newDomainKeys.all });
    },
  });
}
```

## Response Types

```typescript
// All responses follow this structure
interface ApiResponse<T> {
  success: true;
  message: string;
  data: T;
  meta?: PaginationMeta;
}

interface ApiErrorResponse {
  success: false;
  error: { code: string; message: string; details?: unknown };
}
```

## Conventions

| Item        | Convention                 |
| ----------- | -------------------------- |
| Types       | Match backend (snake_case) |
| Services    | `{domain}Service.ts`       |
| Query hooks | `use{Domain}Query.ts`      |
| Endpoints   | SCREAMING_CASE constants   |
| Query keys  | `{domain}Keys` object      |
