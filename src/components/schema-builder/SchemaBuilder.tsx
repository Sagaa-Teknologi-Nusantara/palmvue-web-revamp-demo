'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Plus } from 'lucide-react';
import { FieldCard } from './FieldCard';
import { FieldEditModal } from './FieldEditModal';
import { type FieldConfig, type FieldType } from './types';
import type { JSONSchema, PropertySchema } from '@/types';

interface SchemaBuilderProps {
  value: JSONSchema;
  onChange: (schema: JSONSchema) => void;
}

// Convert JSONSchema to FieldConfig array
function schemaToFields(schema: JSONSchema): FieldConfig[] {
  if (!schema.properties) return [];

  const requiredFields = schema.required || [];

  return Object.entries(schema.properties).map(([name, prop]) => {
    let type: FieldType = 'string';

    if (prop.enum) {
      type = 'dropdown';
    } else if (prop.format === 'date') {
      type = 'date';
    } else if (prop.type === 'boolean') {
      type = 'boolean';
    } else if (prop.type === 'number') {
      type = 'number';
    } else if (prop.type === 'integer') {
      type = 'integer';
    }

    return {
      id: uuidv4(),
      name,
      label: prop.title || name,
      type,
      required: requiredFields.includes(name),
      description: prop.description,
      options: prop.enum,
    };
  });
}

// Convert FieldConfig array to JSONSchema
function fieldsToSchema(fields: FieldConfig[]): JSONSchema {
  const properties: Record<string, PropertySchema> = {};
  const required: string[] = [];

  fields.forEach((field) => {
    const prop: PropertySchema = {
      type: field.type === 'date' || field.type === 'dropdown' ? 'string' : field.type,
      title: field.label,
    };

    if (field.type === 'date') {
      prop.format = 'date';
    }
    if (field.type === 'dropdown' && field.options) {
      prop.enum = field.options;
    }
    if (field.description) {
      prop.description = field.description;
    }

    properties[field.name] = prop;

    if (field.required) {
      required.push(field.name);
    }
  });

  return {
    type: 'object',
    properties,
    required: required.length > 0 ? required : undefined,
  };
}

export function SchemaBuilder({ value, onChange }: SchemaBuilderProps) {
  const [fields, setFields] = useState<FieldConfig[]>(() => schemaToFields(value));
  const [editingField, setEditingField] = useState<FieldConfig | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteFieldId, setDeleteFieldId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Update parent when fields change
  const updateSchema = useCallback((newFields: FieldConfig[]) => {
    setFields(newFields);
    onChange(fieldsToSchema(newFields));
  }, [onChange]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex((f) => f.id === active.id);
      const newIndex = fields.findIndex((f) => f.id === over.id);
      updateSchema(arrayMove(fields, oldIndex, newIndex));
    }
  };

  const handleAddField = () => {
    setEditingField(null);
    setIsModalOpen(true);
  };

  const handleEditField = (field: FieldConfig) => {
    setEditingField(field);
    setIsModalOpen(true);
  };

  const handleSaveField = (fieldData: Omit<FieldConfig, 'id'>) => {
    if (editingField) {
      // Update existing field
      updateSchema(
        fields.map((f) =>
          f.id === editingField.id ? { ...fieldData, id: editingField.id } : f
        )
      );
    } else {
      // Add new field
      updateSchema([...fields, { ...fieldData, id: uuidv4() }]);
    }
  };

  const handleDeleteField = () => {
    if (deleteFieldId) {
      updateSchema(fields.filter((f) => f.id !== deleteFieldId));
      setDeleteFieldId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {fields.length} field{fields.length !== 1 ? 's' : ''} defined
        </p>
        <Button type="button" variant="outline" size="sm" onClick={handleAddField}>
          <Plus className="mr-2 h-4 w-4" />
          Add Field
        </Button>
      </div>

      {fields.length === 0 ? (
        <Card className="p-8 text-center border-dashed">
          <p className="text-gray-500 mb-4">
            No fields added yet. Click &quot;Add Field&quot; to get started.
          </p>
          <Button type="button" onClick={handleAddField}>
            <Plus className="mr-2 h-4 w-4" />
            Add First Field
          </Button>
        </Card>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={fields.map((f) => f.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {fields.map((field) => (
                <FieldCard
                  key={field.id}
                  field={field}
                  onEdit={() => handleEditField(field)}
                  onDelete={() => setDeleteFieldId(field.id)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <FieldEditModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveField}
        field={editingField}
      />

      <AlertDialog open={!!deleteFieldId} onOpenChange={() => setDeleteFieldId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Field</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this field? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteField}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
