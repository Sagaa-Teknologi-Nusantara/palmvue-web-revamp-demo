---
trigger: always_on
---

# Styling

## Stack

- **Tailwind CSS 4.x** → Utility classes
- **shadcn/ui** → Components in `src/components/ui/`
- **CVA** → Variant-based component styling

## Class Merge Utility

```typescript
import { cn } from "@/lib/cn";
<div className={cn("base-class", condition && "conditional", className)} />
```

## Theme Tokens (use these, not raw colors)

| Token                                    | Usage                 |
| ---------------------------------------- | --------------------- |
| `bg-primary` / `text-primary-foreground` | Brand elements        |
| `bg-secondary`                           | Secondary backgrounds |
| `bg-muted` / `text-muted-foreground`     | Subtle elements       |
| `bg-destructive`                         | Error/delete actions  |
| `border-border`                          | Borders               |

## shadcn Components

Available in `src/components/ui/`: Button, Card, Dialog, Input, Select, Table, Tabs, Form, Badge, etc.

```tsx
import { Button } from "@/components/ui/button";
<Button variant="default">Primary</Button>
<Button variant="outline">Secondary</Button>
<Button variant="destructive">Delete</Button>
```

## Icons (Lucide React)

```tsx
import { Plus, Edit, Trash2 } from "lucide-react";
<Button>
  <Plus className="h-4 w-4" /> Add
</Button>;
```

## Toast (Sonner)

```tsx
import { toast } from "sonner";
toast.success("Saved");
toast.error("Failed");
```

## Layout Spacing

- `space-y-4` between items, `space-y-6` between sections
- `p-4` / `p-6` for card padding
- `gap-4` for grid/flex gaps
