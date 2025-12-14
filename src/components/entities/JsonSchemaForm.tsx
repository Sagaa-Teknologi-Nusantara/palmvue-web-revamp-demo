'use client';

import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import type { JSONSchema, PropertySchema } from '@/types';

interface JsonSchemaFormProps {
  schema: JSONSchema;
  prefix?: string;
}

export function JsonSchemaForm({ schema, prefix = '' }: JsonSchemaFormProps) {
  const form = useFormContext();

  if (!schema.properties) {
    return null;
  }

  const properties = Object.entries(schema.properties);
  const requiredFields = schema.required || [];

  return (
    <div className="space-y-4">
      {properties.map(([key, prop]) => {
        const fieldName = prefix ? `${prefix}.${key}` : key;
        const isRequired = requiredFields.includes(key);

        return (
          <FormField
            key={fieldName}
            control={form.control}
            name={fieldName}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {prop.title || key}
                  {isRequired && <span className="text-red-500 ml-1">*</span>}
                </FormLabel>
                <FormControl>
                  {renderField(prop, field)}
                </FormControl>
                {prop.description && (
                  <p className="text-sm text-gray-500">{prop.description}</p>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        );
      })}
    </div>
  );
}

function renderField(
  prop: PropertySchema,
  field: {
    value: unknown;
    onChange: (value: unknown) => void;
    onBlur: () => void;
    name: string;
  }
) {
  // Handle enum (dropdown)
  if (prop.enum) {
    return (
      <Select
        value={field.value as string || ''}
        onValueChange={field.onChange}
      >
        <SelectTrigger>
          <SelectValue placeholder={`Select ${prop.title || 'option'}...`} />
        </SelectTrigger>
        <SelectContent>
          {prop.enum.map((option) => (
            <SelectItem key={option} value={option}>
              {option.charAt(0).toUpperCase() + option.slice(1).replace(/_/g, ' ')}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  // Handle boolean (checkbox)
  if (prop.type === 'boolean') {
    return (
      <div className="flex items-center space-x-2">
        <Checkbox
          checked={field.value as boolean}
          onCheckedChange={field.onChange}
        />
        <span className="text-sm text-gray-600">Yes</span>
      </div>
    );
  }

  // Handle date
  if (prop.format === 'date') {
    return (
      <Input
        type="date"
        value={field.value as string || ''}
        onChange={(e) => field.onChange(e.target.value)}
        onBlur={field.onBlur}
      />
    );
  }

  // Handle number
  if (prop.type === 'number' || prop.type === 'integer') {
    return (
      <Input
        type="number"
        step={prop.type === 'integer' ? '1' : 'any'}
        value={field.value as number || ''}
        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : '')}
        onBlur={field.onBlur}
        placeholder={prop.title || ''}
      />
    );
  }

  // Default to string input
  return (
    <Input
      type="text"
      value={field.value as string || ''}
      onChange={(e) => field.onChange(e.target.value)}
      onBlur={field.onBlur}
      placeholder={prop.title || ''}
    />
  );
}
