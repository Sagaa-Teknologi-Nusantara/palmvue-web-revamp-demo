I want to implement combobox/dropdown/selector for parent entity ID, it will be hard for the user if we returning all the entities available right? so i think we can use like component that can search also filter based on the entity type. I will have this endpoint to provide its functionality:

GET /entities/options?search=Palm&entity_type_id=10eebc99-9c0b-4ef8-bb6d-6bb9bd380a40

Query Params:

- search: search query by entity name or code
- entity_type_id: entity type id

Response Body:

```json
{
  "success": true,
  "message": "Entitiy options retrieved successfully",
  "data": [
    {
      "id": "uuid",
      "code": "PLT-001",
      "name": "Plant A"
    },
    {
      "id": "uuid",
      "code": "PLT-002",
      "name": "Plant B"
    }
  ]
}
```

You can use the entity types option (GET /entity-types/options already available for the query) to display the entity type selector 
