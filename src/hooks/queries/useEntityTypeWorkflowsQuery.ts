"use client";

import { useQuery } from "@tanstack/react-query";

import { entityTypeService } from "@/api/services/entityTypeService";

import { ENTITY_TYPES_QUERY_KEY } from "./useEntityTypesQuery";

export function useEntityTypeWorkflowsQuery(id: string) {
  const query = useQuery({
    queryKey: [ENTITY_TYPES_QUERY_KEY, id, "workflows"],
    queryFn: () => entityTypeService.getWorkflows(id),
    enabled: !!id,
  });

  return {
    workflows: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}
