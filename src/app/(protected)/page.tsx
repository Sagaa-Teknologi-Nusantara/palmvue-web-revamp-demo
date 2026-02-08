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
import { useDashboardCountsQuery } from "@/hooks/queries/useDashboardCountsQuery";
import { useEntitiesQuery } from "@/hooks/queries/useEntitiesQuery";
import { useFormSubmissionsQuery } from "@/hooks/queries/useFormSubmissionsQuery";
import { useWorkflowRecordsQuery } from "@/hooks/queries/useWorkflowRecordsQuery";

export default function DashboardPage() {
  const {
    workflowsCount,
    entitiesCount,
    entityTypesCount,
    isLoading: countsLoading,
    isError: countsError,
  } = useDashboardCountsQuery();

  const { entities, isLoading: entitiesLoading, isError: entitiesError, refetch: refetchEntities } = useEntitiesQuery();
  const { records, isLoading: recordsLoading, isError: recordsError, refetch: refetchRecords } = useWorkflowRecordsQuery(10);
  const { submissions, isLoading: submissionsLoading, isError: submissionsError, refetch: refetchSubmissions } =
    useFormSubmissionsQuery(10);

  const isLoading =
    countsLoading || entitiesLoading || recordsLoading || submissionsLoading;
  const isError = countsError || entitiesError || recordsError || submissionsError;

  const handleRetry = () => {
    refetchEntities();
    refetchRecords();
    refetchSubmissions();
  };



  return (
    <div className="animate-in fade-in-50 space-y-8 duration-500">
      <PageHeader
        title="Dashboard"
        description="Overview of your PalmVue data"

      />

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <AlertCircle className="h-8 w-8 text-destructive mb-3" />
          <p className="text-destructive font-medium">Failed to load dashboard data</p>
          <Button variant="outline" onClick={handleRetry} className="mt-4">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-3">
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
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <RecentEntitiesList entities={entities.slice(0, 5)} />
            <PendingApprovalsList records={records} />
          </div>

          <RecentSubmissionsList submissions={submissions} />
        </>
      )}
    </div>
  );
}
