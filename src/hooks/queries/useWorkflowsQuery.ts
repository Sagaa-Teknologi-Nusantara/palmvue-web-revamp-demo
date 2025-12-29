"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { workflowService } from "@/api/services/workflowService";
import type { WorkflowListParams } from "@/api/types/workflow";

export const WORKFLOWS_QUERY_KEY = "workflows";

export function useWorkflowsQuery(params: WorkflowListParams = {}) {
  const query = useQuery({
    queryKey: [WORKFLOWS_QUERY_KEY, params],
    queryFn: () => workflowService.getList(params),
    placeholderData: keepPreviousData,
  });

  return {
    workflows: query.data?.items ?? [],
    pagination: query.data?.meta ?? {
      page: 1,
      size: 12,
      total_items: 0,
      total_pages: 0,
    },
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
