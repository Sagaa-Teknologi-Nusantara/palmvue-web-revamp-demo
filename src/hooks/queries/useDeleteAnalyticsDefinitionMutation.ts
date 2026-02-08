"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { analyticsService } from "@/api/services/analyticsService";

import { ANALYTICS_DEFINITIONS_QUERY_KEY } from "./useAnalyticsDefinitionsQuery";

export function useDeleteAnalyticsDefinitionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => analyticsService.deleteDefinition(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ANALYTICS_DEFINITIONS_QUERY_KEY],
      });
    },
  });
}
