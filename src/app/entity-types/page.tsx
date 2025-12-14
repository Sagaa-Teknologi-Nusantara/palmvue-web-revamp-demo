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
import { EntityTypeTable } from '@/components/entity-types';
import { useEntityTypes } from '@/hooks';
import { Plus } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function EntityTypesPage() {
  const { entityTypes, isLoaded, remove } = useEntityTypes();
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
        <PageHeader title="Entity Types" description="Manage entity type definitions" />
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
        title="Entity Types"
        description="Manage entity type definitions"
        actions={
          <Button asChild>
            <Link href="/entity-types/create">
              <Plus className="mr-2 h-4 w-4" />
              Create Entity Type
            </Link>
          </Button>
        }
      />

      <EntityTypeTable entityTypes={entityTypes} onDelete={setDeleteId} />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Entity Type</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this entity type? This action cannot be
              undone and may affect existing entities.
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
