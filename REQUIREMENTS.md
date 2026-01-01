I want to implement entity update page. The API provided:
PATCH /entities/{id}

Request Body:
{
  "metadata": {},
  "name": "string",
  "parent_id": "string"
}

Request Struct:

type UpdateEntityRequest struct {
	ParentID *uuid.UUID       `json:"parent_id,omitempty"`
	Name     *string          `json:"name,omitempty"`
	Metadata *json.RawMessage `json:"metadata,omitempty" swaggertype:"primitive,object"`
}

Response body:
{
  "success": true,
  "message": "Entity updated successfully",
  "data": {
    "id": "8de73af2-a1ce-43a4-babb-0427ccca341d",
    "entity_type_id": "12eebc99-9c0b-4ef8-bb6d-6bb9bd380a42",
    "entity_type": {
      "id": "12eebc99-9c0b-4ef8-bb6d-6bb9bd380a42",
      "name": "Pollen Sample",
      "prefix": "POLN",
      "color": "green",
      "icon": "trees"
    },
    "parent_id": "45eebc99-9c0b-4ef8-bb6d-6bb9bd380a75",
    "parent": {
      "id": "45eebc99-9c0b-4ef8-bb6d-6bb9bd380a75",
      "code": "SEED-0003",
      "name": "Germination Trial Seeds GT-2024-A"
    },
    "name": "Pollen New Old",
    "code": "POLN-0011",
    "metadata": {
      "batch_number": "A-002",
      "quantity_grams": 100,
      "collection_date": "2025-12-27",
      "collection_method": "DOM",
      "source_tree_variety": "a",
      "viability_percentage": 8,
      "storage_temperature_celsius": 120
    },
    "created_by": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
    "created_at": "2025-12-26T10:31:11.922278+07:00",
    "updated_at": "2026-01-01T21:04:34.197152+07:00"
  }
}

Please implement in the new page /entities/{id}/edit. Ensure to load the existing data of the entity. You can use Entity Selector to select the parent entity. Refer to the entity type edit page for the implementation of update entity type.
