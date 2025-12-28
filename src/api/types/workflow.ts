import type { WorkflowListItem } from "@/types";

import type { PaginationMeta } from "./common";

export interface WorkflowListParams {
  page?: number;
  size?: number;
  search?: string;
  entity_type_ids?: string[];
}

export interface WorkflowListResponse {
  items: WorkflowListItem[];
  meta: PaginationMeta;
}
