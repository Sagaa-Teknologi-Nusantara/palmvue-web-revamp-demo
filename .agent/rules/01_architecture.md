---
trigger: always_on
---

# Architecture

## App Router Structure

```
src/app/
├── layout.tsx           # Root layout (providers wrap here)
├── page.tsx             # Home/Dashboard
├── [feature]/
│   ├── page.tsx         # List view
│   ├── new/page.tsx     # Create form
│   └── [id]/page.tsx    # Detail/Edit view
```

## Component Structure

```
src/components/
├── [feature]/           # Feature-specific (entities/, workflows/)
├── layout/              # Sidebar, TopBar
├── providers/           # Context providers
└── ui/                  # shadcn/ui primitives
```

## Other Directories

| Directory    | Purpose                                |
| ------------ | -------------------------------------- |
| `src/api/`   | API client, services, types, endpoints |
| `src/hooks/` | Custom hooks, React Query hooks        |
| `src/types/` | Domain type definitions                |
| `src/lib/`   | Utilities (cn, token, constants)       |

## Provider Order (in layout.tsx)

```tsx
<QueryProvider>
  <AuthProvider>
    <DatabaseProvider>{children}</DatabaseProvider>
  </AuthProvider>
</QueryProvider>
```
