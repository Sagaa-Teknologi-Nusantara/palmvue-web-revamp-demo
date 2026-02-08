"use client";

import { useQueries } from "@tanstack/react-query";

import { dashboardService } from "@/api/services/dashboardService";

export const DASHBOARD_COUNTS_QUERY_KEY = "dashboard-counts";

export function useDashboardCountsQuery() {
  const results = useQueries({
    queries: [
      {
        queryKey: [DASHBOARD_COUNTS_QUERY_KEY, "workflows"],
        queryFn: () => dashboardService.getWorkflowsCount(),
      },
      {
        queryKey: [DASHBOARD_COUNTS_QUERY_KEY, "entities"],
        queryFn: () => dashboardService.getEntitiesCount(),
      },
      {
        queryKey: [DASHBOARD_COUNTS_QUERY_KEY, "entity-types"],
        queryFn: () => dashboardService.getEntityTypesCount(),
      },
    ],
  });

  const [workflowsQuery, entitiesQuery, entityTypesQuery] = results;

  return {
    workflowsCount: workflowsQuery.data?.count ?? 0,
    entitiesCount: entitiesQuery.data?.count ?? 0,
    entityTypesCount: entityTypesQuery.data?.count ?? 0,
    isLoading:
      workflowsQuery.isLoading ||
      entitiesQuery.isLoading ||
      entityTypesQuery.isLoading,
    isError:
      workflowsQuery.isError ||
      entitiesQuery.isError ||
      entityTypesQuery.isError,
    refetch: () => {
      workflowsQuery.refetch();
      entitiesQuery.refetch();
      entityTypesQuery.refetch();
    },
  };
}
