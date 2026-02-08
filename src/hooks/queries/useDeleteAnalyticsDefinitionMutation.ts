"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { analyticsService } from "@/api/services/analyticsService";

import { ANALYTICS_DEFINITIONS_QUERY_KEY } from "./useAnalyticsDefinitionsQuery";
import { ANALYTICS_QUERY_KEY } from "./useAnalyticsQueryQuery";

export function useDeleteAnalyticsDefinitionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => analyticsService.deleteDefinition(id).then(() => id),
    onSuccess: (id) => {
      queryClient.invalidateQueries({
        queryKey: [ANALYTICS_DEFINITIONS_QUERY_KEY],
      });
      queryClient.removeQueries({
        queryKey: [ANALYTICS_QUERY_KEY, id],
      });
    },
  });
}
