I want to integrate workflow details page. This is the API endpoint:

GET /workflows/{workflow_id}

{
  "success": true,
  "message": "Workflow retrieved successfully",
  "data": {
    "id": "9b400e60-4fea-488c-823d-e26f3f7cdba0",
    "name": "Ini Marshal Baru",
    "is_loopable": false,
    "is_auto_start": false,
    "steps": [
      {
        "id": "8842c940-a8ee-4ab9-9a3e-9ad3b03a9983",
        "name": "Intgeerr",
        "order_index": 0,
        "requires_approval": true,
        "form": {
          "id": "6ecf501a-3deb-4242-b6c8-56d66d76ee29",
          "name": "adawdad",
          "schema": {
            "type": "object",
            "properties": {
              "Integer": {
                "type": "integer",
                "title": "integer"
              }
            }
          }
        }
      }
    ],
    "entity_types": [
      {
        "id": "10eebc99-9c0b-4ef8-bb6d-6bb9bd380a40",
        "name": "Oil Palm Tree",
        "prefix": "TREE",
        "color": "red",
        "icon": "trees"
      }
    ],
    "on_complete_actions": [
      {
        "type": "start_workflow",
        "config": {
          "workflow_id": "d9817ddf-badc-46c5-b565-65e1992060ea",
          "workflow_name": "Halo"
        }
      },
      {
        "type": "create_entities",
        "config": {
          "entity_type_id": "11eebc99-9c0b-4ef8-bb6d-6bb9bd380a41",
          "entity_type_info": {
            "id": "11eebc99-9c0b-4ef8-bb6d-6bb9bd380a41",
            "name": "Palm Inflorescence",
            "prefix": "INFL",
            "color": "blue",
            "icon": "trees"
          },
          "count_source": {
            "type": "submission_field",
            "step_order": 0,
            "field_path": "Integer",
            "value": 14
          }
        }
      }
    ],
    "created_at": "2025-12-29T11:33:45.816173+07:00",
    "updated_at": "2025-12-29T11:33:45.816173+07:00"
  }
}

You can adjust the appearance especially including is auto start and loopable options. You also need to add completion actions to be shown in the page. Refer to the existing integrated page such as entity details page. Also you can see in the workflow creation page to see the configuration of completion actions.

Please be concise and mindful. Focus on necessary code changes only for integration
