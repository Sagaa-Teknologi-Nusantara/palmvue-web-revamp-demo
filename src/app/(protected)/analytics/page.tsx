"use client";

import { Plus, RefreshCw } from "lucide-react";
import { useState } from "react";

import { AnalyticsList, CreateAnalyticsSheet } from "@/components/analytics";
import { PageHeader } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { useAnalyticsDefinitionsQuery } from "@/hooks/queries/useAnalyticsDefinitionsQuery";

export default function AnalyticsPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const { definitions, isLoading, refetch, isFetching } =
    useAnalyticsDefinitionsQuery();

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
              onClick={() => refetch()}
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
      ) : (
        <AnalyticsList definitions={definitions} />
      )}

      <CreateAnalyticsSheet open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
