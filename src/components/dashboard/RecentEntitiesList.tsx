import { ArrowRight,Plus } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Entity {
  id: string;
  name: string;
  code: string;
  entity_type?: { name: string };
  created_at: string;
}

interface RecentEntitiesListProps {
  entities: Entity[];
}

export function RecentEntitiesList({ entities }: RecentEntitiesListProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Plus className="h-4 w-4 text-muted-foreground" />
          <CardTitle className="text-base">Recent Entities</CardTitle>
        </div>
        <Button asChild variant="ghost" size="sm">
          <Link href="/entities">
            View all
            <ArrowRight className="ml-1 h-3 w-3" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {entities.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No entities created yet
          </p>
        ) : (
          <div className="space-y-3">
            {entities.slice(0, 5).map((entity) => (
              <Link
                key={entity.id}
                href={`/entities/${entity.id}`}
                className="flex items-center justify-between rounded-lg bg-muted/50 p-3 transition-colors hover:bg-muted"
              >
                <div>
                  <p className="font-medium text-sm">{entity.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Badge variant="outline" className="text-xs">
                      {entity.code}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {entity.entity_type?.name}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
