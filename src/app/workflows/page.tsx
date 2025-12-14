'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
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
import { WorkflowTable } from '@/components/workflows';
import { useWorkflows } from '@/hooks';
import { Plus } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function WorkflowsPage() {
  const { workflows, isLoaded, remove } = useWorkflows();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = () => {
    if (deleteId) {
      remove(deleteId);
      setDeleteId(null);
    }
  };

  if (!isLoaded) {
    return (
      <div>
        <PageHeader title="Workflows" description="Manage workflow definitions" />
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Workflows"
        description="Manage workflow definitions"
        actions={
          <Button asChild>
            <Link href="/workflows/create">
              <Plus className="mr-2 h-4 w-4" />
              Create Workflow
            </Link>
          </Button>
        }
      />

      <WorkflowTable workflows={workflows} onDelete={setDeleteId} />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Workflow</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this workflow? This action cannot be
              undone.
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
