Create an edit workflow page at /workflows/[id]/edit that allows updating an existing workflow using the PATCH /workflows/{id} endpoint.

API Details
Endpoint: `PATCH /api/workflows/{id}`

Request Body:

```typescript
interface UpdateWorkflowRequest {
  name?: string;
  is_loopable?: boolean;
  is_auto_start?: boolean;
  add_entity_type_ids?: string[]; // Only add, cannot remove
  include_existing?: boolean; // Backfill workflow records for new entity types
  on_complete?: CompletionAction[]; // Full replacement when provided
}
interface CompletionAction {
  type: "create_entities" | "start_workflow";
  config: CreateEntitiesConfig | StartWorkflowConfig;
}
interface CreateEntitiesConfig {
  entity_type_id: string;
  count_source: {
    type: "fixed" | "submission_field";
    value?: number; // For fixed
    step_order?: number; // For submission_field
    field_path?: string; // For submission_field
  };
}
interface StartWorkflowConfig {
  workflow_id: string;
  entity_type_id: string; // Must be assigned to this workflow
}
```

Page Requirements

- Fetch existing workflow via GET /api/workflows/{id} to pre-populate the form

Editable Fields:

- Name - Text input
- Behaviour section:
  - is_loopable - Toggle/checkbox
  - is_auto_start - Toggle/checkbox
- Entity Types section:
  - Show currently assigned entity types (read-only display)
  - Combobox/multi-select to add NEW entity types (fetch from /api/entity-types/options)
  - Checkbox for "Include existing entities" (backfill) - only shown when adding new entity types
- Completion Actions section:
  - Display current actions
  - Allow full replacement (add/remove/edit actions)

For create_entities: select entity type, configure count source
For start_workflow: select workflow (must be assigned to the entity type)

Validation Rules:

- For start_workflow completion action:
  - Entity type must be in the workflow's assigned entity types (current + newly added)
  - Target workflow must be assigned to that entity type
    UX Considerations:
- Only send changed fields in the PATCH request
- Show confirmation before replacing completion actions
- Warn user about backfill consequences when "Include existing" is checked

Reference: Check the existing workflow detail page at /workflows/[id] and entity type edit page at /entity-types/[id]/edit for design patterns.
