'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/layout';
import { useEntityTypes, useEntities, useWorkflows, useWorkflowRecords } from '@/hooks';
import { Skeleton } from '@/components/ui/skeleton';
import { Boxes, Box, GitBranch, Plus, ArrowRight, CheckCircle2, Clock, CircleDot } from 'lucide-react';
import { formatDate } from '@/lib/code-generator';
import { STATUS_COLORS } from '@/lib/constants';

export default function DashboardPage() {
  const { entityTypes, isLoaded: typesLoaded } = useEntityTypes();
  const { entities, isLoaded: entitiesLoaded } = useEntities();
  const { workflows, isLoaded: workflowsLoaded } = useWorkflows();
  const { workflowRecords, isLoaded: recordsLoaded } = useWorkflowRecords();

  const isLoaded = typesLoaded && entitiesLoaded && workflowsLoaded && recordsLoaded;

  const recentEntities = [...entities]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  const workflowStats = {
    not_started: workflowRecords.filter((r) => r.status === 'not_started').length,
    in_progress: workflowRecords.filter((r) => r.status === 'in_progress').length,
    completed: workflowRecords.filter((r) => r.status === 'completed').length,
  };

  if (!isLoaded) {
    return (
      <div>
        <PageHeader title="Dashboard" description="Overview of your data" />
        <div className="grid gap-6 md:grid-cols-3">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Overview of your PalmVue demo data"
      />

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Entity Types
            </CardTitle>
            <Boxes className="h-5 w-5 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{entityTypes.length}</div>
            <Link
              href="/entity-types"
              className="text-sm text-primary hover:underline inline-flex items-center mt-2"
            >
              View all
              <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Entities
            </CardTitle>
            <Box className="h-5 w-5 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{entities.length}</div>
            <Link
              href="/entities"
              className="text-sm text-primary hover:underline inline-flex items-center mt-2"
            >
              View all
              <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Workflows
            </CardTitle>
            <GitBranch className="h-5 w-5 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{workflows.length}</div>
            <Link
              href="/workflows"
              className="text-sm text-primary hover:underline inline-flex items-center mt-2"
            >
              View all
              <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Entities */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Entities</CardTitle>
            <Button asChild variant="outline" size="sm">
              <Link href="/entities/create">
                <Plus className="mr-2 h-4 w-4" />
                Create
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentEntities.length > 0 ? (
              <div className="space-y-3">
                {recentEntities.map((entity) => (
                  <Link
                    key={entity.id}
                    href={`/entities/${entity.id}`}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div>
                      <p className="font-medium">{entity.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {entity.code}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {entity.entity_type.name}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">
                      {formatDate(entity.created_at)}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No entities yet</p>
                <Button asChild>
                  <Link href="/entities/create">Create your first entity</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Workflow Status */}
        <Card>
          <CardHeader>
            <CardTitle>Workflow Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-200 rounded-full">
                    <CircleDot className="h-4 w-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium">Not Started</p>
                    <p className="text-sm text-gray-500">Awaiting action</p>
                  </div>
                </div>
                <Badge className={STATUS_COLORS.not_started} variant="secondary">
                  {workflowStats.not_started}
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 rounded-full">
                    <Clock className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-medium">In Progress</p>
                    <p className="text-sm text-gray-500">Being worked on</p>
                  </div>
                </div>
                <Badge className={STATUS_COLORS.in_progress} variant="secondary">
                  {workflowStats.in_progress}
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-full">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Completed</p>
                    <p className="text-sm text-gray-500">All steps done</p>
                  </div>
                </div>
                <Badge className={STATUS_COLORS.completed} variant="secondary">
                  {workflowStats.completed}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/entity-types/create">
                <Plus className="mr-2 h-4 w-4" />
                New Entity Type
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/entities/create">
                <Plus className="mr-2 h-4 w-4" />
                New Entity
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/workflows/create">
                <Plus className="mr-2 h-4 w-4" />
                New Workflow
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
