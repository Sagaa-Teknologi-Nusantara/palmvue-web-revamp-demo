"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { entityService } from "@/api/services/entityService";
import { getErrorMessage } from "@/lib/error";

import { ENTITIES_QUERY_KEY } from "./useEntitiesQuery";

export function useDeleteEntityMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => entityService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ENTITIES_QUERY_KEY] });
      toast.success("Entity deleted successfully");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Failed to delete entity"));
    },
  });
}
