"use client";

import {
  Activity,
  Calendar,
  ChevronDown,
  ChevronUp,
  GitBranch,
  ListCheck,
} from "lucide-react";
import { DynamicIcon } from "lucide-react/dynamic";
import Link from "next/link";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/cn";
import { getColorByLabel } from "@/lib/colors";
import { formatDate } from "@/lib/date";
import type { WorkflowListItem } from "@/types";

interface WorkflowCardProps {
  workflow: WorkflowListItem;
}

export function WorkflowCard({ workflow }: WorkflowCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const activeCount = workflow.active_record_count;
  const visibleEntityTypes = workflow.entity_types.slice(0, 3);
  const remainingCount = workflow.entity_types.length - 3;

  return (
    <Card
      className={cn(
        "group relative flex flex-col gap-0 overflow-hidden p-0 transition-all duration-200 hover:shadow-md",
        isExpanded ? "h-auto" : "h-auto",
      )}
    >
      <Link href={`/workflows/${workflow.id}`} className="block w-full">
        <div className="flex flex-col items-start gap-6 p-5 md:flex-row md:items-center">
          {/* Left: Icon & Title */}
          <div className="flex min-w-0 flex-1 items-center gap-4">
            <div className="bg-primary/10 text-primary border-primary/20 flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border shadow-sm">
              <GitBranch className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1 py-0.5">
              <div className="mb-1.5 flex flex-wrap items-center gap-2">
                <span className="text-muted-foreground/80 text-[10px] font-bold tracking-wider uppercase">
                  Workflow
                </span>
                <span className="text-muted-foreground/40 text-[10px]">•</span>
                <div className="text-muted-foreground flex items-center gap-1.5 text-[10px]">
                  <Calendar className="h-3 w-3 opacity-70" />
                  <span>Updated {formatDate(workflow.updated_at)}</span>
                </div>
              </div>
              <h3 className="text-foreground group-hover:text-primary mb-2 line-clamp-1 text-lg font-bold transition-colors">
                {workflow.name}
              </h3>

              {/* Entity Types Badges - moved here for better context */}
              <div className="flex flex-wrap gap-2">
                {workflow.entity_types.length > 0 ? (
                  <>
                    {visibleEntityTypes.map((et) => {
                      const color = getColorByLabel(et.color);
                      return (
                        <Badge
                          key={et.id}
                          variant="outline"
                          className="hover:bg-opacity-20 border-0 ring-1 transition-all ring-inset"
                          style={{
                            backgroundColor: `${color.bg}40`,
                            color: color.fg,
                            boxShadow: `0 0 0 1px ${color.bg}`,
                          }}
                        >
                          <DynamicIcon
                            // @ts-expect-error - dynamic icon name from API
                            name={et.icon}
                            className="mr-1 h-3 w-3"
                          />
                          {et.name}
                        </Badge>
                      );
                    })}
                    {remainingCount > 0 && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge variant="secondary">
                              +{remainingCount} more
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="flex flex-col gap-1">
                              {workflow.entity_types.slice(3).map((et) => (
                                <span key={et.id} className="text-xs">
                                  {et.name}
                                </span>
                              ))}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </>
                ) : (
                  <span className="text-muted-foreground text-sm italic">
                    No entity types assigned
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right: Stats & Actions */}
          <div className="flex w-full shrink-0 items-center justify-between gap-4 border-t pt-4 md:w-auto md:border-t-0 md:pt-0">
            <div className="flex gap-3">
              <div className="bg-muted/40 border-border/50 flex flex-col items-center justify-center rounded-lg border px-4 py-2">
                <div className="text-muted-foreground mb-0.5 flex items-center gap-1.5">
                  <ListCheck className="h-3.5 w-3.5" />
                  <span className="text-[10px] font-bold tracking-wide uppercase">
                    Steps
                  </span>
                </div>
                <span className="text-foreground text-base font-bold">
                  {workflow.step_count}
                </span>
              </div>

              <div
                className={cn(
                  "flex flex-col items-center justify-center rounded-lg border px-4 py-2",
                  activeCount > 0
                    ? "border-amber-200 bg-amber-50"
                    : "bg-muted/40 border-border/50 opacity-60",
                )}
              >
                <div
                  className={cn(
                    "mb-0.5 flex items-center gap-1.5",
                    activeCount > 0
                      ? "text-amber-700"
                      : "text-muted-foreground",
                  )}
                >
                  <Activity className="h-3.5 w-3.5" />
                  <span className="text-[10px] font-bold tracking-wide uppercase">
                    Active
                  </span>
                </div>
                <span
                  className={cn(
                    "text-base font-bold",
                    activeCount > 0 ? "text-amber-700" : "text-foreground",
                  )}
                >
                  {activeCount}
                </span>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground h-8 w-8 shrink-0 p-0"
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
    </Card>
  );
}
