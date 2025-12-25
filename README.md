# PalmVue Revamp Web

A Next.js web application for managing entities and workflows in palm plantation operations.

## Tech Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS 4** + **shadcn/ui** (Radix UI)
- **React Query** + **Axios** for API integration
- **React Hook Form** + **Zod** for forms
- **@dnd-kit** for drag-and-drop

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/           # Next.js pages (entities, entity-types, workflows)
├── api/           # API client, services, types
├── components/    # UI components (entities, workflows, ui, providers)
├── hooks/         # Custom hooks + React Query hooks
├── types/         # Domain type definitions
└── lib/           # Utilities
```

## Features

- **Entity Management** - Create and track entities with custom schemas
- **Workflow Builder** - Visual drag-and-drop workflow designer
- **Dynamic Forms** - JSON Schema-driven form rendering
- **Schema Builder** - Visual JSON Schema editor

## Documentation

See [context/project_overview.md](context/project_overview.md) for detailed architecture.
