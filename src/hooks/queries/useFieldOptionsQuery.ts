"use client";

import { useQuery } from "@tanstack/react-query";

import { analyticsService } from "@/api/services/analyticsService";
import type { AnalyticsSource } from "@/api/types/analytics";

export const FIELD_OPTIONS_QUERY_KEY = "field-options";

export function useFieldOptionsQuery(source: AnalyticsSource | undefined) {
  const query = useQuery({
    queryKey: [FIELD_OPTIONS_QUERY_KEY, source],
    queryFn: () => analyticsService.getFieldOptions(source!),
    enabled: !!source,
  });

  return {
    fieldOptions: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
