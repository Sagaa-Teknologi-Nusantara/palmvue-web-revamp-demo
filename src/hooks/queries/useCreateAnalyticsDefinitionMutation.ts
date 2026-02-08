"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { analyticsService } from "@/api/services/analyticsService";
import type { CreateAnalyticsDefinitionRequest } from "@/api/types/analytics";

import { ANALYTICS_DEFINITIONS_QUERY_KEY } from "./useAnalyticsDefinitionsQuery";

export function useCreateAnalyticsDefinitionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAnalyticsDefinitionRequest) =>
      analyticsService.createDefinition(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ANALYTICS_DEFINITIONS_QUERY_KEY],
      });
    },
  });
}
