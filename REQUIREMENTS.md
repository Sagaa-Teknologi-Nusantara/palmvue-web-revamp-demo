I want to integrate /entities/create page with real API. The API provided:

POST /entities

Request Body:
{
  "entity_type_id": "string",
  "metadata": {},
  "name": "string",
  "parent_id": "string"
}

Response Body:
{
  "success": true,
  "message": "Entity created successfully",
  "data": {
    "id": "e52cca99-f30d-4dcd-8155-f091d1832641",
    "entity_type_id": "12eebc99-9c0b-4ef8-bb6d-6bb9bd380a42",
    "entity_type": {
      "id": "12eebc99-9c0b-4ef8-bb6d-6bb9bd380a42",
      "name": "Pollen Sample",
      "prefix": "POLN",
      "color": "",
      "icon": ""
    },
    "parent_id": "42eebc99-9c0b-4ef8-bb6d-6bb9bd380a72",
    "parent": {
      "id": "42eebc99-9c0b-4ef8-bb6d-6bb9bd380a72",
      "code": "POLN-0008",
      "name": "Fresh Pollen Collection FP-2024-06-20"
    },
    "name": "Female Flower - Block A12",
    "code": "POLN-0011",
    "metadata": {
      "batch_number": "A-2025-01",
      "quantity_grams": 125.5,
      "collection_date": "2025-01-12",
      "collection_method": "manual extraction",
      "source_tree_variety": "pisifera",
      "viability_percentage": 92.3,
      "storage_temperature_celsius": -18
    },
    "created_by": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
    "created_at": "2025-12-26T10:06:09.176889+07:00",
    "updated_at": "2025-12-26T10:06:09.176889+07:00"
  }
}

The submitted metadata should follow the entity type schema. You can use /entity-types/options endpoint to get all entity types available, and then use /entity-types/{entity_type_id} endpoint to get the schema for the entity type. Both API query should be exists.

What do you think? Are those endpoints sufficient and efficient to create an entity? Please be mindful
