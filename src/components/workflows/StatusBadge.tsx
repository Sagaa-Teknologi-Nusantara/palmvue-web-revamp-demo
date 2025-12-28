import { CheckCircle2, Circle, Clock, Loader2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";
import { WORKFLOW_STATUS_LABELS } from "@/lib/status";
import type { WorkflowRecordStatus } from "@/types/workflow-record";

interface StatusBadgeProps {
  status: WorkflowRecordStatus;
  className?: string;
}

const statusConfig: Record<
  WorkflowRecordStatus,
  {
    variant: "secondary" | "warning" | "success" | "default";
    Icon: typeof Circle;
    borderClass: string;
  }
> = {
  not_started: {
    variant: "secondary",
    Icon: Circle,
    borderClass: "border-secondary-foreground/20",
  },
  in_progress: {
    variant: "warning",
    Icon: Loader2,
    borderClass: "border-yellow-800/20",
  },
  completed: {
    variant: "success",
    Icon: CheckCircle2,
    borderClass: "border-green-800/20",
  },
  pending_approval: {
    variant: "default",
    Icon: Clock,
    borderClass: "border-blue-800/20",
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.Icon;

  return (
    <Badge
      variant={config.variant}
      className={cn("rounded-md", config.borderClass, className)}
    >
      <Icon className="h-3 w-3" />
      {WORKFLOW_STATUS_LABELS[status]}
    </Badge>
  );
}
