"use client";

import {
  ArrowRight,
  Box,
  Boxes,
  CheckCircle2,
  CircleDot,
  Clock,
  GitBranch,
  Plus,
} from "lucide-react";
import Link from "next/link";

import { PageHeader } from "@/components/layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useEntities,
  useEntityTypes,
  useWorkflowRecords,
  useWorkflows,
} from "@/hooks";
import { formatDate } from "@/lib/date";

export default function DashboardPage() {
  const { entityTypes, isLoaded: typesLoaded } = useEntityTypes();
  const { entities, isLoaded: entitiesLoaded } = useEntities();
  const { workflows, isLoaded: workflowsLoaded } = useWorkflows();
  const { workflowRecords, isLoaded: recordsLoaded } = useWorkflowRecords();

  const isLoaded =
    typesLoaded && entitiesLoaded && workflowsLoaded && recordsLoaded;

  const recentEntities = [...entities]
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )
    .slice(0, 5);

  const workflowStats = {
    not_started: workflowRecords.filter((r) => r.status === "not_started")
      .length,
    in_progress: workflowRecords.filter((r) => r.status === "in_progress")
      .length,
    completed: workflowRecords.filter((r) => r.status === "completed").length,
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
      <div className="mb-8 grid gap-6 md:grid-cols-3">
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
              className="text-primary mt-2 inline-flex items-center text-sm hover:underline"
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
              className="text-primary mt-2 inline-flex items-center text-sm hover:underline"
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
              className="text-primary mt-2 inline-flex items-center text-sm hover:underline"
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
                    className="flex items-center justify-between rounded-lg bg-gray-50 p-3 transition-colors hover:bg-gray-100"
                  >
                    <div>
                      <p className="font-medium">{entity.name}</p>
                      <div className="mt-1 flex items-center gap-2">
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
              <div className="py-8 text-center">
                <p className="mb-4 text-gray-500">No entities yet</p>
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
              <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-gray-200 p-2">
                    <CircleDot className="h-4 w-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium">Not Started</p>
                    <p className="text-sm text-gray-500">Awaiting action</p>
                  </div>
                </div>
                <Badge
                  className="bg-gray-100 text-gray-800"
                  variant="secondary"
                >
                  {workflowStats.not_started}
                </Badge>
              </div>

              <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-yellow-100 p-2">
                    <Clock className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-medium">In Progress</p>
                    <p className="text-sm text-gray-500">Being worked on</p>
                  </div>
                </div>
                <Badge
                  className="bg-yellow-100 text-yellow-800"
                  variant="secondary"
                >
                  {workflowStats.in_progress}
                </Badge>
              </div>

              <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-green-100 p-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Completed</p>
                    <p className="text-sm text-gray-500">All steps done</p>
                  </div>
                </div>
                <Badge
                  className="bg-green-100 text-green-800"
                  variant="secondary"
                >
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
