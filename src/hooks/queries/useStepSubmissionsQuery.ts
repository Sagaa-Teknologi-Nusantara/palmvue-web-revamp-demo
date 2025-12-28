"use client";

import { useQuery } from "@tanstack/react-query";

import { workflowRecordService } from "@/api/services/workflowRecordService";

export const STEP_SUBMISSIONS_QUERY_KEY = "step-submissions";

export function useStepSubmissionsQuery(
  workflowRecordId: string,
  stepId: string,
  enabled: boolean = true,
) {
  const query = useQuery({
    queryKey: [STEP_SUBMISSIONS_QUERY_KEY, workflowRecordId, stepId],
    queryFn: () =>
      workflowRecordService.getStepSubmissions(workflowRecordId, stepId),
    enabled: enabled && !!workflowRecordId && !!stepId,
  });

  return {
    submissions: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
