'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/layout';
import { EntityTypeForm } from '@/components/entity-types';
import { useEntityTypes } from '@/hooks';

export default function CreateEntityTypePage() {
  const router = useRouter();
  const { create } = useEntityTypes();

  const handleSubmit = (data: Parameters<typeof create>[0]) => {
    create(data);
    router.push('/entity-types');
  };

  return (
    <div>
      <PageHeader
        title="Create Entity Type"
        description="Define a new entity type with its metadata schema"
      />

      <Card>
        <CardHeader>
          <CardTitle>Entity Type Details</CardTitle>
        </CardHeader>
        <CardContent>
          <EntityTypeForm
            onSubmit={handleSubmit}
            onCancel={() => router.push('/entity-types')}
          />
        </CardContent>
      </Card>
    </div>
  );
}
