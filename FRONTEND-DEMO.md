# Frontend Demo Generation Prompt

Generate a **frontend web demo** that mirrors the **current backend functionality**, but **does not connect to the backend**.

## Scope

* UI and client-side behavior only
* Use **dummy / mocked data** that represents realistic backend responses
* No API calls, no backend integration

---

## Core Features

### 1. Entity Type Management

Create and view **Entity Types** - categories/templates that define what kind of entities can be created.

**Create Entity Type Form:**
```json
{
  "name": "Palm Tree",              // required
  "description": "Represents a palm tree asset",  // required
  "prefix": "TREE",                 // required, max 5 chars, uppercase
  "metadata_schema": {              // required, JSON schema for entity metadata
    "type": "object",
    "properties": {
      "height": { "type": "number" },
      "species": { "type": "string" },
      "plantedDate": { "type": "string", "format": "date" }
    }
  }
}
```

**Entity Type Response:**
```json
{
  "id": "uuid",
  "name": "Palm Tree",
  "description": "Represents a palm tree asset",
  "prefix": "TREE",
  "metadata_schema": { ... },
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

**UI Behavior:**
- Form with validation (name required, description required, prefix max 5 chars uppercase)
- JSON editor for metadata_schema
- List view with all entity types
- Detail view showing full entity type info

---

### 2. Entity Management

Create and view **Entities** - instances of an entity type.

**Create Entity Form:**
```json
{
  "entity_type_id": "uuid",           // required, dropdown selection
  "parent_id": "uuid",                // optional, for hierarchical entities
  "name": "Tree #1",                  // required
  "metadata": {                       // required, must match entity type's metadata_schema
    "height": 15.5,
    "species": "Coconut Palm",
    "plantedDate": "2020-03-15"
  }
}
```

**Entity Response:**
```json
{
  "id": "uuid",
  "entity_type_id": "uuid",
  "entity_type": {
    "id": "uuid",
    "name": "Palm Tree",
    "prefix": "TREE"
  },
  "parent_id": "uuid|null",
  "parent": {
    "id": "uuid",
    "code": "TREE-001",
    "name": "Parent Tree"
  },
  "name": "Tree #1",
  "code": "TREE-001",           // auto-generated from prefix + sequential
  "metadata": { ... },
  "created_by": "uuid",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

**UI Behavior:**
- Entity type dropdown (populated from entity types)
- Optional parent entity dropdown (filtered by type)
- Dynamic metadata form that renders based on selected entity type's metadata_schema
- List view with search, filter by entity type, filter by parent
- Detail view with all entity info + workflow status

---

### 3. Workflow Management (Drag & Drop Builder)

Create **Workflows** with multiple **Steps**, each step having its own **Form**.

**Create Workflow - Drag & Drop Interface:**

```json
{
  "name": "Palm Tree Assessment",     // required
  "steps": [                          // required, min 1 step
    {
      "name": "Initial Check",        // required
      "order_index": 0,               // auto-managed by drag order, starts at 0
      "form": {
        "name": "Initial Check Form",
        "schema": {                   // JSON schema for form fields
          "type": "object",
          "properties": {
            "condition": { 
              "type": "string", 
              "enum": ["good", "fair", "poor"] 
            },
            "notes": { "type": "string" }
          },
          "required": ["condition"]
        }
      }
    },
    {
      "name": "Detailed Assessment",
      "order_index": 1,
      "form": {
        "name": "Assessment Form",
        "schema": { ... }
      }
    },
    {
      "name": "Final Review",
      "order_index": 2,
      "form": {
        "name": "Review Form",
        "schema": { ... }
      }
    }
  ]
}
```

**Workflow Response:**
```json
{
  "id": "uuid",
  "name": "Palm Tree Assessment",
  "steps": [
    {
      "id": "uuid",
      "name": "Initial Check",
      "order_index": 0,
      "form": {
        "id": "uuid",
        "name": "Initial Check Form",
        "schema": { ... }
      }
    }
  ],
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

**UI Behavior - Drag & Drop Workflow Builder:**
- Workflow name input field
- **Draggable step cards** that can be reordered (order_index auto-updates on drag)
- Each step card shows: step name, form name preview
- **"Add Step" button** to add new steps at the bottom
- **Click on step card** opens a **modal** with:
  - Step name input
  - Form name input
  - Form schema JSON editor
  - Save/Cancel buttons
- Visual indicator for step order (1, 2, 3...)
- Delete step button (with confirmation)
- Empty state when no steps added yet

---

### 4. Assign Workflow to Entity Type

Link workflows to entity types so entities of that type automatically get that workflow assigned.

**Assign Workflow Request:**
```json
{
  "workflow_id": "uuid"
}
```

**API Route:** `POST /entity-types/{entity_type_id}/workflows`

**UI Behavior:**
- On entity type detail page, show "Assigned Workflows" section
- Dropdown to select available workflows
- "Assign" button to link workflow to entity type
- List of assigned workflows with "Unassign" button
- When an entity is created with that entity type, workflows are auto-assigned

---

### 5. Entity Workflow Records (Progress Tracking)

When an entity is created, workflow records are automatically created for each assigned workflow.

**Workflow Record Response:**
```json
{
  "id": "uuid",
  "entity_id": "uuid",
  "workflow_id": "uuid",
  "workflow": {
    "id": "uuid",
    "name": "Palm Tree Assessment"
  },
  "current_step_id": "uuid|null",
  "current_step": {
    "id": "uuid",
    "name": "Initial Check",
    "order_index": 0
  },
  "status": "not_started|in_progress|completed",
  "started_at": "2024-01-01T00:00:00Z",
  "completed_at": "2024-01-01T00:00:00Z|null",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

**Get Current Step with Form (for step submission):**
```json
{
  "id": "uuid",
  "entity_id": "uuid",
  "workflow_id": "uuid",
  "current_step_id": "uuid",
  "current_step": {
    "id": "uuid",
    "name": "Initial Check",
    "order_index": 0,
    "form": {
      "id": "uuid",
      "name": "Initial Check Form",
      "schema": { ... }
    }
  },
  "status": "in_progress"
}
```

**Submit Step Request:**
```json
{
  "data": {
    "condition": "good",
    "notes": "Tree looks healthy"
  }
}
```

**API Route:** `POST /workflow-records/{workflow_record_id}/steps/{step_id}/submit`

**UI Behavior:**
- Entity detail page shows list of workflow records
- Each workflow record shows: workflow name, current step, status badge
- Click on workflow record opens workflow progress view:
  - Step timeline/stepper showing all steps
  - Current step highlighted
  - Completed steps marked with checkmark
  - Current step shows the form (rendered from schema)
  - Submit button to complete current step and advance
- Status badges: `not_started` (gray), `in_progress` (yellow), `completed` (green)

---

## Page Structure

### Navigation
- **Dashboard** - Overview/home
- **Entity Types** - List and manage entity types
- **Entities** - List and manage entities
- **Workflows** - Create and manage workflows (drag & drop builder)

### Entity Types Page
1. **List View**: Table with name, prefix, description, actions (view, edit)
2. **Create Modal/Page**: Form with JSON editor for metadata schema
3. **Detail View**: 
   - Entity type info
   - Assigned workflows section (with assign/unassign actions)
   - Option to delete/edit

### Entities Page
1. **List View**: Table with code, name, entity type, parent, status
   - Search by name/code
   - Filter by entity type (dropdown)
   - Filter by parent entity (dropdown)
2. **Create Modal/Page**: 
   - Entity type dropdown
   - Optional parent entity dropdown
   - Name input
   - Dynamic metadata form based on entity type's schema
3. **Detail View**:
   - Entity info (code, name, type, parent, metadata)
   - Workflow records section with status for each workflow
   - Click workflow record to see/submit current step

### Workflows Page
1. **List View**: Cards showing workflow name, number of steps
2. **Create Page - Drag & Drop Builder**:
   - Workflow name input
   - Draggable step cards
   - Add step button
   - Step edit modal (name, form name, form schema JSON)
   - Save workflow button
3. **Detail View**: Read-only view of workflow with all steps and forms

---

## UI Expectations

* Modern, production-like design (Light mode preferred)
* Smooth drag & drop animations for workflow builder
* Modal forms for step editing
* Form validation matching backend rules:
  - Entity type prefix: max 5 chars, uppercase
  - Required fields properly marked
  - JSON schema validation for metadata/form schemas
* Tables with pagination (10, 25, 50 per page options)
* Loading states (skeleton loaders)
* Empty states with helpful messaging
* Error states with clear error messages
* Status badges with appropriate colors
* Stepper/timeline for workflow progress

---

## Technical Requirements

* Frontend only (no server, use localStorage for persistence)
* **Technology**: Use Vite + React + TypeScript
* **Styling**: Use modern CSS (prefer TailwindCSS for rapid development)
* **Drag & Drop**: Use `@dnd-kit/core` or `react-beautiful-dnd`
* **Form Handling**: Use `react-hook-form` with validation
* **JSON Editor**: Use `@monaco-editor/react` for schema editing
* Clearly mark all mocked data and behaviors
* Structure code to easily replace mocks with real API calls later
* Use UUIDs for all IDs (use `uuid` package)

---

## Mock Data Examples

Provide realistic mock data including:
- 3-4 entity types (Palm Tree, Plot, Worker, Equipment)
- 10+ entities across different types with parent relationships
- 2-3 workflows with 3-5 steps each
- Workflow records at various stages (not started, in progress, completed)

---

## Output

* Full frontend code (structured as a proper Next js project)
* Clear explanation of main components and data flow
* Instructions to run the demo locally
