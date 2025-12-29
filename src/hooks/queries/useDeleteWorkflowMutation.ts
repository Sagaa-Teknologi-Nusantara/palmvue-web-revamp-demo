"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { workflowService } from "@/api/services/workflowService";

import { WORKFLOWS_QUERY_KEY } from "./useWorkflowsQuery";

export function useDeleteWorkflowMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => workflowService.delete(id),
    onSuccess: () => {
      toast.success("Workflow deleted successfully");
      queryClient.invalidateQueries({ queryKey: [WORKFLOWS_QUERY_KEY] });
    },
    onError: () => {
      toast.error("Failed to delete workflow");
    },
  });
}
