"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { entityService } from "@/api/services/entityService";
import type { EntityListParams } from "@/api/types/entity";

export const ENTITIES_QUERY_KEY = "entities";

export function useEntitiesQuery(params: EntityListParams = {}) {
  const query = useQuery({
    queryKey: [ENTITIES_QUERY_KEY, params],
    queryFn: () => entityService.getList(params),
    placeholderData: keepPreviousData,
  });

  return {
    entities: query.data?.items ?? [],
    pagination: query.data?.meta ?? {
      page: 1,
      size: 12,
      total_items: 0,
      total_pages: 0,
    },
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
