---
trigger: always_on
---

# Agent Rules

## Before Coding

- Read `context/project_overview.md` for domain model understanding
- Explore existing patterns in similar files before creating new ones
- Check `src/components/ui/` for reusable components

## Code Standards

- Use TypeScript strict typing; avoid `any`
- Add `"use client";` only when using hooks/interactivity
- Use absolute imports with `@/` alias
- Handle errors with try/catch and show toast messages

## Import Order

```typescript
// 1. External libraries
import { useState } from "react";
// 2. Internal modules (@/)
import { Button } from "@/components/ui/button";
// 3. Relative imports
import { LocalComponent } from "./LocalComponent";
```

## Naming

- PascalCase: Components, Types, Interfaces
- camelCase: Functions, variables, hooks
- kebab-case: File names for pages/routes
