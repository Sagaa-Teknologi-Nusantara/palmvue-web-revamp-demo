"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { workflowRecordService } from "@/api/services/workflowRecordService";

import { ENTITY_WORKFLOWS_QUERY_KEY } from "./useEntityWorkflowsQuery";

export function useStartWorkflowRecordMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (recordId: string) => workflowRecordService.start(recordId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [ENTITY_WORKFLOWS_QUERY_KEY] });
      toast.success(data.message || "Workflow started successfully");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to start workflow",
      );
    },
  });
}
