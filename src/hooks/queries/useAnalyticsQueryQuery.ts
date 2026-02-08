"use client";

import { useQuery } from "@tanstack/react-query";

import { analyticsService } from "@/api/services/analyticsService";

export const ANALYTICS_QUERY_KEY = "analytics-query";

export function useAnalyticsQueryQuery(id: string | undefined) {
  const query = useQuery({
    queryKey: [ANALYTICS_QUERY_KEY, id],
    queryFn: () => analyticsService.executeQuery(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });

  return {
    result: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
