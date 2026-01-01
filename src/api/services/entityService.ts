import type { Entity, EntityWorkflowDetail } from "@/types";

import apiClient from "../client";
import { ENDPOINTS } from "../endpoints";
import type { ApiResponse } from "../types";
import type {
  CreateEntityRequest,
  EntityListParams,
  EntityListResponse,
  EntityOption,
  EntityOptionsParams,
} from "../types/entity";

export const entityService = {
  getList: async (
    params: EntityListParams = {},
  ): Promise<EntityListResponse> => {
    const { page = 1, size = 12, search, entity_type_id, parent_id } = params;
    const queryParams: Record<string, string | number> = { page, size };
    if (search) queryParams.search = search;
    if (entity_type_id && entity_type_id !== "all")
      queryParams.entity_type_id = entity_type_id;
    if (parent_id) queryParams.parent_id = parent_id;

    const response = await apiClient.get<ApiResponse<Entity[]>>(
      ENDPOINTS.ENTITIES.LIST,
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

  getById: async (id: string): Promise<Entity> => {
    const response = await apiClient.get<ApiResponse<Entity>>(
      ENDPOINTS.ENTITIES.DETAIL(id),
    );
    return response.data.data;
  },

  getOptions: async (
    params: EntityOptionsParams = {},
  ): Promise<EntityOption[]> => {
    const { search, entity_type_id } = params;
    const queryParams: Record<string, string> = {};
    if (search) queryParams.search = search;
    if (entity_type_id) queryParams.entity_type_id = entity_type_id;

    const response = await apiClient.get<ApiResponse<EntityOption[]>>(
      ENDPOINTS.ENTITIES.OPTIONS,
      { params: queryParams },
    );
    return response.data.data;
  },

  create: async (data: CreateEntityRequest): Promise<Entity> => {
    const response = await apiClient.post<ApiResponse<Entity>>(
      ENDPOINTS.ENTITIES.CREATE,
      data,
    );
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(ENDPOINTS.ENTITIES.DELETE(id));
  },

  getWorkflowDetails: async (
    entityId: string,
  ): Promise<EntityWorkflowDetail[]> => {
    const response = await apiClient.get<ApiResponse<EntityWorkflowDetail[]>>(
      ENDPOINTS.ENTITIES.WORKFLOW_DETAILS(entityId),
    );
    return response.data.data;
  },
};

export default entityService;
