"use client";

import { AlertCircle, ArrowLeft, History } from "lucide-react";
import Link from "next/link";
import { use } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useEntityWorkflowHistoryQuery } from "@/hooks/queries";

import { AncestorTimeline } from "./components";

export default function EntityWorkflowHistoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { history, isLoading, isError, error } =
    useEntityWorkflowHistoryQuery(id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            asChild
            className="hover:text-primary pl-0 hover:bg-transparent"
          >
            <Link href={`/entities/${id}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Entity
            </Link>
          </Button>
        </div>
      </div>

      {/* Title Section */}
      <div className="flex items-center gap-3">
        <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-lg border shadow-sm">
          <History className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Workflow History
          </h1>
          <p className="text-muted-foreground text-sm">
            Complete workflow history from this entity through all parent
            entities
          </p>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="space-y-6">
          {[1, 2].map((i) => (
            <div key={i} className="relative pl-14">
              <Skeleton className="absolute left-0 h-10 w-10 rounded-full" />
              <div className="space-y-3">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-32 w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <Card className="border-destructive/50">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="bg-destructive/10 mb-4 flex h-12 w-12 items-center justify-center rounded-full">
              <AlertCircle className="text-destructive h-6 w-6" />
            </div>
            <h2 className="text-lg font-semibold">
              Failed to load workflow history
            </h2>
            <p className="text-muted-foreground mt-1 max-w-sm text-sm">
              {error?.message ||
                "An error occurred while fetching the history."}
            </p>
            <Button variant="outline" className="mt-4" asChild>
              <Link href={`/entities/${id}`}>Return to Entity</Link>
            </Button>
          </CardContent>
        </Card>
      ) : history.length === 0 ? (
        <Card className="border-dashed shadow-none">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="bg-muted/50 mb-4 flex h-16 w-16 items-center justify-center rounded-full">
              <History className="text-muted-foreground h-8 w-8 opacity-50" />
            </div>
            <h3 className="text-lg font-medium">No workflow history</h3>
            <p className="text-muted-foreground mt-2 max-w-sm text-sm">
              This entity and its ancestors have no workflow records yet.
            </p>
          </CardContent>
        </Card>
      ) : (
        <AncestorTimeline history={history} />
      )}
    </div>
  );
}
