"use client";

import { DynamicIcon, type IconName } from "lucide-react/dynamic";
import Link from "next/link";

import type { EntityWorkflowHistoryItem } from "@/api/types/workflow-history";
import { WorkflowRecordCard } from "@/components/workflows";
import { getColorByLabel } from "@/lib/colors";

interface AncestorTimelineProps {
  history: EntityWorkflowHistoryItem[];
}

export function AncestorTimeline({ history }: AncestorTimelineProps) {
  return (
    <div className="relative space-y-0">
      {history.map((item, index) => {
        const color = getColorByLabel(item.entity_type.color);
        const isLast = index === history.length - 1;

        return (
          <div key={item.entity.id} className="relative pl-14">
            {/* Vertical line connecting to next node - only show if not last */}
            {!isLast && (
              <div className="bg-border absolute top-10 bottom-0 left-5 w-0.5" />
            )}

            {/* Timeline node */}
            <div
              className="absolute left-0 flex h-10 w-10 items-center justify-center rounded-full border-2 bg-white shadow-sm"
              style={{
                borderColor: color.bg,
                backgroundColor: color.bg,
              }}
            >
              <DynamicIcon
                name={(item.entity_type.icon || "box") as IconName}
                size={18}
                style={{ color: color.fg }}
              />
            </div>

            {/* Content card */}
            <div className={`pb-8 ${isLast ? "pb-0" : ""}`}>
              {/* Entity header */}
              <div className="mb-3">
                <div className="flex items-center gap-2">
                  <span
                    className="rounded px-1.5 py-0.5 text-xs font-semibold"
                    style={{
                      backgroundColor: color.bg,
                      color: color.fg,
                    }}
                  >
                    {item.entity.code}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    {item.entity_type.name}
                  </span>
                  {isLast && (
                    <span className="rounded bg-blue-100 px-1.5 py-0.5 text-xs font-medium text-blue-700">
                      Current
                    </span>
                  )}
                </div>
                <Link
                  href={`/entities/${item.entity.id}`}
                  className="hover:text-primary mt-1 text-lg font-semibold transition-colors hover:underline"
                >
                  {item.entity.name}
                </Link>
              </div>

              {/* Workflows - no callbacks = read-only */}
              {item.workflows.length > 0 ? (
                <div className="space-y-4">
                  {item.workflows.map((workflow) => (
                    <WorkflowRecordCard
                      key={workflow.id}
                      workflowDetail={workflow}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed p-4 text-center">
                  <p className="text-muted-foreground text-sm">
                    No workflows assigned
                  </p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
