"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { formSubmissionService } from "@/api/services/formSubmissionService";

import { STEP_SUBMISSIONS_QUERY_KEY } from "./useStepSubmissionsQuery";

export function useApproveSubmissionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (submissionId: string) =>
      formSubmissionService.approve(submissionId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [STEP_SUBMISSIONS_QUERY_KEY] });
      toast.success(data.message || "Submission approved successfully");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to approve submission",
      );
    },
  });
}
