"use client";

import { useQuery } from "@tanstack/react-query";

import { workflowRecordService } from "@/api/services/workflowRecordService";

export function useWorkflowRecordsQuery(limit = 10, status?: string) {
  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["workflowRecords", limit, status],
    queryFn: () => workflowRecordService.getList(limit, status),
  });

  return {
    records: data ?? [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  };
}
