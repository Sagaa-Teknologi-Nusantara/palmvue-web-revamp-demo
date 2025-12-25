"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { entityTypeService } from "@/api/services/entityTypeService";
import { getErrorMessage } from "@/lib/error";

import { ENTITY_TYPES_QUERY_KEY } from "./useEntityTypesQuery";

export function useDeleteEntityTypeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => entityTypeService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ENTITY_TYPES_QUERY_KEY] });
      toast.success("Entity type deleted successfully");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Failed to delete entity type"));
    },
  });
}
