'use client';

import { useState, useMemo } from 'react';
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
import { EntityTable, EntityFilters } from '@/components/entities';
import { useEntities, useEntityTypes } from '@/hooks';
import { Plus } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function EntitiesPage() {
  const { entities, isLoaded, remove } = useEntities();
  const { entityTypes } = useEntityTypes();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedParent, setSelectedParent] = useState('all');

  const filteredEntities = useMemo(() => {
    return entities.filter((entity) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (
          !entity.name.toLowerCase().includes(query) &&
          !entity.code.toLowerCase().includes(query)
        ) {
          return false;
        }
      }

      // Type filter
      if (selectedType !== 'all' && entity.entity_type_id !== selectedType) {
        return false;
      }

      // Parent filter
      if (selectedParent === 'none' && entity.parent_id !== null) {
        return false;
      }
      if (
        selectedParent !== 'all' &&
        selectedParent !== 'none' &&
        entity.parent_id !== selectedParent
      ) {
        return false;
      }

      return true;
    });
  }, [entities, searchQuery, selectedType, selectedParent]);

  const handleDelete = () => {
    if (deleteId) {
      remove(deleteId);
      setDeleteId(null);
    }
  };

  if (!isLoaded) {
    return (
      <div>
        <PageHeader title="Entities" description="Manage entity instances" />
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
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
        title="Entities"
        description="Manage entity instances"
        actions={
          <Button asChild>
            <Link href="/entities/create">
              <Plus className="mr-2 h-4 w-4" />
              Create Entity
            </Link>
          </Button>
        }
      />

      <EntityFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        selectedParent={selectedParent}
        onParentChange={setSelectedParent}
        entityTypes={entityTypes}
        entities={entities}
      />

      <EntityTable entities={filteredEntities} onDelete={setDeleteId} />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Entity</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this entity? This will also delete
              associated workflow records.
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
