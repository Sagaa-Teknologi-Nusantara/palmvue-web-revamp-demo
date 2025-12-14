'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
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
import { Plus, X } from 'lucide-react';
import { type FieldConfig, type FieldType, FIELD_TYPE_OPTIONS } from './types';

const formSchema = z.object({
  name: z
    .string()
    .min(1, 'Field name is required')
    .regex(/^[a-zA-Z_][a-zA-Z0-9_]*$/, 'Must start with letter/underscore, contain only letters, numbers, underscores'),
  label: z.string().min(1, 'Display label is required'),
  type: z.enum(['string', 'number', 'integer', 'boolean', 'date', 'dropdown'] as const),
  required: z.boolean(),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface FieldEditModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (field: Omit<FieldConfig, 'id'>) => void;
  field?: FieldConfig | null;
}

export function FieldEditModal({ open, onClose, onSave, field }: FieldEditModalProps) {
  const [options, setOptions] = useState<string[]>([]);
  const [newOption, setNewOption] = useState('');

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      label: '',
      type: 'string',
      required: false,
      description: '',
    },
  });

  const fieldType = form.watch('type');

  useEffect(() => {
    if (field) {
      form.reset({
        name: field.name,
        label: field.label,
        type: field.type,
        required: field.required,
        description: field.description || '',
      });
      setOptions(field.options || []);
    } else {
      form.reset({
        name: '',
        label: '',
        type: 'string',
        required: false,
        description: '',
      });
      setOptions([]);
    }
    setNewOption('');
  }, [field, form, open]);

  const handleAddOption = () => {
    if (newOption.trim() && !options.includes(newOption.trim())) {
      setOptions([...options, newOption.trim()]);
      setNewOption('');
    }
  };

  const handleRemoveOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleSubmit = (values: FormValues) => {
    if (values.type === 'dropdown' && options.length === 0) {
      return;
    }

    onSave({
      name: values.name,
      label: values.label,
      type: values.type,
      required: values.required,
      description: values.description || undefined,
      options: values.type === 'dropdown' ? options : undefined,
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{field ? 'Edit Field' : 'Add Field'}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Field Name (JSON Key)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., firstName" {...field} />
                  </FormControl>
                  <FormDescription>
                    Used as the key in the JSON schema
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Label</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., First Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Field Type</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {FIELD_TYPE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {fieldType === 'dropdown' && (
              <div className="space-y-2">
                <FormLabel>Dropdown Options</FormLabel>
                <div className="flex gap-2">
                  <Input
                    value={newOption}
                    onChange={(e) => setNewOption(e.target.value)}
                    placeholder="Add an option"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddOption();
                      }
                    }}
                  />
                  <Button type="button" variant="outline" onClick={handleAddOption}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {options.length > 0 ? (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {options.map((option, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-md text-sm"
                      >
                        <span>{option}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveOption(index)}
                          className="text-gray-500 hover:text-red-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-amber-600">
                    Add at least one option for the dropdown
                  </p>
                )}
              </div>
            )}

            <FormField
              control={form.control}
              name="required"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="font-normal">Required field</FormLabel>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Help text for this field"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={fieldType === 'dropdown' && options.length === 0}
              >
                {field ? 'Save Changes' : 'Add Field'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
