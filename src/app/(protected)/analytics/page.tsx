"use client";

import { useQueryClient } from "@tanstack/react-query";
import { AlertCircle, Plus, RefreshCw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AnalyticsList, CreateAnalyticsSheet } from "@/components/analytics";
import { PageHeader } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { useAnalyticsDefinitionsQuery } from "@/hooks/queries/useAnalyticsDefinitionsQuery";
import { ANALYTICS_QUERY_KEY } from "@/hooks/queries/useAnalyticsQueryQuery";

export default function AnalyticsPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const queryClient = useQueryClient();
  const { definitions, isLoading, isError, refetch, isFetching } =
    useAnalyticsDefinitionsQuery();

  const handleRefresh = async () => {
    queryClient.invalidateQueries({ queryKey: [ANALYTICS_QUERY_KEY] });
    const result = await refetch();
    if (result.isError) {
      toast.error("Failed to refresh analytics");
    } else {
      toast.success("Analytics refreshed");
    }
  };

  return (
    <div className="animate-in fade-in-50 space-y-8 duration-500">
      <PageHeader
        title="Analytics"
        description="Custom analytics and visualizations"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleRefresh}
              disabled={isFetching}
            >
              <RefreshCw
                className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
              />
            </Button>
            <Button onClick={() => setCreateOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Analytics
            </Button>
          </div>
        }
      />

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <AlertCircle className="h-8 w-8 text-destructive mb-3" />
          <p className="text-destructive font-medium">Failed to load analytics</p>
          <Button variant="outline" onClick={() => refetch()} className="mt-4">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      ) : (
        <AnalyticsList definitions={definitions} />
      )}

      <CreateAnalyticsSheet open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
