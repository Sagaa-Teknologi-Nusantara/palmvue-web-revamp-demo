"use client";

import { useQuery } from "@tanstack/react-query";

import { workflowService } from "@/api/services/workflowService";

export const WORKFLOW_OPTIONS_QUERY_KEY = "workflow-options";

export function useWorkflowOptionsQuery(entityTypeId?: string | null) {
  const query = useQuery({
    queryKey: [WORKFLOW_OPTIONS_QUERY_KEY, entityTypeId ?? "all"],
    queryFn: () => workflowService.getOptions(entityTypeId ?? undefined),
  });

  return {
    workflowOptions: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}
