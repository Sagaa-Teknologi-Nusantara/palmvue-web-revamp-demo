import type { EntityType, JSONSchema } from "@/types";

import type { PaginationMeta } from "./common";

export interface EntityTypeListResponse {
  items: EntityType[];
  meta: PaginationMeta;
}

export interface CreateEntityTypeRequest {
  description: string;
  metadata_schema: JSONSchema;
  name: string;
  prefix: string;
  workflow_ids: string[];
  icon: string;
  color: string;
}
