import { Badge } from "@/components/ui/badge";
import { Circle, Loader2, CheckCircle2 } from "lucide-react";
import type { WorkflowRecordStatus } from "@/types/workflow-record";
import { cn } from "@/lib/cn";

interface StatusBadgeProps {
  status: WorkflowRecordStatus;
  className?: string;
}

const statusConfig: Record<
  WorkflowRecordStatus,
  {
    label: string;
    variant: "secondary" | "warning" | "success";
    Icon: typeof Circle;
    borderClass: string;
  }
> = {
  not_started: {
    label: "Not Started",
    variant: "secondary",
    Icon: Circle,
    borderClass: "border-secondary-foreground/20",
  },
  in_progress: {
    label: "In Progress",
    variant: "warning",
    Icon: Loader2,
    borderClass: "border-yellow-800/20",
  },
  completed: {
    label: "Completed",
    variant: "success",
    Icon: CheckCircle2,
    borderClass: "border-green-800/20",
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
      {config.label}
    </Badge>
  );
}
