import apiClient from "../client";
import { ENDPOINTS } from "../endpoints";

export interface CountResponse {
  count: number;
}

export const dashboardService = {
  getWorkflowsCount: async (): Promise<CountResponse> => {
    const res = await apiClient.get(ENDPOINTS.WORKFLOWS.COUNT);
    return res.data.data;
  },

  getEntitiesCount: async (): Promise<CountResponse> => {
    const res = await apiClient.get(ENDPOINTS.ENTITIES.COUNT);
    return res.data.data;
  },

  getEntityTypesCount: async (): Promise<CountResponse> => {
    const res = await apiClient.get(ENDPOINTS.ENTITY_TYPES.COUNT);
    return res.data.data;
  },
};
