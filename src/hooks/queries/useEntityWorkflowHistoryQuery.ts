"use client";

import { useQuery } from "@tanstack/react-query";

import { entityService } from "@/api/services/entityService";

export const ENTITY_WORKFLOW_HISTORY_QUERY_KEY = "entity-workflow-history";

export function useEntityWorkflowHistoryQuery(entityId: string) {
  const query = useQuery({
    queryKey: [ENTITY_WORKFLOW_HISTORY_QUERY_KEY, entityId],
    queryFn: () => entityService.getWorkflowHistory(entityId),
    enabled: !!entityId,
  });

  return {
    history: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}
