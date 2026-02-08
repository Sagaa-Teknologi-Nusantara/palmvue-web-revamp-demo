"use client";

import { useQuery } from "@tanstack/react-query";

import { workflowStepService } from "@/api/services/workflowStepService";

export const WORKFLOW_STEP_OPTIONS_QUERY_KEY = "workflow-step-options";

export function useWorkflowStepOptionsQuery() {
  const query = useQuery({
    queryKey: [WORKFLOW_STEP_OPTIONS_QUERY_KEY],
    queryFn: () => workflowStepService.getOptions(),
  });

  return {
    stepOptions: query.data ?? [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
  };
}
