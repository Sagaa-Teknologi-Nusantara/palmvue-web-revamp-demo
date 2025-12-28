"use client";

import { GitBranch } from "lucide-react";
import { useRouter } from "next/navigation";

import { Separator } from "@/components/ui/separator";
import { useCreateWorkflowMutation } from "@/hooks/queries";
import type { CreateWorkflowInput } from "@/types";

import { WorkflowBuilder } from "./components";

export default function CreateWorkflowPage() {
  const router = useRouter();
  const createMutation = useCreateWorkflowMutation();

  const handleSubmit = (data: CreateWorkflowInput) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        router.push("/workflows");
      },
    });
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
