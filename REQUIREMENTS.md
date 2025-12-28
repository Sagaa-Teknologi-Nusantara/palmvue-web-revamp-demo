Now i want to integrate the workflow, it should use this endpoint:

GET /entities/{entity_id}/workflows/details

Response body:
{
  "success": true,
  "message": "Workflow details retrieved successfully",
  "data": [
    {
      "id": "f0eebc99-9c0b-4ef8-bb6d-6bb9bd380f21", // workflow record id
      "workflow_id": "71eebc99-9c0b-4ef8-bb6d-6bb9bd380c02",
      "workflow": {
        "id": "71eebc99-9c0b-4ef8-bb6d-6bb9bd380c02",
        "name": "Annual Growth & Health Monitoring"
      },
      "status": "completed", // completed, pending_approval, not_started, in_progress
      "current_step_id": "86eebc99-9c0b-4ef8-bb6d-6bb9bd380d07", // can be NULL if not_started
      "steps": [
        {
          "id": "84eebc99-9c0b-4ef8-bb6d-6bb9bd380d05",
          "name": "Growth Metrics Collection",
          "order_index": 0,
          "requires_approval": false,
          "form": {
            "id": "64eebc99-9c0b-4ef8-bb6d-6bb9bd380b05",
            "name": "Annual Growth Metrics",
            "schema": {
              "type": "object",
              "required": [
                "height_increase_cm",
                "frond_production",
                "health_maintained",
                "measurement_date"
              ],
              "properties": {
                "fruiting_status": {
                  "type": "boolean"
                },
                "frond_production": {
                  "type": "number",
                  "minimum": 0
                },
                "measurement_date": {
                  "type": "string",
                  "format": "date"
                },
                "health_maintained": {
                  "type": "boolean"
                },
                "flowering_observed": {
                  "type": "boolean"
                },
                "height_increase_cm": {
                  "type": "number",
                  "minimum": 0
                }
              }
            }
          },
          "submission_count": 0
        },
        {
          "id": "85eebc99-9c0b-4ef8-bb6d-6bb9bd380d06",
          "name": "Field Health Inspection",
          "order_index": 1,
          "requires_approval": true,
          "form": {
            "id": "66eebc99-9c0b-4ef8-bb6d-6bb9bd380b07",
            "name": "Field Inspection Report",
            "schema": {
              "type": "object",
              "required": [
                "plot_condition",
                "plant_health",
                "pest_control",
                "overall_rating"
              ],
              "properties": {
                "pest_control": {
                  "type": "number",
                  "maximum": 10,
                  "minimum": 1
                },
                "plant_health": {
                  "type": "number",
                  "maximum": 10,
                  "minimum": 1
                },
                "overall_rating": {
                  "enum": [
                    "excellent",
                    "good",
                    "satisfactory",
                    "needs_improvement",
                    "unsatisfactory"
                  ],
                  "type": "string"
                },
                "plot_condition": {
                  "type": "number",
                  "maximum": 10,
                  "minimum": 1
                },
                "irrigation_status": {
                  "type": "number",
                  "maximum": 10,
                  "minimum": 1
                },
                "deficiencies_found": {
                  "type": "array",
                  "items": {
                    "type": "string"
                  }
                }
              }
            }
          },
          "submission_count": 0
        },
        {
          "id": "86eebc99-9c0b-4ef8-bb6d-6bb9bd380d07",
          "name": "Annual Performance Review",
          "order_index": 2,
          "requires_approval": false,
          "form": {
            "id": "65eebc99-9c0b-4ef8-bb6d-6bb9bd380b06",
            "name": "Annual Performance Report",
            "schema": {
              "type": "object",
              "required": [
                "growth_performance",
                "review_date"
              ],
              "properties": {
                "review_date": {
                  "type": "string",
                  "format": "date"
                },
                "recommendations": {
                  "type": "array",
                  "items": {
                    "type": "string"
                  }
                },
                "fruit_bunch_count": {
                  "type": "number",
                  "minimum": 0
                },
                "growth_performance": {
                  "enum": [
                    "excellent",
                    "good",
                    "fair",
                    "poor"
                  ],
                  "type": "string"
                },
                "oil_yield_estimate": {
                  "type": "number",
                  "minimum": 0
                }
              }
            }
          },
          "submission_count": 0
        }
      ],
      "started_at": "2025-10-07T10:29:49.048311+07:00",
      "completed_at": "2025-12-01T10:29:49.048311+07:00",
      "created_at": "2025-10-07T10:29:49.048311+07:00",
      "updated_at": "2025-12-01T10:29:49.048311+07:00"
    }
  ]
}


GET /workflow-records/{workflow_record_id}/steps/{step_id}/submissions

Workflow Record ID can be retrieved from the above endpoint

Response body:
{
  "success": true,
  "message": "Workflow details retrieved successfully",
  "data": [
  {
    "id": "submission_uuid", 
    "workflow_record_id": "record_uuid",
    "step_id": "step_uuid",
    "form_name": "Onboarding Form",
    "data": { /* JSON data */ },
    "status": "approved",
    "submitted_by": {
      "id": "user_uuid",
      "username": "john.doe"
    },
    "reviewed_by": {
      "id": "user_uuid",
      "username": "admin"
    },
    "submitted_at": "2025-01-01T10:00:00Z",
    "created_at": "...",
    "updated_at": "..."
  }
]
}
