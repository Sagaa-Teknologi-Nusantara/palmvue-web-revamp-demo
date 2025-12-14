'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GripVertical, Edit2, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepCardProps {
  id: string;
  name: string;
  formName: string;
  order: number;
  onEdit: () => void;
  onDelete: () => void;
}

export function StepCard({
  id,
  name,
  formName,
  order,
  onEdit,
  onDelete,
}: StepCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        'p-4 bg-white',
        isDragging && 'opacity-50 shadow-lg'
      )}
    >
      <div className="flex items-center gap-3">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab hover:bg-gray-100 p-1 rounded"
        >
          <GripVertical className="h-5 w-5 text-gray-400" />
        </button>

        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-medium">
          {order + 1}
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">{name}</p>
          <p className="text-sm text-gray-500 truncate">Form: {formName}</p>
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
