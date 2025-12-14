'use client';

import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/layout';
import { WorkflowBuilder } from '@/components/workflows';
import { useWorkflows } from '@/hooks';

export default function CreateWorkflowPage() {
  const router = useRouter();
  const { create } = useWorkflows();

  const handleSubmit = (data: Parameters<typeof create>[0]) => {
    create(data);
    router.push('/workflows');
  };

  return (
    <div>
      <PageHeader
        title="Create Workflow"
        description="Build a workflow with multiple steps using drag and drop"
      />

      <WorkflowBuilder
        onSubmit={handleSubmit}
        onCancel={() => router.push('/workflows')}
      />
    </div>
  );
}
