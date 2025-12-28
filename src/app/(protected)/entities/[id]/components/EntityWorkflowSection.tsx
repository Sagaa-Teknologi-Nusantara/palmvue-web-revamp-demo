import { PlayCircle } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/workflows/StatusBadge";
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
              <CardHeader className="bg-muted/30 border-b pt-6 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 text-primary flex h-9 w-9 items-center justify-center rounded-full">
                      <PlayCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-base">
                        {workflowDetail.workflow.name}
                      </CardTitle>
                      <CardDescription className="mt-0.5 flex items-center gap-2">
                        <span className="text-xs">
                          Started{" "}
                          {formatDate(
                            workflowDetail.started_at ||
                              workflowDetail.created_at,
                          )}
                        </span>
                        {workflowDetail.completed_at && (
                          <>
                            <span>•</span>
                            <span className="text-xs">
                              Completed{" "}
                              {formatDate(workflowDetail.completed_at)}
                            </span>
                          </>
                        )}
                      </CardDescription>
                    </div>
                  </div>
                  <StatusBadge status={workflowDetail.status} />
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <WorkflowPipeline workflowDetail={workflowDetail} />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-dashed">
          <CardContent className="text-muted-foreground flex flex-col items-center justify-center py-12 text-center">
            <div className="bg-muted mb-3 flex h-12 w-12 items-center justify-center rounded-full">
              <PlayCircle className="text-muted-foreground/50 h-6 w-6" />
            </div>
            <p className="font-medium">No workflow records found</p>
            <p className="mt-1 max-w-sm text-sm">
              Assign workflows to this entity&apos;s type to automatically
              create workflow records.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
