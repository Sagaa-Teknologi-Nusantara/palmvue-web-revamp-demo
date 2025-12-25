"use client";

import { useQuery } from "@tanstack/react-query";

import { entityTypeService } from "@/api/services/entityTypeService";

export const ENTITY_TYPE_OPTIONS_QUERY_KEY = "entity-type-options";

export function useEntityTypeOptionsQuery() {
  const query = useQuery({
    queryKey: [ENTITY_TYPE_OPTIONS_QUERY_KEY],
    queryFn: () => entityTypeService.getOptions(),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  return {
    options: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}
