"use client";

import { useRouter } from "next/navigation";
import { WorkflowBuilder } from "@/components/workflows";
import { useWorkflows } from "@/hooks";
import { GitBranch } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function CreateWorkflowPage() {
  const router = useRouter();
  const { create } = useWorkflows();

  const handleSubmit = (data: Parameters<typeof create>[0]) => {
    create(data);
    router.push("/workflows");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 text-primary border-primary/20 flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border shadow-sm transition-transform hover:scale-105">
              <GitBranch className="h-8 w-8" />
            </div>
            <div className="space-y-1">
              <h1 className="text-foreground text-3xl font-bold tracking-tight">
                Create Workflow
              </h1>
              <p className="text-muted-foreground text-sm">
                Define a new workflow sequence and assign it to entity types.
              </p>
            </div>
          </div>
        </div>
        <Separator />
      </div>

      <WorkflowBuilder
        onSubmit={handleSubmit}
        onCancel={() => router.push("/workflows")}
      />
    </div>
  );
}
