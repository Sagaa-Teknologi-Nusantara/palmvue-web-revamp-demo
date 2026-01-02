"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { workflowService } from "@/api/services/workflowService";
import type { UpdateWorkflowRequest } from "@/api/types/workflow";

import { WORKFLOW_DETAIL_QUERY_KEY } from "./useWorkflowDetailQuery";
import { WORKFLOW_OPTIONS_QUERY_KEY } from "./useWorkflowOptionsQuery";
import { WORKFLOWS_QUERY_KEY } from "./useWorkflowsQuery";

export function useUpdateWorkflowMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateWorkflowRequest }) =>
      workflowService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [WORKFLOWS_QUERY_KEY] });
      queryClient.invalidateQueries({
        queryKey: [WORKFLOW_DETAIL_QUERY_KEY, id],
      });
      queryClient.invalidateQueries({
        queryKey: [WORKFLOW_OPTIONS_QUERY_KEY],
      });
      toast.success("Workflow updated successfully");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to update workflow",
      );
    },
  });
}
