"use client";

import { useQuery } from "@tanstack/react-query";

import { workflowService } from "@/api/services/workflowService";

export const WORKFLOW_OPTIONS_QUERY_KEY = "workflow-options";

export function useWorkflowOptionsQuery() {
  const query = useQuery({
    queryKey: [WORKFLOW_OPTIONS_QUERY_KEY],
    queryFn: () => workflowService.getOptions(),
  });

  return {
    workflowOptions: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}
