'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GripVertical, Edit2, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { type FieldConfig, FIELD_TYPE_OPTIONS, FIELD_TYPE_COLORS } from './types';

interface FieldCardProps {
  field: FieldConfig;
  onEdit: () => void;
  onDelete: () => void;
}

export function FieldCard({ field, onEdit, onDelete }: FieldCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const typeLabel = FIELD_TYPE_OPTIONS.find((t) => t.value === field.type)?.label || field.type;
  const typeColor = FIELD_TYPE_COLORS[field.type];

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        'p-3 bg-white',
        isDragging && 'opacity-50 shadow-lg'
      )}
    >
      <div className="flex items-center gap-3">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab hover:bg-gray-100 p-1 rounded"
        >
          <GripVertical className="h-4 w-4 text-gray-400" />
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium truncate">{field.label}</span>
            {field.required && (
              <span className="text-red-500 text-sm">*</span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <code className="text-xs text-gray-500 bg-gray-100 px-1 rounded">
              {field.name}
            </code>
            <Badge className={cn('text-xs', typeColor)} variant="secondary">
              {typeLabel}
            </Badge>
            {field.type === 'dropdown' && field.options && (
              <span className="text-xs text-gray-400">
                ({field.options.length} options)
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={onEdit}>
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
