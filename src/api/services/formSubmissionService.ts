import apiClient from "../client";
import { ENDPOINTS } from "../endpoints";

export interface SubmissionActionResponse {
  success: boolean;
  message: string;
}

export const formSubmissionService = {
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
