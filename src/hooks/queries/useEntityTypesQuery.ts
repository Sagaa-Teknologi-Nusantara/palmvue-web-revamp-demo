"use client";

import { useQuery } from "@tanstack/react-query";

import { entityTypeService } from "@/api/services/entityTypeService";

export const ENTITY_TYPES_QUERY_KEY = "entity-types";

interface UseEntityTypesQueryOptions {
  page?: number;
  size?: number;
}

export function useEntityTypesQuery(options: UseEntityTypesQueryOptions = {}) {
  const { page = 1, size = 12 } = options;

  const query = useQuery({
    queryKey: [ENTITY_TYPES_QUERY_KEY, { page, size }],
    queryFn: () => entityTypeService.getList({ page, size }),
  });

  return {
    entityTypes: query.data?.items ?? [],
    pagination: query.data?.meta ?? {
      page,
      size,
      total_items: 0,
      total_pages: 0,
    },
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
