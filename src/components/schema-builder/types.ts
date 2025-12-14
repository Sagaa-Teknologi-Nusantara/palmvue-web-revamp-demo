export type FieldType = 'string' | 'number' | 'integer' | 'boolean' | 'date' | 'dropdown';

export interface FieldConfig {
  id: string;
  name: string;        // JSON key
  label: string;       // Display title
  type: FieldType;
  required: boolean;
  description?: string;
  options?: string[];  // For dropdown type
}

export const FIELD_TYPE_OPTIONS: { value: FieldType; label: string }[] = [
  { value: 'string', label: 'Text' },
  { value: 'number', label: 'Number' },
  { value: 'integer', label: 'Integer' },
  { value: 'boolean', label: 'Boolean' },
  { value: 'date', label: 'Date' },
  { value: 'dropdown', label: 'Dropdown' },
];

export const FIELD_TYPE_COLORS: Record<FieldType, string> = {
  string: 'bg-blue-100 text-blue-800',
  number: 'bg-purple-100 text-purple-800',
  integer: 'bg-indigo-100 text-indigo-800',
  boolean: 'bg-green-100 text-green-800',
  date: 'bg-orange-100 text-orange-800',
  dropdown: 'bg-pink-100 text-pink-800',
};
