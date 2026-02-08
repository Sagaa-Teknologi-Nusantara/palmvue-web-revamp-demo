"use client";

import { Edit, MoreVertical, RefreshCw,Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import type { AnalyticsDefinition } from "@/api/types/analytics";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAnalyticsQueryQuery } from "@/hooks/queries/useAnalyticsQueryQuery";
import { useDeleteAnalyticsDefinitionMutation } from "@/hooks/queries/useDeleteAnalyticsDefinitionMutation";

import { AnalyticsChart } from "./AnalyticsChart";
import { CreateAnalyticsSheet } from "./CreateAnalyticsSheet";

interface AnalyticsCardProps {
  definition: AnalyticsDefinition;
}

function getChartHeight(chartType: string): string {
  switch (chartType) {
    case "number":
      return "h-16";
    case "bar":
    case "line":
      return "h-72";
    case "pie":
      return "h-64";
    default:
      return "h-64";
  }
}

export function AnalyticsCard({ definition }: AnalyticsCardProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const isKpi = definition.definition.chart_type === "number";

  const { result, isLoading, isError, isFetching, refetch } = useAnalyticsQueryQuery(definition.id);
  const deleteMutation = useDeleteAnalyticsDefinitionMutation();

  const handleRefresh = async () => {
    const queryResult = await refetch();
    if (queryResult.isError) {
      toast.error("Failed to refresh chart");
    } else {
      toast.success("Chart refreshed");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(definition.id);
      toast.success("Analytics deleted");
      setDeleteOpen(false);
    } catch {
      toast.error("Failed to delete analytics");
    }
  };

  return (
    <>
      <Card className="bg-card">
        <CardHeader className={`flex flex-row items-center justify-between space-y-0 ${isKpi ? "pb-1 pt-3 px-4" : "pb-2"}`}>
          <div className="min-w-0 flex-1">
            <CardTitle className={isKpi ? "text-sm font-medium truncate" : "text-base font-semibold"}>
              {definition.name}
            </CardTitle>
            {!isKpi && definition.description && (
              <p className="text-sm text-muted-foreground mt-1">
                {definition.description}
              </p>
            )}
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className={isKpi ? "h-7 w-7" : ""}
              onClick={handleRefresh}
              disabled={isFetching}
            >
              <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className={isKpi ? "h-7 w-7" : ""}>
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setEditOpen(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setDeleteOpen(true)}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className={isKpi ? "px-4 pb-3 pt-0" : ""}>
          <div className={getChartHeight(definition.definition.chart_type)}>
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : isError ? (
              <div className="flex flex-col items-center justify-center h-full text-destructive">
                <p className="text-sm font-medium">Failed to load chart</p>
                <Button variant="link" size="sm" onClick={() => refetch()}>
                  Retry
                </Button>
              </div>
            ) : result ? (
              <AnalyticsChart chartType={result.chart_type} data={result.data} />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No data available
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <CreateAnalyticsSheet
        open={editOpen}
        onOpenChange={setEditOpen}
        definition={definition}
      />

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Analytics</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{definition.name}&quot;? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
