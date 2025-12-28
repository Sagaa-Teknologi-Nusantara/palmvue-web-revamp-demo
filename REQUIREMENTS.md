I want to integrate the workflow list page with real API. These are the endpoints:

GET /workflows?size=2&search=tree&entity_type_ids=10eebc99-9c0b-4ef8-bb6d-6bb9bd380a40

{
  "success": true,
  "message": "Workflows retrieved successfully",
  "data": [
    {
      "id": "70eebc99-9c0b-4ef8-bb6d-6bb9bd380c01",
      "name": "Palm Tree Registration & Initial Assessment",
      "is_loopable": true,
      "is_auto_start": true,
      "step_count": 4,
      "active_record_count": 4,
      "steps": [
        {
          "id": "80eebc99-9c0b-4ef8-bb6d-6bb9bd380d01",
          "name": "Tree Tagging & GPS Mapping",
          "order_index": 0,
          "requires_approval": true
        },
        {
          "id": "81eebc99-9c0b-4ef8-bb6d-6bb9bd380d02",
          "name": "Genetic Background Documentation",
          "order_index": 1,
          "requires_approval": false
        },
        {
          "id": "82eebc99-9c0b-4ef8-bb6d-6bb9bd380d03",
          "name": "Field Condition Assessment",
          "order_index": 2,
          "requires_approval": true
        },
        {
          "id": "83eebc99-9c0b-4ef8-bb6d-6bb9bd380d04",
          "name": "Registration Completion",
          "order_index": 3,
          "requires_approval": false
        }
      ],
      "entity_types": [
        {
          "id": "10eebc99-9c0b-4ef8-bb6d-6bb9bd380a40",
          "name": "Oil Palm Tree",
          "prefix": "TREE",
          "color": "red",
          "icon": "trees"
        },
        {
          "id": "11eebc99-9c0b-4ef8-bb6d-6bb9bd380a41",
          "name": "Palm Inflorescence",
          "prefix": "INFL",
          "color": "blue",
          "icon": "trees"
        },
        {
          "id": "12eebc99-9c0b-4ef8-bb6d-6bb9bd380a42",
          "name": "Pollen Sample",
          "prefix": "POLN",
          "color": "green",
          "icon": "trees"
        },
        {
          "id": "13eebc99-9c0b-4ef8-bb6d-6bb9bd380a43",
          "name": "Palm Seed",
          "prefix": "SEED",
          "color": "yellow",
          "icon": "trees"
        }
      ],
      "created_at": "2025-07-09T10:29:49.048311+07:00",
      "updated_at": "2025-07-09T10:29:49.048311+07:00"
    }
  ],
  "meta": {
    "page": 1,
    "size": 2,
    "total_items": 1,
    "total_pages": 1
  }
}

GET /entity-types/options, the implementation of the query and service should exists. Use this to show the available options for entity type filter. Also integrate the pagination also

You can refer to the existing list page such as entities and entity types to understand the implementation. 
