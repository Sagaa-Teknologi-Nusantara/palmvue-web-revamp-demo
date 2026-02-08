import { useQuery } from "@tanstack/react-query";

import { formSubmissionService } from "@/api/services/formSubmissionService";

export function useFormSubmissionsQuery(limit = 10) {
  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ["formSubmissions", limit],
    queryFn: () => formSubmissionService.getList(limit),
  });

  return {
    submissions: data ?? [],
    isLoading,
    error,
    refetch,
    isFetching,
  };
}
