"use client";

import { useQuery } from "@tanstack/react-query";

import { entityTypeService } from "@/api/services/entityTypeService";

import { ENTITY_TYPES_QUERY_KEY } from "./useEntityTypesQuery";

export const ENTITY_TYPE_DETAIL_QUERY_KEY = "entityTypeDetail";

export function useEntityTypeDetailQuery(id: string) {
  const query = useQuery({
    queryKey: [ENTITY_TYPES_QUERY_KEY, id],
    queryFn: () => entityTypeService.getById(id),
    enabled: !!id,
  });

  return {
    entityType: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}
