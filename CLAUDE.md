# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Start development server (http://localhost:3000)
npm run dev

# Production build
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Project Overview

PalmVue Revamp is a Next.js application for managing entities and workflows. It's a client-side application using browser localStorage for persistence, with dynamic schema-based forms and multi-step workflow orchestration.

## Core Domain Model

The application is built around four interconnected concepts:

1. **Entity Types**: Blueprints that define custom data structures using JSON Schema
   - Contains `metadata_schema` (JSON Schema) defining what fields instances will have
   - Has a `prefix` used for auto-generating entity codes (e.g., "PALM" → "PALM-001")

2. **Entities**: Instances of entity types with concrete data
   - Auto-generates unique codes using entity type prefix + sequential numbering
   - Supports hierarchical relationships via `parent_id`
   - Custom metadata must conform to the entity type's schema

3. **Workflows**: Multi-step process definitions
   - Each step contains a form definition (JSON Schema)
   - Can be assigned to entity types

4. **Workflow Records**: Track progress when entities go through workflows
   - Statuses: `not_started`, `in_progress`, `completed`
   - Records step submissions with timestamps
   - Automatically advances through workflow steps

## Architecture Patterns

### Data Flow

All data flows through custom React hooks that manage localStorage:

```
Components → Custom Hooks → useLocalStorage → Browser localStorage
```

**Storage keys** (defined in `src/lib/constants.ts`):
- `palmvue_entity_types`
- `palmvue_entities`
- `palmvue_workflows`
- `palmvue_workflow_records`
- `palmvue_entity_type_workflows`
- `palmvue_initialized`

### Custom Hooks Pattern

Each domain concept has a hook in `src/hooks/`:
- `useEntityTypes()` - CRUD for entity types, workflow assignments
- `useEntities()` - CRUD for entities, code generation, relationship queries
- `useWorkflows()` - CRUD for workflows
- `useWorkflowRecords()` - CRUD for workflow records, step submissions

These hooks provide:
- State synchronized with localStorage
- CRUD operations (create, update, remove)
- Query methods (getById, filter functions, relationship lookups)
- Business logic (e.g., auto-provisioning, code generation)

### Auto-Provisioning on Entity Creation

**Important**: When an entity is created, the system automatically:
1. Generates a unique code using the entity type's prefix
2. Looks up workflows assigned to that entity type
3. Creates WorkflowRecord instances for each assigned workflow
4. Sets all workflow records to `not_started` status

This means entities come pre-configured with their workflow tracking from creation.

### Dynamic Form System

Two complementary components work with JSON Schema:

1. **SchemaBuilder** (`src/components/schema-builder/SchemaBuilder.tsx`)
   - Visual editor for creating JSON Schemas
   - Drag-and-drop field reordering using dnd-kit
   - Converts between internal FieldConfig format and JSON Schema

2. **JsonSchemaForm** (`src/components/entities/JsonSchemaForm.tsx`)
   - Renders forms from JSON Schema definitions
   - Supports: string, number, integer, boolean, date, enum (dropdown)
   - Integrates with react-hook-form + Zod validation
   - Used for both entity metadata and workflow step forms

### Code Generation

Entity codes are auto-generated in `src/lib/code-generator.ts`:
- Format: `PREFIX-001`, `PREFIX-002`, etc. (zero-padded to 3 digits)
- Algorithm: extracts existing codes with matching prefix, finds max number, increments
- Used automatically during entity creation

### Database Seeding

The `DatabaseProvider` (`src/components/providers/DatabaseProvider.tsx`) runs on app mount:
- Checks `palmvue_initialized` flag in localStorage
- If not initialized, seeds mock data from `src/data/mock-*.ts`
- Ensures demo data is available on first load

## Path Aliasing

TypeScript is configured with path alias `@/*` mapping to `./src/*`:

```typescript
// Instead of: import { Button } from '../../../components/ui/button'
import { Button } from '@/components/ui/button'
```

## Key Files to Know

- `src/lib/storage.ts` - Wrapper around localStorage with SSR safety
- `src/lib/code-generator.ts` - Entity code generation logic
- `src/components/schema-builder/SchemaBuilder.tsx` - Visual JSON Schema builder
- `src/components/entities/JsonSchemaForm.tsx` - Dynamic form renderer
- `src/components/workflows/WorkflowProgress.tsx` - Workflow step progression UI

## Data Relationships

**Cascade behavior**:
- Deleting an entity automatically deletes all its workflow records
- Deleting an entity type removes it from workflow assignments

**Denormalization**:
- Relations stored as nested objects (e.g., entity contains full `entity_type` reference)
- This enables quick access without additional lookups in the localStorage-based system

## UI Components

The app uses Radix UI primitives wrapped in `src/components/ui/`:
- All components follow shadcn/ui conventions
- Styled with Tailwind CSS using `class-variance-authority`
- Icons from `lucide-react`

## Workflow Step Completion Flow

When a user completes a workflow step:
1. `WorkflowProgress` component displays current step's form
2. User submits form data
3. `useWorkflowRecords().submitStep()` is called
4. Hook records submission with timestamp
5. Hook advances to next step or marks workflow as completed
6. UI updates to show next step or completion message
