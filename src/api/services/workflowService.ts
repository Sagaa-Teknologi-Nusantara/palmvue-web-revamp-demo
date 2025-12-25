import { WorkflowOption } from "@/types";

import apiClient from "../client";
import { ENDPOINTS } from "../endpoints";
import type { ApiResponse } from "../types";

export const workflowService = {
  getOptions: async (): Promise<WorkflowOption[]> => {
    const response = await apiClient.get<ApiResponse<WorkflowOption[]>>(
      ENDPOINTS.WORKFLOWS.OPTIONS,
    );
    return response.data.data;
  },
};

export default workflowService;
