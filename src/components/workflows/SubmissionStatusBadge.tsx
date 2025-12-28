"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";
import type { SubmissionStatus } from "@/types";

const STATUS_CONFIG: Record<
  SubmissionStatus,
  { label: string; className: string; dotColor: string }
> = {
  submitted: {
    label: "Submitted",
    className: "bg-blue-100 text-blue-800 border-blue-200",
    dotColor: "bg-blue-500",
  },
  pending: {
    label: "Pending",
    className: "bg-yellow-100 text-yellow-800 border-yellow-200",
    dotColor: "bg-yellow-500",
  },
  approved: {
    label: "Approved",
    className: "bg-emerald-100 text-emerald-800 border-emerald-200",
    dotColor: "bg-emerald-500",
  },
  rejected: {
    label: "Rejected",
    className: "bg-red-100 text-red-800 border-red-200",
    dotColor: "bg-red-500",
  },
};

interface SubmissionStatusBadgeProps {
  status: SubmissionStatus;
  showDot?: boolean;
  className?: string;
}

export function SubmissionStatusBadge({
  status,
  showDot = true,
  className,
}: SubmissionStatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <Badge
      variant="outline"
      className={cn("gap-1.5 font-medium", config.className, className)}
    >
      {showDot && (
        <span className={cn("h-1.5 w-1.5 rounded-full", config.dotColor)} />
      )}
      {config.label}
    </Badge>
  );
}

export function SubmissionStatusDot({
  status,
  className,
}: {
  status: SubmissionStatus;
  className?: string;
}) {
  const config = STATUS_CONFIG[status];
  return (
    <span
      className={cn(
        "inline-block h-2 w-2 rounded-full",
        config.dotColor,
        className,
      )}
      title={config.label}
    />
  );
}
