"use client";

import { useQuery } from "@tanstack/react-query";

import { analyticsService } from "@/api/services/analyticsService";

export const ANALYTICS_DEFINITIONS_QUERY_KEY = "analytics-definitions";

export function useAnalyticsDefinitionsQuery() {
  const query = useQuery({
    queryKey: [ANALYTICS_DEFINITIONS_QUERY_KEY],
    queryFn: () => analyticsService.getDefinitions(),
  });

  return {
    definitions: query.data ?? [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
