import type {
  CreateWorkflowInput,
  Workflow,
  WorkflowListItem,
  WorkflowOption,
} from "@/types";

import apiClient from "../client";
import { ENDPOINTS } from "../endpoints";
import type { ApiResponse } from "../types";
import type {
  WorkflowListParams,
  WorkflowListResponse,
} from "../types/workflow";

export const workflowService = {
  getList: async (
    params: WorkflowListParams = {},
  ): Promise<WorkflowListResponse> => {
    const { page = 1, size = 12, search, entity_type_ids } = params;
    const queryParams: Record<string, string | number> = { page, size };
    if (search) queryParams.search = search;
    if (entity_type_ids?.length)
      queryParams.entity_type_ids = entity_type_ids.join(",");

    const response = await apiClient.get<ApiResponse<WorkflowListItem[]>>(
      ENDPOINTS.WORKFLOWS.LIST,
      { params: queryParams },
    );
    return {
      items: response.data.data,
      meta: response.data.meta || {
        page,
        size,
        total_items: response.data.data.length,
        total_pages: 1,
      },
    };
  },

  getOptions: async (entityTypeId?: string): Promise<WorkflowOption[]> => {
    const params = entityTypeId ? { entity_type_id: entityTypeId } : {};
    const response = await apiClient.get<ApiResponse<WorkflowOption[]>>(
      ENDPOINTS.WORKFLOWS.OPTIONS,
      { params },
    );
    return response.data.data;
  },

  create: async (data: CreateWorkflowInput): Promise<Workflow> => {
    const response = await apiClient.post<ApiResponse<Workflow>>(
      ENDPOINTS.WORKFLOWS.CREATE,
      data,
    );
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(ENDPOINTS.WORKFLOWS.DELETE(id));
  },
};

export default workflowService;
