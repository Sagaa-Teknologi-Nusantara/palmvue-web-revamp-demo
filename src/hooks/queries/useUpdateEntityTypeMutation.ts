"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { entityTypeService } from "@/api/services/entityTypeService";
import type { UpdateEntityTypeRequest } from "@/api/types/entity-type";

import { ENTITY_TYPE_DETAIL_QUERY_KEY } from "./useEntityTypeDetailQuery";
import { ENTITY_TYPE_OPTIONS_QUERY_KEY } from "./useEntityTypeOptionsQuery";
import { ENTITY_TYPES_QUERY_KEY } from "./useEntityTypesQuery";

export function useUpdateEntityTypeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEntityTypeRequest }) =>
      entityTypeService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [ENTITY_TYPES_QUERY_KEY] });
      queryClient.invalidateQueries({
        queryKey: [ENTITY_TYPE_DETAIL_QUERY_KEY, id],
      });
      queryClient.invalidateQueries({
        queryKey: [ENTITY_TYPE_OPTIONS_QUERY_KEY],
      });
      toast.success("Entity type updated successfully");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to update entity type",
      );
    },
  });
}
