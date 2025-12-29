"use client";

import { ArrowLeft, GitBranch, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useDeleteWorkflowMutation,
  useWorkflowDetailQuery,
} from "@/hooks/queries";

import {
  CompletionActionsCard,
  EntityTypesCard,
  WorkflowInfoCard,
  WorkflowStepsCard,
} from "./components";

export default function WorkflowDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { workflow, isLoading } = useWorkflowDetailQuery(id);
  const deleteMutation = useDeleteWorkflowMutation();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  if (isLoading || !workflow) {
    return (
      <div>
        <div className="mb-6">
          <Skeleton className="h-8 w-32" />
        </div>
        <div className="space-y-6">
          <div className="flex items-start justify-between">
            <div className="flex gap-4">
              <Skeleton className="h-16 w-16 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </div>
    );
  }

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(id);
    router.push("/workflows");
  };

  return (
    <div className="space-y-6">
      <div>
        <Button
          variant="ghost"
          asChild
          className="hover:text-primary mb-4 pl-0 hover:bg-transparent"
        >
          <Link href="/workflows">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Workflows
          </Link>
        </Button>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 text-primary border-primary/20 flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border shadow-sm transition-transform hover:scale-105">
                <GitBranch className="h-8 w-8" />
              </div>
              <div className="space-y-1">
                <h1 className="text-foreground text-3xl font-bold tracking-tight">
                  {workflow.name}
                </h1>
                <p className="text-muted-foreground text-sm">
                  {workflow.steps.length} step
                  {workflow.steps.length !== 1 ? "s" : ""} configuration
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20 h-9"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Workflow
            </Button>
          </div>
          <Separator />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-5">
        {/* Sidebar / Info */}
        <div className="space-y-6 md:col-span-2">
          <WorkflowInfoCard workflow={workflow} />
          <EntityTypesCard entityTypes={workflow.entity_types} />
          <CompletionActionsCard actions={workflow.on_complete_actions} />
        </div>

        {/* Main Content / Steps */}
        <div className="md:col-span-3">
          <WorkflowStepsCard steps={workflow.steps} />
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Workflow</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{workflow.name}&quot;? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="bg-destructive hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
