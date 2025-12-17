import type { EntityType } from "./entity-type";

export interface EntityTypeRef {
  id: string;
  name: string;
  prefix: string;
  icon: string;
  bg_color: string;
  fg_color: string;
}

export interface EntityRef {
  id: string;
  code: string;
  name: string;
}

export interface Entity {
  id: string;
  entity_type_id: string;
  entity_type: EntityTypeRef;
  parent_id: string | null;
  parent: EntityRef | null;
  name: string;
  code: string;
  metadata: Record<string, unknown>;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface CreateEntityInput {
  entity_type_id: string;
  parent_id?: string | null;
  name: string;
  metadata: Record<string, unknown>;
}

export interface UpdateEntityInput {
  name?: string;
  metadata?: Record<string, unknown>;
  parent_id?: string | null;
}
