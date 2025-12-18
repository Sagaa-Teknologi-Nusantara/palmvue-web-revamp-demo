"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  Activity,
  ListCheck,
  GitBranch,
  Boxes,
} from "lucide-react";
import type { Workflow } from "@/types";
import { formatDate } from "@/lib/code-generator";

interface WorkflowCardProps {
  workflow: Workflow;
  assignedCount: number;
  activeCount: number;
}

export function WorkflowCard({
  workflow,
  assignedCount,
  activeCount,
}: WorkflowCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card
      className={cn(
        "group relative flex flex-col gap-0 overflow-hidden p-0 transition-all duration-200 hover:shadow-lg",
        isExpanded ? "h-auto" : "h-full",
      )}
    >
      <Link href={`/workflows/${workflow.id}`} className="flex flex-1 flex-col">
        <div className="flex flex-col gap-5 p-6 pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 text-primary border-primary/20 flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border shadow-sm">
                <GitBranch className="h-6 w-6" />
              </div>
              <div>
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-muted-foreground/80 text-xs font-semibold tracking-wider uppercase">
                    Workflow
                  </span>
                </div>
                <h3 className="text-foreground group-hover:text-primary line-clamp-1 text-lg font-bold transition-colors">
                  {workflow.name}
                </h3>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground h-8 w-8 p-0"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-muted/40 border-border/50 flex flex-col items-center justify-center rounded-lg border p-3">
              <div className="text-muted-foreground mb-1 flex items-center gap-1.5">
                <ListCheck className="h-3.5 w-3.5" />
                <span className="text-xs font-medium uppercase">Steps</span>
              </div>
              <span className="text-foreground text-lg font-bold">
                {workflow.steps.length}
              </span>
            </div>

            <div className="bg-muted/40 border-border/50 flex flex-col items-center justify-center rounded-lg border p-3">
              <div className="text-muted-foreground mb-1 flex items-center gap-1.5">
                <Boxes className="h-3.5 w-3.5" />
                <span className="text-xs font-medium uppercase">Assigned</span>
              </div>
              <span className="text-foreground text-lg font-bold">
                {assignedCount}
              </span>
            </div>

            <div
              className={cn(
                "flex flex-col items-center justify-center rounded-lg border p-3",
                activeCount > 0
                  ? "border-amber-200 bg-amber-50"
                  : "bg-muted/40 border-border/50 opacity-60",
              )}
            >
              <div
                className={cn(
                  "mb-1 flex items-center gap-1.5",
                  activeCount > 0 ? "text-amber-700" : "text-muted-foreground",
                )}
              >
                <Activity className="h-3.5 w-3.5" />
                <span className="text-xs font-medium uppercase">Active</span>
              </div>
              <span
                className={cn(
                  "text-lg font-bold",
                  activeCount > 0 ? "text-amber-700" : "text-foreground",
                )}
              >
                {activeCount}
              </span>
            </div>
          </div>
        </div>
      </Link>

      {isExpanded && (
        <div className="animate-in fade-in slide-in-from-top-2 border-border/50 bg-muted/10 border-t px-6 py-4">
          <h4 className="text-muted-foreground mb-3 text-xs font-semibold tracking-wider uppercase">
            Steps Preview
          </h4>
          <div className="relative space-y-0 pl-2">
            <div className="bg-border/60 absolute top-2 left-[0.95rem] h-[calc(100%-16px)] w-0.5" />
            {workflow.steps
              .sort((a, b) => a.order_index - b.order_index)
              .map((step, index) => (
                <div
                  key={step.id}
                  className="relative flex items-center gap-3 py-2"
                >
                  <div className="bg-background ring-primary/20 relative z-10 flex h-4 w-4 shrink-0 items-center justify-center rounded-full ring-2">
                    <div className="bg-primary h-1.5 w-1.5 rounded-full" />
                  </div>
                  <div className="flex min-w-0 flex-1 items-center justify-between gap-4">
                    <span className="text-foreground/80 truncate text-sm font-medium">
                      {step.name}
                    </span>
                    <span className="text-muted-foreground/60 font-mono text-[10px]">
                      #{String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      <div className="border-border bg-primary-light/40 mt-auto border-t px-6 py-3">
        <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
          <Calendar className="h-3.5 w-3.5 opacity-70" />
          <span>Updated {formatDate(workflow.updated_at)}</span>
        </div>
      </div>
    </Card>
  );
}
