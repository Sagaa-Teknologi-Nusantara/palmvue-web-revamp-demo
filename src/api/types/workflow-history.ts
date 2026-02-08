import { EntityRef, EntityTypeRef } from "@/types";
import type { EntityWorkflowDetail } from "@/types/workflow-record";

export interface EntityWorkflowHistoryItem {
  entity: EntityRef;
  entity_type: EntityTypeRef;
  workflows: EntityWorkflowDetail[];
}
