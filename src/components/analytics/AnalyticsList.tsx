import { useMemo } from "react";

import type { AnalyticsDefinition } from "@/api/types/analytics";

import { AnalyticsCard } from "./AnalyticsCard";

interface AnalyticsListProps {
  definitions: AnalyticsDefinition[];
}

function getColSpan(chartType: string): string {
  switch (chartType) {
    case "number":
      return "md:col-span-1";
    case "bar":
    case "line":
      return "md:col-span-4";
    case "pie":
      return "md:col-span-2";
    default:
      return "md:col-span-2";
  }
}

export function AnalyticsList({ definitions }: AnalyticsListProps) {
  const { kpis, charts } = useMemo(() => {
    const kpis: AnalyticsDefinition[] = [];
    const charts: AnalyticsDefinition[] = [];
    for (const def of definitions) {
      if (def.definition.chart_type === "number") {
        kpis.push(def);
      } else {
        charts.push(def);
      }
    }
    return { kpis, charts };
  }, [definitions]);

  if (definitions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground">No analytics created yet</p>
        <p className="text-sm text-muted-foreground mt-1">
          Click &quot;Create Analytics&quot; to get started
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {kpis.length > 0 && (
        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {kpis.map((definition) => (
            <AnalyticsCard key={definition.id} definition={definition} />
          ))}
        </div>
      )}
      {charts.length > 0 && (
        <div className="grid gap-6 md:grid-cols-4">
          {charts.map((definition) => (
            <div
              key={definition.id}
              className={getColSpan(definition.definition.chart_type)}
            >
              <AnalyticsCard definition={definition} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
