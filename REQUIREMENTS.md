I want to implement entity type update page. This is the API endpoint:

PATCH /entity-types/{id}

Request body:
{
  "add_workflow_ids": [
    "string"
  ],
  "color": "blue",
  "description": "Updated description",
  "icon": "chevron-right",
  "include_existing": false,
  "name": "Updated Tree"
}

Request struct in backend:
type UpdateEntityTypeRequest struct {
	Name            *string
	Description     *string
	Color           *string
	Icon            *string
	AddWorkflowIDs  []uuid.UUID
	IncludeExisting *bool
}

Response body:
{
  "success": true,
  "message": "Entity type updated successfully",
  "data": {
    "id": "13eebc99-9c0b-4ef8-bb6d-6bb9bd380a43",
    "name": "Updated Palm Seed",
    "description": "Palm seeds for germination studies and seed bank storage",
    "prefix": "SEED",
    "metadata_schema": {...},
    "color": "yellow",
    "icon": "trees",
    "workflow_ids": null, // should be only added workflow if exists
    "created_at": "2025-07-19T10:29:49.048311+07:00",
    "updated_at": "2026-01-01T17:07:48.269707+07:00"
  }
}

Make sure in the new page /entity-types/{id}/edit, it show the existing data of the entity type. You can use the GET /entity-types/{id} and GET /entity-types/{id}/workflows to get the existing data. The added workflows should be from GET /workflows/options, exclude the assigned workflows

Please be concise and focus on necessary code changes
