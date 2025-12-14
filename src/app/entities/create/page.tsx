'use client';

import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/layout';
import { EntityForm } from '@/components/entities';
import { useEntities, useEntityTypes } from '@/hooks';
import { Skeleton } from '@/components/ui/skeleton';

export default function CreateEntityPage() {
  const router = useRouter();
  const { entities, create, isLoaded: entitiesLoaded } = useEntities();
  const { entityTypes, isLoaded: typesLoaded } = useEntityTypes();

  const handleSubmit = (data: Parameters<typeof create>[0]) => {
    create(data);
    router.push('/entities');
  };

  if (!entitiesLoaded || !typesLoaded) {
    return (
      <div>
        <PageHeader title="Create Entity" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Create Entity"
        description="Create a new entity instance"
      />

      <EntityForm
        entityTypes={entityTypes}
        entities={entities}
        onSubmit={handleSubmit}
        onCancel={() => router.push('/entities')}
      />
    </div>
  );
}
