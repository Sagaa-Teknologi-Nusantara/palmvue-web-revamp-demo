import type { StepSubmission } from "@/types";

import apiClient from "../client";
import { ENDPOINTS } from "../endpoints";
import type { ApiResponse } from "../types";

export const workflowRecordService = {
  getStepSubmissions: async (
    recordId: string,
    stepId: string,
  ): Promise<StepSubmission[]> => {
    const response = await apiClient.get<ApiResponse<StepSubmission[]>>(
      ENDPOINTS.WORKFLOW_RECORDS.STEP_SUBMISSIONS(recordId, stepId),
    );
    return response.data.data;
  },
};

export default workflowRecordService;
