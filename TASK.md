I want to integrate entity type creation page with real API backend. The API endpoint is as follows:

POST /entity-types

Request Body:
{
  "description": "Represents a palm tree entity",
  "metadata_schema": {},
  "name": "Tree",
  "prefix": "TREE",
  "workflow_ids": [],
  "icon": "alarm",
  "color": "red"
}

Response Body:
{
  "message": "string",
  "success": true,
  "data": {
    "color": "string",
    "created_at": "string",
    "description": "string",
    "icon": "string",
    "id": "string",
    "metadata_schema": {},
    "name": "string",
    "prefix": "string",
    "updated_at": "string",
    "workflow_ids": [
      "string"
    ]
  }
}

You also need options for available workflows

GET /workflows/options

Response Body:
{
  "message": "string",
  "success": true,
  "data": [
    {
      "id": "string",
      "name": "string"
      "is_auto_start": true,
      "is_loopable": true,
    }
  ]
}


For the color, just use constant colors where name of the color will have 2 colors for foreground and background. So in backend, it only need to store the name of the color.

For the icon, just use lucide icons name that already used now

Dont change the visual, just focus on the API integration
