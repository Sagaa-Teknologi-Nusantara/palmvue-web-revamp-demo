import type { Entity } from "@/types";

import type { PaginationMeta } from "./common";

export interface EntityListParams {
  page?: number;
  size?: number;
  search?: string;
  entity_type_id?: string;
}

export interface EntityListResponse {
  items: Entity[];
  meta: PaginationMeta;
}

export interface EntityTypeOption {
  id: string;
  name: string;
  description: string;
  prefix: string;
  icon: string;
  color: string;
}
