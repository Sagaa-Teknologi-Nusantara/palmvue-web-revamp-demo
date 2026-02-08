"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { analyticsService } from "@/api/services/analyticsService";
import type { UpdateAnalyticsDefinitionRequest } from "@/api/types/analytics";

import { ANALYTICS_DEFINITION_DETAIL_QUERY_KEY } from "./useAnalyticsDefinitionDetailQuery";
import { ANALYTICS_DEFINITIONS_QUERY_KEY } from "./useAnalyticsDefinitionsQuery";
import { ANALYTICS_QUERY_KEY } from "./useAnalyticsQueryQuery";

export function useUpdateAnalyticsDefinitionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateAnalyticsDefinitionRequest;
    }) => analyticsService.updateDefinition(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: [ANALYTICS_DEFINITIONS_QUERY_KEY],
      });
      queryClient.invalidateQueries({
        queryKey: [ANALYTICS_DEFINITION_DETAIL_QUERY_KEY, id],
      });
      queryClient.invalidateQueries({
        queryKey: [ANALYTICS_QUERY_KEY, id],
      });
    },
  });
}
