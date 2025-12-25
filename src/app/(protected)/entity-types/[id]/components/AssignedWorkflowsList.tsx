import { Code2, PlayCircle } from "lucide-react";
import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Workflow } from "@/types";

interface AssignedWorkflowsListProps {
  workflows: Workflow[];
  isLoading: boolean;
}

export function AssignedWorkflowsList({
  workflows,
  isLoading,
}: AssignedWorkflowsListProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            Assigned Workflows
          </h2>
          <p className="text-muted-foreground text-sm">
            Workflows automatically assigned to new entities
          </p>
        </div>
      </div>

      <Card className="p-0">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="divide-y">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4">
                  <Skeleton className="h-10 w-10 rounded-lg" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              ))}
            </div>
          ) : workflows.length > 0 ? (
            <div className="divide-y">
              {workflows.map((workflow) => (
                <div
                  key={workflow.id}
                  className="hover:bg-muted/50 flex items-center justify-between p-4 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-lg">
                      <PlayCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <Link
                        href={`/workflows/${workflow.id}`}
                        className="block text-base font-medium hover:underline"
                      >
                        {workflow.name}
                      </Link>
                      <span className="text-muted-foreground mt-1 flex items-center gap-1.5 text-xs">
                        <Code2 className="h-3 w-3" />
                        {workflow.steps.length} step
                        {workflow.steps.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-muted-foreground flex flex-col items-center justify-center py-12 text-center">
              <div className="bg-muted mb-3 flex h-12 w-12 items-center justify-center rounded-full">
                <PlayCircle className="text-muted-foreground/50 h-6 w-6" />
              </div>
              <p className="font-medium">No workflows assigned</p>
              <p className="mt-1 max-w-sm text-sm">
                This entity type has no workflows assigned yet.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
