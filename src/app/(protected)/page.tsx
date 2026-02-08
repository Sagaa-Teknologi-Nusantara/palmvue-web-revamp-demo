"use client";

import { AlertCircle, Boxes, GitBranch, RefreshCw } from "lucide-react";

import {
  KPICard,
  PendingApprovalsList,
  RecentEntitiesList,
  RecentSubmissionsList,
} from "@/components/dashboard";
import { PageHeader } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardCountsQuery } from "@/hooks/queries/useDashboardCountsQuery";
import { useEntitiesQuery } from "@/hooks/queries/useEntitiesQuery";
import { useFormSubmissionsQuery } from "@/hooks/queries/useFormSubmissionsQuery";
import { useWorkflowRecordsQuery } from "@/hooks/queries/useWorkflowRecordsQuery";

function WidgetError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-8 text-center">
        <AlertCircle className="h-6 w-6 text-destructive mb-2" />
        <p className="text-sm text-destructive font-medium">{message}</p>
        <Button variant="outline" size="sm" onClick={onRetry} className="mt-3">
          <RefreshCw className="h-3 w-3 mr-1" />
          Retry
        </Button>
      </CardContent>
    </Card>
  );
}

function KPISkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <Skeleton className="h-4 w-24 mb-3" />
        <Skeleton className="h-8 w-16 mb-2" />
        <Skeleton className="h-3 w-20" />
      </CardContent>
    </Card>
  );
}

function ListSkeleton() {
  return (
    <Card>
      <CardContent className="p-6 space-y-3">
        <Skeleton className="h-5 w-32 mb-4" />
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const {
    workflowsCount,
    entitiesCount,
    entityTypesCount,
    isLoading: countsLoading,
    isError: countsError,
    refetch: refetchCounts,
  } = useDashboardCountsQuery();

  const { entities, isLoading: entitiesLoading, isError: entitiesError, refetch: refetchEntities } =
    useEntitiesQuery({ sort_by: "created_at", sort_order: "desc", size: 5 });
  const { records, isLoading: recordsLoading, isError: recordsError, refetch: refetchRecords } =
    useWorkflowRecordsQuery(5, "pending_approval");
  const { submissions, isLoading: submissionsLoading, isError: submissionsError, refetch: refetchSubmissions } =
    useFormSubmissionsQuery(5);

  return (
    <div className="animate-in fade-in-50 space-y-8 duration-500">
      <PageHeader
        title="Dashboard"
        description="Overview of your PalmVue data"
      />

      <div className="grid gap-6 md:grid-cols-3">
        {countsLoading ? (
          <>
            <KPISkeleton />
            <KPISkeleton />
            <KPISkeleton />
          </>
        ) : countsError ? (
          <>
            <WidgetError message="Failed to load counts" onRetry={refetchCounts} />
            <WidgetError message="Failed to load counts" onRetry={refetchCounts} />
            <WidgetError message="Failed to load counts" onRetry={refetchCounts} />
          </>
        ) : (
          <>
            <KPICard
              title="Entity Types"
              value={entityTypesCount}
              description="Defined schemas"
              icon={Boxes}
              href="/entity-types"
            />
            <KPICard
              title="Entities"
              value={entitiesCount}
              description="Active instances"
              icon={Boxes}
              href="/entities"
            />
            <KPICard
              title="Workflows"
              value={workflowsCount}
              description="Configured processes"
              icon={GitBranch}
              href="/workflows"
            />
          </>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {entitiesLoading ? (
          <ListSkeleton />
        ) : entitiesError ? (
          <WidgetError message="Failed to load entities" onRetry={() => refetchEntities()} />
        ) : (
          <RecentEntitiesList entities={entities.slice(0, 5)} />
        )}

        {recordsLoading ? (
          <ListSkeleton />
        ) : recordsError ? (
          <WidgetError message="Failed to load approvals" onRetry={() => refetchRecords()} />
        ) : (
          <PendingApprovalsList records={records} />
        )}
      </div>

      {submissionsLoading ? (
        <ListSkeleton />
      ) : submissionsError ? (
        <WidgetError message="Failed to load submissions" onRetry={() => refetchSubmissions()} />
      ) : (
        <RecentSubmissionsList submissions={submissions} />
      )}
    </div>
  );
}
