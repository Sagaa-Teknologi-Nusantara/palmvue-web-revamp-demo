import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { workflowService } from "@/api/services/workflowService";
import { getErrorMessage } from "@/lib/error";
import type { CreateWorkflowInput } from "@/types";

import { WORKFLOWS_QUERY_KEY } from "./useWorkflowsQuery";

export function useCreateWorkflowMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateWorkflowInput) => workflowService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [WORKFLOWS_QUERY_KEY] });
      toast.success("Workflow created successfully");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}
