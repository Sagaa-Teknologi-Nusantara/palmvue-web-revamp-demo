"use client";

import { useQuery } from "@tanstack/react-query";

import { workflowService } from "@/api/services/workflowService";

export const WORKFLOW_DETAIL_QUERY_KEY = "workflow-detail";

export function useWorkflowDetailQuery(id: string) {
  const query = useQuery({
    queryKey: [WORKFLOW_DETAIL_QUERY_KEY, id],
    queryFn: () => workflowService.getById(id),
    enabled: !!id,
  });

  return {
    workflow: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
