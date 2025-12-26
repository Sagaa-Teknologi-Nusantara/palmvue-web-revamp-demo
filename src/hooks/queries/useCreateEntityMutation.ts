"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { entityService } from "@/api/services/entityService";
import type { CreateEntityRequest } from "@/api/types/entity";
import { getErrorMessage } from "@/lib/error";

import { ENTITIES_QUERY_KEY } from "./useEntitiesQuery";

export function useCreateEntityMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEntityRequest) => entityService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ENTITIES_QUERY_KEY] });
      toast.success("Entity created successfully");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to create entity"));
    },
  });
}
