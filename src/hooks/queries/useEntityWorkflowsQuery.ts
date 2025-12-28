"use client";

import { useQuery } from "@tanstack/react-query";

import { entityService } from "@/api/services/entityService";

export const ENTITY_WORKFLOWS_QUERY_KEY = "entity-workflows";

export function useEntityWorkflowsQuery(entityId: string) {
  const query = useQuery({
    queryKey: [ENTITY_WORKFLOWS_QUERY_KEY, entityId],
    queryFn: () => entityService.getWorkflowDetails(entityId),
    enabled: !!entityId,
  });

  return {
    workflows: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}
