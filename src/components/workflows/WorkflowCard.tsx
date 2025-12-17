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
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <GitFork className="h-5 w-5" />
            </div>
            <div>
              <h3 className="line-clamp-1 font-semibold text-gray-900">
                {workflow.name}
              </h3>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span className="font-medium">
                  {workflow.steps.length} Steps
                </span>
                <span className="h-1 w-1 rounded-full bg-gray-300" />
                <span>{assignedCount} Assigned</span>
                {activeCount > 0 && (
                  <>
                    <span className="h-1 w-1 rounded-full bg-gray-300" />
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
            <div className="flex h-full flex-col rounded-lg bg-gray-50 p-3">
              <h4 className="mb-3 shrink-0 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                Workflow Steps
              </h4>
              <div className="custom-scrollbar flex-1 overflow-y-auto pr-2 pl-0.5">
                <div className="relative space-y-0">
                  <div className="absolute top-2 left-[0.57rem] h-[calc(100%-16px)] w-0.5 bg-gray-200" />

                  {workflow.steps
                    .sort((a, b) => a.order_index - b.order_index)
                    .map((step, index) => (
                      <div
                        key={step.id}
                        className="relative flex items-center gap-3 py-1.5"
                      >
                        <div className="relative z-10 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white ring-2 ring-indigo-100">
                          <div className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-gray-700">
                            {step.name}
                          </p>
                        </div>
                        <Badge
                          variant="secondary"
                          className="text-[10px] text-gray-500"
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
      <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50/70 px-6 py-4 text-xs text-gray-600">
        <div className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5 text-gray-400" />
          <span>Updated {formatDate(workflow.updated_at)}</span>
        </div>
      </div>
    </Card>
  );
}
