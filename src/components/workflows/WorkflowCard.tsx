"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, GitFork, ChevronDown, ChevronUp } from "lucide-react";
import type { Workflow } from "@/types";
import { formatDate } from "@/lib/code-generator";
import { Badge } from "../ui/badge";

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
        "group relative flex h-full flex-col gap-0 overflow-hidden p-0 transition-all duration-200 hover:shadow-lg",
        isExpanded && "row-span-2",
      )}
    >
      <div className="flex min-h-0 flex-1 flex-col gap-3 px-6 pt-6 pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary-light text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
              <GitFork className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-foreground line-clamp-1 font-semibold">
                {workflow.name}
              </h3>
              <div className="text-muted-foreground flex items-center gap-3 text-xs">
                <span className="font-medium">
                  {workflow.steps.length} Steps
                </span>
                <span className="bg-border h-1 w-1 rounded-full" />
                <span>{assignedCount} Assigned</span>
                {activeCount > 0 && (
                  <>
                    <span className="bg-border h-1 w-1 rounded-full" />
                    <span className="font-medium text-amber-600">
                      {activeCount} Active
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-gray-400 hover:text-gray-900"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {isExpanded && (
          <div className="animate-in fade-in slide-in-from-top-2 flex min-h-0 flex-1 flex-col overflow-hidden duration-200">
            <div className="bg-muted/10 flex h-full flex-col rounded-lg p-3">
              <h4 className="text-muted-foreground mb-3 shrink-0 text-xs font-semibold tracking-wider uppercase">
                Workflow Steps
              </h4>
              <div className="custom-scrollbar flex-1 overflow-y-auto pr-2 pl-0.5">
                <div className="relative space-y-0">
                  <div className="bg-border absolute top-2 left-[0.57rem] h-[calc(100%-16px)] w-0.5" />

                  {workflow.steps
                    .sort((a, b) => a.order_index - b.order_index)
                    .map((step, index) => (
                      <div
                        key={step.id}
                        className="relative flex items-center gap-3 py-1.5"
                      >
                        <div className="bg-background ring-primary/20 relative z-10 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ring-2">
                          <div className="bg-primary h-1.5 w-1.5 rounded-full" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-foreground/80 truncate text-sm font-medium">
                            {step.name}
                          </p>
                        </div>
                        <Badge
                          variant="secondary"
                          className="text-muted-foreground text-[10px]"
                        >
                          Step {index + 1}
                        </Badge>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="border-border bg-primary-light/40 text-muted-foreground flex items-center justify-between border-t px-6 py-4 text-xs">
        <div className="flex items-center gap-1.5">
          <Calendar className="text-muted-foreground/70 h-3.5 w-3.5" />
          <span>Updated {formatDate(workflow.updated_at)}</span>
        </div>
      </div>
    </Card>
  );
}
