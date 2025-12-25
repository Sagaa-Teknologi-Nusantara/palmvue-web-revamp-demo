I want to integrate entity list page with provided endpoints:

GET /entities?page=1&size=10&search=Palm&entity_type_id=10eebc99-9c0b-4ef8-bb6d-6bb9bd380a40

Query Params:
- page: page number
- size: page size
- search: search query by entity name or code
- entity_type_id: entity type id

Response Body:
{
  "success": true,
  "message": "Entities retrieved successfully",
  "data": [
    {
      "id": "23eebc99-9c0b-4ef8-bb6d-6bb9bd380a53",
      "entity_type_id": "10eebc99-9c0b-4ef8-bb6d-6bb9bd380a40",
      "entity_type": {
        "id": "10eebc99-9c0b-4ef8-bb6d-6bb9bd380a40",
        "name": "Oil Palm Tree",
        "prefix": "TREE"
      },
      "name": "Dura Mother Palm DP-001",
      "metadata": {
        "variety": "Dura",
        "age_years": 12,
        "health_status": "excellent",
        "height_meters": 14.2,
        "research_plot": "Breeding-Block-1",
        "fruiting_status": true,
        "gps_coordinates": {
          "latitude": 3.1485,
          "longitude": 101.696
        }
      },
      "created_by": "b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12",
      "created_at": "2025-07-28T16:23:52.474066+07:00",
      "updated_at": "2025-07-28T16:23:52.474066+07:00"
    }
  ],
  "meta": {
    "page": 1,
    "size": 10,
    "total_items": 1,
    "total_pages": 1
  }
}

For parent ID and status filter, please ignore it for now (let them not functional)

Other than that, you need options for all entity types (for filtering), you can use this:

GET /entity-types/options

Response Body:
{
  "success": true,
  "message": "Entity type options retrieved successfully",
  "data": [
    {
      "id": "10eebc99-9c0b-4ef8-bb6d-6bb9bd380a40",
      "name": "Oil Palm Tree",
      "description": "Oil palm trees (Elaeis guineensis) in various growth stages and research plots",
      "prefix": "TREE"
    },
    {
      "id": "11eebc99-9c0b-4ef8-bb6d-6bb9bd380a41",
      "name": "Palm Inflorescence",
      "description": "Palm flower/inflorescence specimens for pollination research",
      "prefix": "INFL"
    },
    {
      "id": "13eebc99-9c0b-4ef8-bb6d-6bb9bd380a43",
      "name": "Palm Seed",
      "description": "Palm seeds for germination studies and seed bank storage",
      "prefix": "SEED"
    },
    {
      "id": "12eebc99-9c0b-4ef8-bb6d-6bb9bd380a42",
      "name": "Pollen Sample",
      "description": "Pollen samples collected and stored for breeding programs",
      "prefix": "POLN"
    }
  ]
}

Are those endpoint sufficient to display the entity list page? Please analyze first and you can verify doubt to me

Dont change the visual, focus on integration with API

Refer to the existing integrated page which are /entity-types, /entity-types/[id], /entity-types/create to understand the approach
