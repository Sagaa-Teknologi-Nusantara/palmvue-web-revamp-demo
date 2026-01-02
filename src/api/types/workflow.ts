import type { CompletionAction, WorkflowListItem } from "@/types";

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

export interface UpdateWorkflowRequest {
  name?: string;
  is_loopable?: boolean;
  is_auto_start?: boolean;
  add_entity_type_ids?: string[];
  include_existing?: boolean;
  on_complete?: CompletionAction[];
}
