"use client";

import { useQuery } from "@tanstack/react-query";

import { entityService } from "@/api/services/entityService";

import { ENTITIES_QUERY_KEY } from "./useEntitiesQuery";

export function useEntityDetailQuery(id: string) {
  const query = useQuery({
    queryKey: [ENTITIES_QUERY_KEY, id],
    queryFn: () => entityService.getById(id),
    enabled: !!id,
  });

  return {
    entity: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}
