import type { StepSubmission } from "@/types";

import apiClient from "../client";
import { ENDPOINTS } from "../endpoints";
import type { ApiResponse } from "../types";

export interface WorkflowRecord {
  id: string;
  workflow?: { name: string };
  entity?: { name: string };
  current_step?: { name: string };
  status: string;
  created_at: string;
}

export const workflowRecordService = {
  getList: async (limit = 10): Promise<WorkflowRecord[]> => {
    const response = await apiClient.get<ApiResponse<WorkflowRecord[]>>(
      ENDPOINTS.WORKFLOW_RECORDS.LIST,
      { params: { size: limit } }
    );
    return response.data.data;
  },

  getStepSubmissions: async (
    recordId: string,
    stepId: string,
  ): Promise<StepSubmission[]> => {
    const response = await apiClient.get<ApiResponse<StepSubmission[]>>(
      ENDPOINTS.WORKFLOW_RECORDS.STEP_SUBMISSIONS(recordId, stepId),
    );
    return response.data.data;
  },

  start: async (
    recordId: string,
  ): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.post<{
      success: boolean;
      message: string;
    }>(ENDPOINTS.WORKFLOW_RECORDS.START(recordId));
    return response.data;
  },
};

export default workflowRecordService;
