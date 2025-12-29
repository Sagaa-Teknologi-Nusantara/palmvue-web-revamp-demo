"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { entityTypeService } from "@/api/services/entityTypeService";
import type { CreateEntityTypeRequest } from "@/api/types/entity-type";

import { ENTITY_TYPES_QUERY_KEY } from "./useEntityTypesQuery";

export function useCreateEntityTypeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEntityTypeRequest) =>
      entityTypeService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ENTITY_TYPES_QUERY_KEY] });
      toast.success("Entity type created successfully");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to create entity type",
      );
    },
  });
}
