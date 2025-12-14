'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { PageHeader } from '@/components/layout';
import { useWorkflows } from '@/hooks';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/lib/code-generator';
import { cn } from '@/lib/utils';
import type { JSONSchema, PropertySchema } from '@/types';

// Field type display configuration
const FIELD_TYPE_CONFIG: Record<string, { label: string; color: string }> = {
  string: { label: 'Text', color: 'bg-blue-100 text-blue-800' },
  number: { label: 'Number', color: 'bg-purple-100 text-purple-800' },
  integer: { label: 'Integer', color: 'bg-indigo-100 text-indigo-800' },
  boolean: { label: 'Boolean', color: 'bg-green-100 text-green-800' },
  date: { label: 'Date', color: 'bg-orange-100 text-orange-800' },
  dropdown: { label: 'Dropdown', color: 'bg-pink-100 text-pink-800' },
};

function getFieldType(prop: PropertySchema): string {
  if (prop.enum) return 'dropdown';
  if (prop.format === 'date') return 'date';
  return prop.type || 'string';
}

function FormSchemaDisplay({ schema }: { schema: JSONSchema }) {
  if (!schema.properties || Object.keys(schema.properties).length === 0) {
    return (
      <p className="text-sm text-gray-500">No fields defined for this form.</p>
    );
  }

  const requiredFields = schema.required || [];

  return (
    <div className="space-y-2">
      {Object.entries(schema.properties).map(([fieldName, prop]) => {
        const fieldType = getFieldType(prop);
        const config = FIELD_TYPE_CONFIG[fieldType] || FIELD_TYPE_CONFIG.string;
        const isRequired = requiredFields.includes(fieldName);

        return (
          <div
            key={fieldName}
            className="p-3 bg-white rounded border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{prop.title || fieldName}</span>
                {isRequired && (
                  <span className="text-red-500 text-xs">*</span>
                )}
                <code className="text-xs text-gray-400 bg-gray-100 px-1 rounded">
                  {fieldName}
                </code>
              </div>
              <Badge className={cn('text-xs', config.color)} variant="secondary">
                {config.label}
              </Badge>
            </div>
            {prop.description && (
              <p className="mt-1 text-xs text-gray-500">{prop.description}</p>
            )}
            {prop.enum && prop.enum.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {prop.enum.map((option) => (
                  <span
                    key={option}
                    className="text-xs px-1.5 py-0.5 bg-gray-50 border border-gray-200 rounded"
                  >
                    {option}
                  </span>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function WorkflowDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { getById, remove } = useWorkflows();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const workflow = getById(id);

  if (!workflow) {
    return (
      <div>
        <PageHeader title="Workflow" />
        <div className="space-y-4">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  const handleDelete = () => {
    remove(id);
    router.push('/workflows');
  };

  return (
    <div>
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href="/workflows">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Workflows
          </Link>
        </Button>
      </div>

      <PageHeader
        title={workflow.name}
        description={`${workflow.steps.length} step${workflow.steps.length !== 1 ? 's' : ''}`}
        actions={
          <Button
            variant="outline"
            className="text-red-600 hover:text-red-700"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        }
      />

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Created</dt>
                <dd className="mt-1 text-sm">{formatDate(workflow.created_at)}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Updated</dt>
                <dd className="mt-1 text-sm">{formatDate(workflow.updated_at)}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Steps</CardTitle>
            <CardDescription>
              The steps in this workflow, in order of execution
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {workflow.steps
                .sort((a, b) => a.order_index - b.order_index)
                .map((step, index) => (
                  <div
                    key={step.id}
                    className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{step.name}</p>
                        <p className="text-sm text-gray-500">
                          Form: {step.form.name}
                        </p>
                      </div>
                    </div>
                    <div className="ml-11">
                      <p className="text-sm font-medium text-gray-500 mb-2">
                        Form Fields:
                      </p>
                      <FormSchemaDisplay schema={step.form.schema} />
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Workflow</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{workflow.name}&quot;? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
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
