import { Calendar, Clock, PlayCircle, RefreshCw, Zap } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/date";
import type { WorkflowDetail } from "@/types";

interface WorkflowInfoCardProps {
  workflow: WorkflowDetail;
}

export function WorkflowInfoCard({ workflow }: WorkflowInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <span className="bg-primary/10 text-primary rounded-md p-1.5">
            <PlayCircle className="h-4 w-4" />
          </span>
          Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          <div className="space-y-1">
            <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
              <Calendar className="h-3.5 w-3.5" /> Created
            </p>
            <p className="text-sm font-medium">
              {formatDate(workflow.created_at)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
              <Clock className="h-3.5 w-3.5" /> Updated
            </p>
            <p className="text-sm font-medium">
              {formatDate(workflow.updated_at)}
            </p>
          </div>
        </div>
        <Separator />
        <div>
          <p className="text-muted-foreground mb-2 text-xs font-medium tracking-wider uppercase">
            Structure
          </p>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono">
              {workflow.steps.length} Steps
            </Badge>
            <Badge variant="outline" className="font-mono">
              Sequential
            </Badge>
          </div>
        </div>
        <Separator />
        <div>
          <p className="text-muted-foreground mb-2 text-xs font-medium tracking-wider uppercase">
            Behavior
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {workflow.is_auto_start && (
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400"
              >
                <Zap className="mr-1 h-3 w-3" />
                Auto Start
              </Badge>
            )}
            {workflow.is_loopable && (
              <Badge
                variant="secondary"
                className="bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400"
              >
                <RefreshCw className="mr-1 h-3 w-3" />
                Loopable
              </Badge>
            )}
            {!workflow.is_auto_start && !workflow.is_loopable && (
              <span className="text-muted-foreground text-xs">
                No special behavior
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
