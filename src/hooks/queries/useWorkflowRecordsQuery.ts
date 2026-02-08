import { useQuery } from "@tanstack/react-query";

import { workflowRecordService } from "@/api/services/workflowRecordService";

export function useWorkflowRecordsQuery(limit = 10) {
  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ["workflowRecords", limit],
    queryFn: () => workflowRecordService.getList(limit),
  });

  return {
    records: data ?? [],
    isLoading,
    error,
    refetch,
    isFetching,
  };
}
