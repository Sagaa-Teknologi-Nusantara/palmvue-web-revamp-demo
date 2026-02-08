import apiClient from "../client";
import { ENDPOINTS } from "../endpoints";
import type {
  AnalyticsDefinition,
  AnalyticsQueryResponse,
  AnalyticsSource,
  CreateAnalyticsDefinitionRequest,
  FieldOptionsResponse,
  UpdateAnalyticsDefinitionRequest,
} from "../types/analytics";

export const analyticsService = {
  getDefinitions: async (): Promise<AnalyticsDefinition[]> => {
    const res = await apiClient.get(ENDPOINTS.ANALYTICS.DEFINITIONS);
    return res.data.data;
  },

  getDefinitionById: async (id: string): Promise<AnalyticsDefinition> => {
    const res = await apiClient.get(ENDPOINTS.ANALYTICS.DEFINITION_DETAIL(id));
    return res.data.data;
  },

  createDefinition: async (
    data: CreateAnalyticsDefinitionRequest
  ): Promise<AnalyticsDefinition> => {
    const res = await apiClient.post(ENDPOINTS.ANALYTICS.DEFINITIONS, data);
    return res.data.data;
  },

  updateDefinition: async (
    id: string,
    data: UpdateAnalyticsDefinitionRequest
  ): Promise<AnalyticsDefinition> => {
    const res = await apiClient.put(
      ENDPOINTS.ANALYTICS.DEFINITION_DETAIL(id),
      data
    );
    return res.data.data;
  },

  deleteDefinition: async (id: string): Promise<void> => {
    await apiClient.delete(ENDPOINTS.ANALYTICS.DEFINITION_DETAIL(id));
  },

  executeQuery: async (id: string): Promise<AnalyticsQueryResponse> => {
    const res = await apiClient.get(ENDPOINTS.ANALYTICS.QUERY(id));
    return res.data.data;
  },

  getFieldOptions: async (source: AnalyticsSource): Promise<FieldOptionsResponse> => {
    const res = await apiClient.get(ENDPOINTS.ANALYTICS.FIELD_OPTIONS, {
      params: { source },
    });
    return res.data.data;
  },
};
