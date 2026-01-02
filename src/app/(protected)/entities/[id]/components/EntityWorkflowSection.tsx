"use client";

import { Play, PlayCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/workflows/StatusBadge";
import { useStartWorkflowRecordMutation } from "@/hooks/queries";
import { formatDate } from "@/lib/date";
import type { EntityWorkflowDetail } from "@/types/workflow-record";

import { WorkflowPipeline } from "./WorkflowPipeline";

interface EntityWorkflowSectionProps {
  workflows: EntityWorkflowDetail[];
  isLoading: boolean;
}

export function EntityWorkflowSection({
  workflows,
  isLoading,
}: EntityWorkflowSectionProps) {
  const startMutation = useStartWorkflowRecordMutation();

  const handleStart = (recordId: string) => {
    startMutation.mutate(recordId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            Workflow Progress
          </h2>
          <p className="text-muted-foreground text-sm">
            Track status and view details for assigned workflows
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-6">
          <Skeleton className="h-48 w-full" />
        </div>
      ) : workflows.length > 0 ? (
        <div className="grid gap-6">
          {workflows.map((workflowDetail) => (
            <Card key={workflowDetail.id} className="gap-0 overflow-hidden p-0">
              <div className="border-b bg-gray-50/40 p-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 text-primary mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border shadow-sm">
                      <PlayCircle className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <CardTitle className="text-base leading-none font-semibold">
                        {workflowDetail.workflow.name}
                      </CardTitle>
                      <div className="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                        {workflowDetail.status === "not_started" ? (
                          <div className="flex items-center gap-1.5">
                            <span className="font-medium">Not Started</span>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center gap-1.5">
                              <span className="font-medium">Started:</span>
                              <span>
                                {formatDate(
                                  workflowDetail.started_at ||
                                    workflowDetail.created_at,
                                )}
                              </span>
                            </div>
                            {workflowDetail.completed_at && (
                              <div className="flex items-center gap-1.5">
                                <span className="font-medium">Completed:</span>
                                <span>
                                  {formatDate(workflowDetail.completed_at)}
                                </span>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {workflowDetail.status === "not_started" ? (
                      <Button
                        size="sm"
                        onClick={() => handleStart(workflowDetail.id)}
                        disabled={startMutation.isPending}
                        className="opacity-85"
                      >
                        <Play className="mr-1.5 h-3.5 w-3.5" />
                        {startMutation.isPending &&
                        startMutation.variables === workflowDetail.id
                          ? "Starting..."
                          : "Start Workflow"}
                      </Button>
                    ) : (
                      <StatusBadge status={workflowDetail.status} />
                    )}
                  </div>
                </div>
              </div>
              <div className="p-0">
                <WorkflowPipeline workflowDetail={workflowDetail} />
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-dashed shadow-none">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="bg-muted/50 mb-4 flex h-16 w-16 items-center justify-center rounded-full">
              <PlayCircle className="text-muted-foreground h-8 w-8 opacity-50" />
            </div>
            <h3 className="text-lg font-medium">No workflows found</h3>
            <p className="text-muted-foreground mt-2 max-w-sm text-sm">
              Assign workflows to this entity&apos;s type to automatically start
              tracking progress here.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
