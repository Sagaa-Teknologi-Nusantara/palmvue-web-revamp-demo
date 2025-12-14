# Frontend Demo Implementation Plan

## Overview

Build a frontend demo for entity and workflow management using Next.js 16 + shadcn/ui + localStorage persistence. No backend connection.

## Approach

- Framework: Next.js 16 with App Router (existing setup)
- UI Library: shadcn/ui for production-quality components
- Styling: Tailwind CSS v4 (already configured)
- Drag & Drop: @dnd-kit/core + @dnd-kit/sortable
- Forms: react-hook-form
- JSON Editor: @monaco-editor/react
- Persistence: localStorage

## Implementation Phases

### Phase 1: Foundation Setup

1. Install dependencies:

   ```bash
   npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities react-hook-form @hookform/resolvers zod @monaco-editor/react uuid
   npm install -D @types/uuid
   ```

2. Initialize shadcn/ui:

   ```bash
   npx shadcn@latest init
   ```

3. Add shadcn components:

   - Button, Input, Label, Textarea, Select
   - Card, Badge, Table
   - Dialog, AlertDialog
   - Dropdown Menu, Separator
   - Skeleton, Tabs

4. Create project structure:

   ```
   src/
   ├── app/
   │   ├── layout.tsx (update with sidebar)
   │   ├── page.tsx (dashboard)
   │   ├── entity-types/
   │   ├── entities/
   │   └── workflows/
   ├── components/
   │   ├── layout/
   │   ├── ui/ (shadcn components)
   │   ├── entity-types/
   │   ├── entities/
   │   └── workflows/
   ├── hooks/
   ├── lib/
   ├── types/
   └── data/
   ```

### Phase 2: Core Infrastructure

1. Types (src/types/)

   - entity-type.ts - EntityType, CreateEntityTypeInput
   - entity.ts - Entity, CreateEntityInput
   - workflow.ts - Workflow, WorkflowStep, StepForm
   - workflow-record.ts - WorkflowRecord, StepSubmission

2. Utilities (src/lib/)

   - constants.ts - localStorage keys
   - storage.ts - localStorage wrapper
   - utils.ts - cn() helper, date formatting
   - code-generator.ts - entity code generation

3. Mock Data (src/data/)

   - 4 entity types: Palm Tree, Plot, Worker, Equipment
   - 10+ entities with parent relationships
   - 3 workflows with 3-4 steps each
   - seed.ts - initialize localStorage on first load

4. Layout (src/components/layout/)

   - Sidebar.tsx - navigation with links to all pages
   - PageHeader.tsx - page title + actions
   - Update app/layout.tsx with sidebar

### Phase 3: Entity Types Feature

1. Hook: src/hooks/useEntityTypes.ts

   - CRUD operations on localStorage
   - Validation helpers

2. Components (src/components/entity-types/)

   - EntityTypeForm.tsx - create/edit form with JSON schema editor
   - EntityTypeTable.tsx - list with actions
   - JsonSchemaEditor.tsx - Monaco editor wrapper

3. Pages:

   - /entity-types - list view with create button
   - /entity-types/create - create form page
   - /entity-types/[id] - detail view

### Phase 4: Workflows Feature (Drag & Drop)

1. Hook: src/hooks/useWorkflows.ts

   - CRUD operations
   - Step ordering logic

2. Components (src/components/workflows/)

   - WorkflowBuilder.tsx - DnD context + sortable container
   - StepCard.tsx - draggable step item with edit/delete
   - StepEditModal.tsx - step form with Monaco editor
   - WorkflowTable.tsx - list view

3. Pages:

   - /workflows - list view
   - /workflows/create - drag-drop builder
   - /workflows/[id] - detail (read-only)

### Phase 5: Entities Feature

1. Hooks:

   - src/hooks/useEntities.ts - CRUD, search, filter
   - src/hooks/usePagination.ts - table pagination

2. Components (src/components/entities/)

   - EntityForm.tsx - with dynamic metadata form
   - EntityTable.tsx - with pagination
   - EntityFilters.tsx - search + type/parent filters
   - JsonSchemaForm.tsx - renders form from JSON schema

3. Pages:

   - /entities - list with filters
   - /entities/create - create form
   - /entities/[id] - detail view

### Phase 6: Workflow Assignment (Secondary)

1. Update useEntityTypes.ts:

   - assignWorkflow(entityTypeId, workflowId)
   - unassignWorkflow(entityTypeId, workflowId)
   - getAssignedWorkflows(entityTypeId)

2. Component: WorkflowAssignment.tsx

   - Dropdown to select workflow
   - List of assigned workflows with unassign button

3. Update entity type detail page with assignment section

### Phase 7: Workflow Progress (Secondary)

1. Hook: src/hooks/useWorkflowRecords.ts

   - Auto-create records when entity created
   - submitStep(recordId, stepId, data)

2. Components (src/components/workflows/)

   - WorkflowProgress.tsx - full workflow view
   - StepTimeline.tsx - visual stepper
   - StepFormRenderer.tsx - current step form

3. Update entity detail page with workflow records section

### Phase 8: Dashboard & Polish

1. Dashboard page (app/page.tsx):

   - Stats cards (entity types, entities, workflows)
   - Recent entities table
   - Quick action buttons

2. Polish:

   - Loading skeletons everywhere
   - Empty states with helpful CTAs
   - Form validation messages
   - Status badges (gray/yellow/green)
   - Responsive design

## Key Files to Create/Modify

### Modify

- src/app/layout.tsx - add sidebar navigation
- src/app/page.tsx - convert to dashboard
- src/app/globals.css - add custom styles if needed
- package.json - add dependencies

### Create (Core)

- src/types/\*.ts - all type definitions
- src/lib/constants.ts, storage.ts, utils.ts, code-generator.ts
- src/data/mock-\*.ts, seed.ts
- src/hooks/useEntityTypes.ts, useEntities.ts, useWorkflows.ts
- src/components/layout/Sidebar.tsx, PageHeader.tsx

### Create (Features)

- src/app/entity-types/page.tsx, create/page.tsx, [id]/page.tsx
- src/app/entities/page.tsx, create/page.tsx, [id]/page.tsx
- src/app/workflows/page.tsx, create/page.tsx, [id]/page.tsx
- All component files in src/components/

## Technical Notes

1. Monaco Editor SSR: Use dynamic import with ssr: false
2. localStorage Hydration: Use useEffect to avoid SSR mismatch
3. Entity Code Generation: Format as {PREFIX}-{NNN} (e.g., TREE-001)
4. Drag-Drop: Use @dnd-kit/sortable with arrayMove utility
5. Form Validation: Use zod schemas with react-hook-form

## Mock Data Summary

- Entity Types: Palm Tree (TREE), Plot (PLOT), Worker (WRK), Equipment (EQUIP)
- Entities: 10+ across types with some parent-child relationships
- Workflows:

  - Palm Tree Assessment (3 steps)
  - Equipment Maintenance (3 steps)
  - Plot Inspection (4 steps)
