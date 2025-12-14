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
import type { JSONSchema } from '@/types';

const defaultFormSchema: JSONSchema = {
  type: 'object',
  properties: {},
  required: [],
};

const formSchema = z.object({
  name: z.string().min(1, 'Step name is required'),
  formName: z.string().min(1, 'Form name is required'),
});

type FormValues = z.infer<typeof formSchema>;

export interface StepData {
  id: string;
  name: string;
  formName: string;
  formSchema: JSONSchema;
}

interface StepEditModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: Omit<StepData, 'id'>) => void;
  step?: StepData | null;
}

export function StepEditModal({ open, onClose, onSave, step }: StepEditModalProps) {
  const [schema, setSchema] = useState<JSONSchema>(defaultFormSchema);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      formName: '',
    },
  });

  useEffect(() => {
    if (step) {
      form.reset({
        name: step.name,
        formName: step.formName,
      });
      setSchema(step.formSchema);
    } else {
      form.reset({
        name: '',
        formName: '',
      });
      setSchema(defaultFormSchema);
    }
  }, [step, form, open]);

  const handleSubmit = (values: FormValues) => {
    onSave({
      name: values.name,
      formName: values.formName,
      formSchema: schema,
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{step ? 'Edit Step' : 'Add Step'}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Step Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Initial Check" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="formName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Form Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Initial Check Form" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel>Form Fields</FormLabel>
              <FormDescription className="mb-3">
                Define the fields for this step&apos;s form
              </FormDescription>
              <SchemaBuilder value={schema} onChange={setSchema} />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">{step ? 'Save Changes' : 'Add Step'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
