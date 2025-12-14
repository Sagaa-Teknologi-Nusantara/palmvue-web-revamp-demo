'use client';

import { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { JsonSchemaForm } from './JsonSchemaForm';
import type { EntityType, Entity, CreateEntityInput } from '@/types';

const baseSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  entity_type_id: z.string().min(1, 'Entity type is required'),
  parent_id: z.string().optional(),
});

interface EntityFormProps {
  entityTypes: EntityType[];
  entities: Entity[];
  onSubmit: (data: CreateEntityInput) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function EntityForm({
  entityTypes,
  entities,
  onSubmit,
  onCancel,
  isLoading,
}: EntityFormProps) {
  const form = useForm({
    resolver: zodResolver(baseSchema),
    defaultValues: {
      name: '',
      entity_type_id: '',
      parent_id: '',
    },
  });

  const selectedTypeId = form.watch('entity_type_id');
  const selectedType = entityTypes.find((t) => t.id === selectedTypeId);

  // Get possible parent entities (could be any entity, typically same type or related)
  const possibleParents = entities;

  const handleSubmit = (values: z.infer<typeof baseSchema>) => {
    // Gather metadata from form
    const metadata: Record<string, unknown> = {};

    if (selectedType?.metadata_schema.properties) {
      Object.keys(selectedType.metadata_schema.properties).forEach((key) => {
        const value = form.getValues(key as keyof typeof values);
        if (value !== undefined && value !== '') {
          metadata[key] = value;
        }
      });
    }

    onSubmit({
      name: values.name,
      entity_type_id: values.entity_type_id,
      parent_id: values.parent_id || null,
      metadata,
    });
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="entity_type_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Entity Type</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an entity type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {entityTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name} ({type.prefix})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    The type determines the metadata fields and auto-generated code prefix.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Palm Tree Alpha" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="parent_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parent Entity (Optional)</FormLabel>
                  <Select
                    value={field.value || 'none'}
                    onValueChange={(val) => field.onChange(val === 'none' ? '' : val)}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a parent entity" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">No parent</SelectItem>
                      {possibleParents.map((entity) => (
                        <SelectItem key={entity.id} value={entity.id}>
                          {entity.code} - {entity.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Optional hierarchical relationship to another entity.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {selectedType && (
          <Card>
            <CardHeader>
              <CardTitle>Metadata</CardTitle>
            </CardHeader>
            <CardContent>
              <JsonSchemaForm schema={selectedType.metadata_schema} />
            </CardContent>
          </Card>
        )}

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading || !selectedTypeId}>
            {isLoading ? 'Creating...' : 'Create Entity'}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
