"use client";

import { useState, useCallback } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  restrictToVerticalAxis,
  restrictToParentElement,
} from "@dnd-kit/modifiers";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, LayoutGrid } from "lucide-react";
import { FieldCard } from "./FieldCard";
import { FieldEditor } from "./FieldEditor";
import { type FieldConfig, type FieldType } from "./types";
import type { JSONSchema, PropertySchema } from "@/types";

interface SchemaBuilderProps {
  value: JSONSchema;
  onChange: (schema: JSONSchema) => void;
}

// Convert JSONSchema to FieldConfig array
function schemaToFields(schema: JSONSchema): FieldConfig[] {
  if (!schema.properties) return [];

  const requiredFields = schema.required || [];

  return Object.entries(schema.properties).map(([name, prop]) => {
    let type: FieldType = "string";

    if (prop.enum) {
      type = "dropdown";
    } else if (prop.format === "date") {
      type = "date";
    } else if (prop.type === "boolean") {
      type = "boolean";
    } else if (prop.type === "number") {
      type = "number";
    } else if (prop.type === "integer") {
      type = "integer";
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
      type:
        field.type === "date" || field.type === "dropdown"
          ? "string"
          : field.type,
      title: field.label,
    };

    if (field.type === "date") {
      prop.format = "date";
    }
    if (field.type === "dropdown" && field.options) {
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
    type: "object",
    properties,
    required: required.length > 0 ? required : undefined,
  };
}

export function SchemaBuilder({ value, onChange }: SchemaBuilderProps) {
  const [fields, setFields] = useState<FieldConfig[]>(() =>
    schemaToFields(value),
  );
  const [editingField, setEditingField] = useState<FieldConfig | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteFieldId, setDeleteFieldId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // Update parent when fields change
  const updateSchema = useCallback(
    (newFields: FieldConfig[]) => {
      setFields(newFields);
      onChange(fieldsToSchema(newFields));
    },
    [onChange],
  );

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
    setIsEditing(true);
  };

  const handleEditField = (field: FieldConfig) => {
    setEditingField(field);
    setIsEditing(true);
  };

  const handleSaveField = (fieldData: Omit<FieldConfig, "id">) => {
    if (editingField) {
      // Update existing field
      updateSchema(
        fields.map((f) =>
          f.id === editingField.id ? { ...fieldData, id: editingField.id } : f,
        ),
      );
    } else {
      // Add new field
      updateSchema([...fields, { ...fieldData, id: uuidv4() }]);
    }
    setIsEditing(false);
    setEditingField(null);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingField(null);
  };

  const handleDeleteField = () => {
    if (deleteFieldId) {
      updateSchema(fields.filter((f) => f.id !== deleteFieldId));
      setDeleteFieldId(null);
    }
  };

  if (isEditing) {
    return (
      <div className="h-full">
        <FieldEditor
          field={editingField}
          onSave={handleSaveField}
          onCancel={handleCancelEdit}
        />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-border/40 flex items-center justify-between border-b px-4 py-2">
        <div className="flex flex-col">
          <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
            Fields
          </span>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddField}
          className="bg-background hover:bg-muted/50 h-8 text-xs transition-colors"
        >
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          Add Field
        </Button>
      </div>

      {fields.length === 0 ? (
        <div className="border-muted-foreground/20 bg-muted/5 animate-in fade-in-50 m-2 flex flex-1 flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center">
          <div className="bg-muted mb-3 rounded-full p-4">
            <LayoutGrid className="text-muted-foreground/50 h-6 w-6" />
          </div>
          <h3 className="text-foreground mb-1 text-sm font-medium">
            No fields defined yet
          </h3>
          <p className="text-muted-foreground mb-4 max-w-[180px] text-xs">
            Start adding inputs to collect data in this form step.
          </p>
          <Button type="button" size="sm" onClick={handleAddField}>
            <Plus className="mr-2 h-4 w-4" />
            Add First Field
          </Button>
        </div>
      ) : (
        <div className="relative flex-1 overflow-y-auto p-2">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis, restrictToParentElement]}
          >
            <SortableContext
              items={fields.map((f) => f.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
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
        </div>
      )}

      <AlertDialog
        open={!!deleteFieldId}
        onOpenChange={() => setDeleteFieldId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Field</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this field? This action cannot be
              undone.
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
