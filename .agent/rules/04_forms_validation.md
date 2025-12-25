---
trigger: always_on
---

# Forms & Validation

## Stack

- **React Hook Form** → Form state
- **Zod** → Schema validation
- **shadcn Form** → UI components

## Basic Pattern

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
});
type FormValues = z.infer<typeof schema>;

function MyForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "" },
  });

  const onSubmit = (data: FormValues) => {
    /* submit */
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          Save
        </Button>
      </form>
    </Form>
  );
}
```

## With Mutation

```tsx
const mutation = useCreateEntity();
const onSubmit = async (data: FormValues) => {
  await mutation.mutateAsync(data);
  form.reset();
};
<Button disabled={mutation.isPending}>
  {mutation.isPending ? "Saving..." : "Save"}
</Button>;
```

## Common Zod Schemas

```typescript
z.string().min(2).max(100); // Text with length
z.string().email(); // Email
z.number().positive(); // Positive number
z.enum(["a", "b", "c"]); // Enum
z.array(z.string()).min(1); // Non-empty array
z.string().optional(); // Optional
```
