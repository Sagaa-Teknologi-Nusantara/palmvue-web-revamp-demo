I want to integrate entity type detail page with real backend API. The API provided are as follows:

GET /entity-types/:id

Response Body:
{
  "success": true,
  "message": "Entity type retrieved successfully",
  "data": {
    "id": "13eebc99-9c0b-4ef8-bb6d-6bb9bd380a43",
    "name": "Palm Seed",
    "description": "Palm seeds for germination studies and seed bank storage",
    "prefix": "SEED",
    "metadata_schema": {
      "type": "object",
      "required": [
        "seed_source",
        "parent_varieties"
      ],
      "properties": {
        "batch_id": {
          "type": "string"
        },
        "seed_source": {
          "enum": [
            "controlled-cross",
            "open-pollinated"
          ],
          "type": "string"
        },
        "genetic_marker": {
          "type": "string"
        },
        "parent_varieties": {
          "type": "object",
          "properties": {
            "father": {
              "type": "string"
            },
            "mother": {
              "type": "string"
            }
          }
        },
        "viability_tested": {
          "type": "boolean"
        },
        "storage_duration_days": {
          "type": "number",
          "minimum": 0
        },
        "germination_rate_percentage": {
          "type": "number",
          "maximum": 100,
          "minimum": 0
        }
      }
    },
    "color": "yellow",
    "icon": "trees",
    "workflow_ids": null,
    "created_at": "2025-07-18T16:23:52.474066+07:00",
    "updated_at": "2025-07-18T16:23:52.474066+07:00"
  }
}


Other than that, you will also need all workflow related to that entity types using this API:

GET /entity-types/:id/workflows

Response Body:
{
  "success": true,
  "message": "Workflows retrieved successfully",
  "data": [
    {
      "id": "70eebc99-9c0b-4ef8-bb6d-6bb9bd380c01",
      "name": "Palm Tree Registration & Initial Assessment",
      "is_loopable": true,
      "is_auto_start": true,
      "steps": [
        {
          "id": "80eebc99-9c0b-4ef8-bb6d-6bb9bd380d01",
          "name": "Tree Tagging & GPS Mapping",
          "order_index": 0,
          "requires_approval": true,
          "form": {
            "id": "60eebc99-9c0b-4ef8-bb6d-6bb9bd380b01",
            "name": "Tree Registration Form",
            "schema": {
              ...
            }
          }
        },
        ...
      ],
      "entity_types": [], // for now it always empty and not populated, you can ignore this
      "created_at": "2025-07-08T16:23:52.474066+07:00",
      "updated_at": "2025-07-08T16:23:52.474066+07:00"
    },
    ...
  ]
}


Please analyze if both endpoint are sufficient to display all the related data. Also dont change the visual, only focus on integration

You can refer to the entity type list page, and entity type creation page that already integrated

Please make a plan first

Additional endpoints for deletion:
DELETE /entity-types/:id

Response Body:
{
  "success": true,
  "message": "Entity type deleted successfully"
}

But it will be error if the entity type already have entities
