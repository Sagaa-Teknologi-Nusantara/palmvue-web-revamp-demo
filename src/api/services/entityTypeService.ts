import type { EntityType, Workflow } from "@/types";

import apiClient from "../client";
import { ENDPOINTS } from "../endpoints";
import type { ApiResponse, PaginationParams } from "../types";
import type {
  CreateEntityTypeRequest,
  EntityTypeListResponse,
} from "../types/entity-type";

export const entityTypeService = {
  getList: async (
    params: PaginationParams = {},
  ): Promise<EntityTypeListResponse> => {
    const { page = 1, size = 12 } = params;
    const response = await apiClient.get<ApiResponse<EntityType[]>>(
      ENDPOINTS.ENTITY_TYPES.LIST,
      { params: { page, size } },
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

  getById: async (id: string): Promise<EntityType> => {
    const response = await apiClient.get<ApiResponse<EntityType>>(
      ENDPOINTS.ENTITY_TYPES.DETAIL(id),
    );
    return response.data.data;
  },

  getWorkflows: async (id: string): Promise<Workflow[]> => {
    const response = await apiClient.get<ApiResponse<Workflow[]>>(
      ENDPOINTS.ENTITY_TYPES.WORKFLOWS(id),
    );
    return response.data.data;
  },

  create: async (data: CreateEntityTypeRequest): Promise<EntityType> => {
    const response = await apiClient.post<ApiResponse<EntityType>>(
      ENDPOINTS.ENTITY_TYPES.CREATE,
      data,
    );
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(ENDPOINTS.ENTITY_TYPES.DELETE(id));
  },
};

export default entityTypeService;
