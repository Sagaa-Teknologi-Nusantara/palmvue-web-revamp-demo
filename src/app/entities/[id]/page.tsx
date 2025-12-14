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
import { useEntities, useEntityTypes, useWorkflowRecords } from '@/hooks';
import { ArrowLeft, Trash2, ExternalLink } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/lib/code-generator';
import { STATUS_COLORS } from '@/lib/constants';
import { WorkflowProgress } from '@/components/workflows/WorkflowProgress';

export default function EntityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { getById, remove } = useEntities();
  const { getById: getEntityType } = useEntityTypes();
  const { getByEntityId } = useWorkflowRecords();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);

  const entity = getById(id);
  const entityType = entity ? getEntityType(entity.entity_type_id) : null;
  const workflowRecords = getByEntityId(id);

  if (!entity) {
    return (
      <div>
        <PageHeader title="Entity" />
        <div className="space-y-4">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  const handleDelete = () => {
    remove(id);
    router.push('/entities');
  };

  return (
    <div>
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href="/entities">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Entities
          </Link>
        </Button>
      </div>

      <PageHeader
        title={entity.name}
        description={`${entity.code} - ${entity.entity_type.name}`}
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
                <dt className="text-sm font-medium text-gray-500">Code</dt>
                <dd className="mt-1">
                  <Badge variant="outline">{entity.code}</Badge>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Entity Type</dt>
                <dd className="mt-1">
                  <Link
                    href={`/entity-types/${entity.entity_type_id}`}
                    className="text-primary hover:underline inline-flex items-center gap-1"
                  >
                    {entity.entity_type.name}
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Parent</dt>
                <dd className="mt-1 text-sm">
                  {entity.parent ? (
                    <Link
                      href={`/entities/${entity.parent_id}`}
                      className="text-primary hover:underline inline-flex items-center gap-1"
                    >
                      {entity.parent.code} - {entity.parent.name}
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  ) : (
                    <span className="text-gray-400">None</span>
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Created</dt>
                <dd className="mt-1 text-sm">{formatDate(entity.created_at)}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Metadata</CardTitle>
            <CardDescription>
              Custom data for this {entity.entity_type.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {Object.keys(entity.metadata).length > 0 ? (
              <dl className="grid grid-cols-2 gap-4">
                {Object.entries(entity.metadata).map(([key, value]) => {
                  const propSchema = entityType?.metadata_schema.properties[key];
                  const label = propSchema?.title || key;

                  return (
                    <div key={key}>
                      <dt className="text-sm font-medium text-gray-500">{label}</dt>
                      <dd className="mt-1 text-sm">
                        {typeof value === 'boolean'
                          ? value
                            ? 'Yes'
                            : 'No'
                          : String(value)}
                      </dd>
                    </div>
                  );
                })}
              </dl>
            ) : (
              <p className="text-sm text-gray-500">No metadata set.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Workflow Records</CardTitle>
            <CardDescription>
              Track progress through assigned workflows
            </CardDescription>
          </CardHeader>
          <CardContent>
            {workflowRecords.length > 0 ? (
              <div className="space-y-3">
                {workflowRecords.map((record) => (
                  <div
                    key={record.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => setSelectedRecordId(record.id)}
                  >
                    <div>
                      <p className="font-medium">{record.workflow.name}</p>
                      <p className="text-sm text-gray-500">
                        {record.current_step
                          ? `Current Step: ${record.current_step.name}`
                          : 'Completed'}
                      </p>
                    </div>
                    <Badge
                      className={STATUS_COLORS[record.status]}
                      variant="secondary"
                    >
                      {record.status.replace('_', ' ')}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                No workflow records. Assign workflows to the entity type to
                automatically create workflow records.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Entity</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{entity.name}&quot;? This will
              also delete all associated workflow records.
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

      {selectedRecordId && (
        <WorkflowProgress
          recordId={selectedRecordId}
          open={!!selectedRecordId}
          onClose={() => setSelectedRecordId(null)}
        />
      )}
    </div>
  );
}
