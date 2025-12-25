import type { Entity } from "@/types";

import apiClient from "../client";
import { ENDPOINTS } from "../endpoints";
import type { ApiResponse } from "../types";
import type { EntityListParams, EntityListResponse } from "../types/entity";

export const entityService = {
  getList: async (
    params: EntityListParams = {},
  ): Promise<EntityListResponse> => {
    const { page = 1, size = 12, search, entity_type_id } = params;
    const queryParams: Record<string, string | number> = { page, size };
    if (search) queryParams.search = search;
    if (entity_type_id && entity_type_id !== "all")
      queryParams.entity_type_id = entity_type_id;

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

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(ENDPOINTS.ENTITIES.DELETE(id));
  },
};

export default entityService;
