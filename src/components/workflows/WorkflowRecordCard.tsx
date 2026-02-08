"use client";

import { Play, PlayCircle, Repeat, Zap } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/date";
import type { EntityWorkflowDetail, EntityWorkflowStep } from "@/types";

import { StatusBadge } from "./StatusBadge";
import { WorkflowPipeline } from "./WorkflowPipeline";

interface WorkflowRecordCardProps {
  workflowDetail: EntityWorkflowDetail;
  onStart?: (recordId: string) => void;
  isStarting?: boolean;
  onStepClick?: (step: EntityWorkflowStep, hasSubmissions: boolean) => void;
}

export function WorkflowRecordCard({
  workflowDetail,
  onStart,
  isStarting,
  onStepClick,
}: WorkflowRecordCardProps) {
  const canStart =
    workflowDetail.status === "not_started" && onStart !== undefined;

  return (
    <Card className="gap-0 overflow-hidden p-0">
      <div className="border-b bg-gray-50/40 p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 text-primary mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border shadow-sm">
              <PlayCircle className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <CardTitle className="text-base leading-none font-semibold">
                  {workflowDetail.workflow.name}
                </CardTitle>
                {workflowDetail.workflow.is_loopable && (
                  <Badge
                    variant="outline"
                    className="text-muted-foreground gap-1 px-1.5 py-0 text-[10px] font-normal"
                  >
                    <Repeat className="h-2.5 w-2.5" />
                    Loopable
                  </Badge>
                )}
                {workflowDetail.workflow.is_auto_start && (
                  <Badge
                    variant="secondary"
                    className="text-muted-foreground gap-1 px-1.5 py-0 text-[10px] font-normal"
                  >
                    <Zap className="h-2.5 w-2.5" />
                    Auto Start
                  </Badge>
                )}
              </div>
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
                        <span>{formatDate(workflowDetail.completed_at)}</span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {canStart ? (
              <Button
                size="sm"
                onClick={() => onStart(workflowDetail.id)}
                disabled={isStarting}
                className="opacity-85"
              >
                <Play className="mr-1.5 h-3.5 w-3.5" />
                {isStarting ? "Starting..." : "Start Workflow"}
              </Button>
            ) : (
              <StatusBadge status={workflowDetail.status} />
            )}
          </div>
        </div>
      </div>
      <div className="p-0">
        <WorkflowPipeline
          workflowDetail={workflowDetail}
          onStepClick={onStepClick}
        />
      </div>
    </Card>
  );
}
