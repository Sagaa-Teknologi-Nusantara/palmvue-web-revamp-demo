I want to integrate workflow creation page. These are the endpoints:

POST /workflows
{
  "entity_type_ids": [
    "550e8400-e29b-41d4-a716-446655440000"
  ],
  "is_auto_start": true,
  "is_loopable": false,
  "name": "Palm Tree Assessment",
  "on_complete": [
    {
      "config": {},
      "type": "create_entities"
    }
  ],
  "steps": [
    {
      "form": {
        "name": "Assessment Form",
        "schema": {}
      },
      "name": "Initial Assessment",
      "order_index": 0,
      "requires_approval": false
    }
  ]
}

You need to add the creation form to also include auto start and loopable options. Then there are on complete actions also that need to be added.

The on complete actions are like this (this code is from backend):
type CreateOnCompleteActionRequest struct {
	Type   string          `json:"type" validate:"required,oneof=create_entities start_workflow" example:"create_entities"`
	Config json.RawMessage `json:"config" validate:"required" swaggertype:"primitive,object"`
}

const (
	ActionCreateEntities CompletionActionType = "create_entities"
	ActionStartWorkflow  CompletionActionType = "start_workflow"
)

type CountSourceType string

const (
	CountSourceFixed           CountSourceType = "fixed"
	CountSourceSubmissionField CountSourceType = "submission_field"
)

type CompletionAction struct {
	Type   CompletionActionType
	Config json.RawMessage
}

type CreateEntitiesConfig struct {
	EntityTypeID uuid.UUID
	CountSource  CountSource
}

type CountSource struct {
	Type      CountSourceType
	StepOrder *int
	FieldPath string
	Value     int
}

type StartWorkflowConfig struct {
	WorkflowID   uuid.UUID
	EntityTypeID uuid.UUID
}


So there are two types of on complete actions:
1. Create entities
2. Start workflow

For create entities, there are two types of count source which are fixed and submission field. For submission field, we need to show available fields that are created in the step in creation form. So user can add the step with its form, and then in completion action, user can select the field that already filled (make sure the type of field is integer). The field selection will be on front end logic, and the backend onlu accept the step order and the field path as mentioned in the code snippet above

For start workflow, each action we need to scope the available workflows based on the entity type selected in the creation form. User need to select one entity types that assigned to the workflow, and then we can show the available workflow for that entity type. You can use GET /workflows/options?entity_type_id={entity_type_id} to get the available workflows. Ensure it cannot assign to itself.

So the task is:
- Create component for auto start and loopable options. Toggle or checkbox should works
- Create component for on complete actions. User can input multiple action. The flow is adding the action, choose the type (create_entities, start_workflow), then based on the type, show the form to fill the config
- Integrate all the components to the creation form
- Ensure the form is validated before submission
- Submit to the provided API POST /workflows
