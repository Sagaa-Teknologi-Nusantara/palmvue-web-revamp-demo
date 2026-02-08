import apiClient from "../client";
import { ENDPOINTS } from "../endpoints";
import type { ApiResponse } from "../types";

export interface FormSubmission {
  id: string;
  workflow_step?: { name: string };
  entity?: { name: string };
  status: string;
  created_at: string;
}

export interface SubmissionActionResponse {
  success: boolean;
  message: string;
}

export const formSubmissionService = {
  getList: async (limit = 10): Promise<FormSubmission[]> => {
    const response = await apiClient.get<ApiResponse<FormSubmission[]>>(
      ENDPOINTS.FORM_SUBMISSIONS.LIST,
      { params: { size: limit } }
    );
    return response.data.data;
  },

  approve: async (submissionId: string): Promise<SubmissionActionResponse> => {
    const response = await apiClient.post<SubmissionActionResponse>(
      ENDPOINTS.FORM_SUBMISSIONS.APPROVE(submissionId),
    );
    return response.data;
  },

  reject: async (submissionId: string): Promise<SubmissionActionResponse> => {
    const response = await apiClient.post<SubmissionActionResponse>(
      ENDPOINTS.FORM_SUBMISSIONS.REJECT(submissionId),
    );
    return response.data;
  },
};

export default formSubmissionService;
