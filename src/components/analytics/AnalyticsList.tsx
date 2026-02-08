import type { AnalyticsDefinition } from "@/api/types/analytics";

import { AnalyticsCard } from "./AnalyticsCard";

interface AnalyticsListProps {
  definitions: AnalyticsDefinition[];
}

export function AnalyticsList({ definitions }: AnalyticsListProps) {
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
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {definitions.map((definition) => (
        <AnalyticsCard key={definition.id} definition={definition} />
      ))}
    </div>
  );
}
