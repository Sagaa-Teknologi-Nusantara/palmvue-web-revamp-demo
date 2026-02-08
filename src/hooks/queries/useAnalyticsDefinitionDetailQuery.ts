"use client";

import { useQuery } from "@tanstack/react-query";

import { analyticsService } from "@/api/services/analyticsService";

export const ANALYTICS_DEFINITION_DETAIL_QUERY_KEY = "analytics-definition";

export function useAnalyticsDefinitionDetailQuery(id: string | undefined) {
  const query = useQuery({
    queryKey: [ANALYTICS_DEFINITION_DETAIL_QUERY_KEY, id],
    queryFn: () => analyticsService.getDefinitionById(id!),
    enabled: !!id,
  });

  return {
    definition: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
