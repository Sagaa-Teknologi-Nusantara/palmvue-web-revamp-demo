"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { entityService } from "@/api/services/entityService";
import type { UpdateEntityRequest } from "@/api/types/entity";

import { ENTITIES_QUERY_KEY } from "./useEntitiesQuery";

export function useUpdateEntityMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEntityRequest }) =>
      entityService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [ENTITIES_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [ENTITIES_QUERY_KEY, id] });
      toast.success("Entity updated successfully");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to update entity",
      );
    },
  });
}
