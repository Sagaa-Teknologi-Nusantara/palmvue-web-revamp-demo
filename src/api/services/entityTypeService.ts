import type { EntityType } from "@/types/entity-type";

import apiClient from "../client";
import { ENDPOINTS } from "../endpoints";
import type { ApiResponse, PaginationParams } from "../types";
import type { EntityTypeListResponse } from "../types/entity-type";

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
};

export default entityTypeService;
