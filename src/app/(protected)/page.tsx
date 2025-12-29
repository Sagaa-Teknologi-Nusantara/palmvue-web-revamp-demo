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

import { PageHeader, UnderDevelopment } from "@/components/layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const entityTypes = [
  { id: "1", name: "Company" },
  { id: "2", name: "Project" },
  { id: "3", name: "Task" },
];

const entities = [
  {
    id: "1",
    name: "Acme Corporation",
    code: "ACME-001",
    entity_type: { name: "Company" },
    created_at: "2025-12-20T10:00:00Z",
  },
  {
    id: "2",
    name: "Website Redesign",
    code: "PROJ-001",
    entity_type: { name: "Project" },
    created_at: "2025-12-22T14:30:00Z",
  },
  {
    id: "3",
    name: "Initial Setup",
    code: "TASK-001",
    entity_type: { name: "Task" },
    created_at: "2025-12-25T09:00:00Z",
  },
];

const workflows = [
  { id: "1", name: "Onboarding" },
  { id: "2", name: "Approval Process" },
];

const workflowStats = {
  not_started: 3,
  in_progress: 5,
  completed: 12,
};

const isUnderDevelopment = true;

export default function DashboardPage() {
  if (isUnderDevelopment) {
    return <UnderDevelopment />;
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
            <div className="space-y-3">
              {entities.map((entity) => (
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
                </Link>
              ))}
            </div>
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
