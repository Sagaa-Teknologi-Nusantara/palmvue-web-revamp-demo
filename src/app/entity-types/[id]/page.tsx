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
import { useEntityTypes, useWorkflows } from '@/hooks';
import { ArrowLeft, Trash2, Plus, X } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/lib/code-generator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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

function MetadataSchemaDisplay({ schema }: { schema: JSONSchema }) {
  if (!schema.properties || Object.keys(schema.properties).length === 0) {
    return (
      <p className="text-sm text-gray-500">No metadata fields defined for this entity type.</p>
    );
  }

  const requiredFields = schema.required || [];

  return (
    <div className="space-y-3">
      {Object.entries(schema.properties).map(([fieldName, prop]) => {
        const fieldType = getFieldType(prop);
        const config = FIELD_TYPE_CONFIG[fieldType] || FIELD_TYPE_CONFIG.string;
        const isRequired = requiredFields.includes(fieldName);

        return (
          <div
            key={fieldName}
            className="p-4 bg-gray-50 rounded-lg border border-gray-100"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{prop.title || fieldName}</span>
                  {isRequired && (
                    <span className="text-red-500 text-sm">*</span>
                  )}
                </div>
                <code className="text-xs text-gray-500 bg-gray-200 px-1.5 py-0.5 rounded">
                  {fieldName}
                </code>
              </div>
              <Badge className={cn('text-xs', config.color)} variant="secondary">
                {config.label}
              </Badge>
            </div>
            {prop.description && (
              <p className="mt-2 text-sm text-gray-600">{prop.description}</p>
            )}
            {prop.enum && prop.enum.length > 0 && (
              <div className="mt-3">
                <p className="text-xs font-medium text-gray-500 mb-1.5">Options:</p>
                <div className="flex flex-wrap gap-1.5">
                  {prop.enum.map((option) => (
                    <span
                      key={option}
                      className="text-xs px-2 py-1 bg-white border border-gray-200 rounded"
                    >
                      {option}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function EntityTypeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { getById, remove, getAssignedWorkflows, assignWorkflow, unassignWorkflow, getAssignedWorkflowIds } = useEntityTypes();
  const { workflows } = useWorkflows();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<string>('');

  const entityType = getById(id);
  const assignedWorkflows = getAssignedWorkflows(id);
  const assignedWorkflowIds = getAssignedWorkflowIds(id);
  const availableWorkflows = workflows.filter(w => !assignedWorkflowIds.includes(w.id));

  if (!entityType) {
    return (
      <div>
        <PageHeader title="Entity Type" />
        <div className="space-y-4">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  const handleDelete = () => {
    remove(id);
    router.push('/entity-types');
  };

  const handleAssignWorkflow = () => {
    if (selectedWorkflow) {
      assignWorkflow(id, selectedWorkflow);
      setSelectedWorkflow('');
    }
  };

  return (
    <div>
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href="/entity-types">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Entity Types
          </Link>
        </Button>
      </div>

      <PageHeader
        title={entityType.name}
        description={entityType.description}
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="text-red-600 hover:text-red-700"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
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
                <dt className="text-sm font-medium text-gray-500">Prefix</dt>
                <dd className="mt-1">
                  <Badge variant="secondary">{entityType.prefix}</Badge>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Created</dt>
                <dd className="mt-1 text-sm">{formatDate(entityType.created_at)}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Updated</dt>
                <dd className="mt-1 text-sm">{formatDate(entityType.updated_at)}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Metadata Fields</CardTitle>
            <CardDescription>
              Fields available for entities of this type
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MetadataSchemaDisplay schema={entityType.metadata_schema} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Assigned Workflows</CardTitle>
            <CardDescription>
              Workflows that will be automatically assigned to entities of this type
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {assignedWorkflows.length > 0 ? (
                <div className="space-y-2">
                  {assignedWorkflows.map((workflow) => (
                    <div
                      key={workflow.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{workflow.name}</p>
                        <p className="text-sm text-gray-500">
                          {workflow.steps.length} step{workflow.steps.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => unassignWorkflow(id, workflow.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No workflows assigned yet.</p>
              )}

              {availableWorkflows.length > 0 && (
                <div className="flex gap-2 pt-4 border-t">
                  <Select value={selectedWorkflow} onValueChange={setSelectedWorkflow}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select a workflow to assign" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableWorkflows.map((workflow) => (
                        <SelectItem key={workflow.id} value={workflow.id}>
                          {workflow.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={handleAssignWorkflow} disabled={!selectedWorkflow}>
                    <Plus className="mr-2 h-4 w-4" />
                    Assign
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Entity Type</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{entityType.name}&quot;? This action
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
