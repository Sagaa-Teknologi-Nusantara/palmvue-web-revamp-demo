import apiClient from "../client";
import { ENDPOINTS } from "../endpoints";
import type { OptionItem } from "../types/common";

export const workflowStepService = {
  getOptions: async (): Promise<OptionItem[]> => {
    const res = await apiClient.get(ENDPOINTS.WORKFLOW_STEPS.OPTIONS);
    return res.data.data;
  },
};
