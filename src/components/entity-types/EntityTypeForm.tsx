'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { SchemaBuilder } from '@/components/schema-builder';
import type { EntityType, CreateEntityTypeInput, JSONSchema } from '@/types';

const defaultSchema: JSONSchema = {
  type: 'object',
  properties: {},
  required: [],
};

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  prefix: z
    .string()
    .min(1, 'Prefix is required')
    .max(5, 'Prefix must be 5 characters or less')
    .refine((val) => val === val.toUpperCase(), {
      message: 'Prefix must be uppercase',
    }),
});

type FormValues = z.infer<typeof formSchema>;

interface EntityTypeFormProps {
  entityType?: EntityType;
  onSubmit: (data: CreateEntityTypeInput) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function EntityTypeForm({
  entityType,
  onSubmit,
  onCancel,
  isLoading,
}: EntityTypeFormProps) {
  const [metadataSchema, setMetadataSchema] = useState<JSONSchema>(
    entityType?.metadata_schema || defaultSchema
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: entityType?.name || '',
      description: entityType?.description || '',
      prefix: entityType?.prefix || '',
    },
  });

  const handleSubmit = (values: FormValues) => {
    onSubmit({
      name: values.name,
      description: values.description,
      prefix: values.prefix.toUpperCase(),
      metadata_schema: metadataSchema,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Palm Tree" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe what this entity type represents..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="prefix"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prefix</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., TREE"
                  maxLength={5}
                  {...field}
                  onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                />
              </FormControl>
              <FormDescription>
                Max 5 characters, uppercase. Used for generating entity codes.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <FormLabel>Metadata Fields</FormLabel>
          <FormDescription className="mb-3">
            Define the fields that will be available for entities of this type.
          </FormDescription>
          <SchemaBuilder value={metadataSchema} onChange={setMetadataSchema} />
        </div>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : entityType ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
