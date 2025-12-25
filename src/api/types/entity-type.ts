import type { EntityType } from "@/types";

import type { PaginationMeta } from "./common";

export interface EntityTypeListResponse {
  items: EntityType[];
  meta: PaginationMeta;
}
