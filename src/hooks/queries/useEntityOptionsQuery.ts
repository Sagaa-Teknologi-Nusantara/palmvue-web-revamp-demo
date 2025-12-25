"use client";

import { useQuery } from "@tanstack/react-query";

import { entityService } from "@/api/services/entityService";
import type { EntityOptionsParams } from "@/api/types/entity";

export const ENTITY_OPTIONS_QUERY_KEY = "entity-options";

export function useEntityOptionsQuery(params: EntityOptionsParams = {}) {
  const query = useQuery({
    queryKey: [ENTITY_OPTIONS_QUERY_KEY, params],
    queryFn: () => entityService.getOptions(params),
    enabled: !!params.search || !!params.entity_type_id,
  });

  return {
    options: query.data ?? [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
  };
}
