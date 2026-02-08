import { Clock } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface WorkflowRecord {
  id: string;
  workflow?: { name: string };
  entity?: { name: string };
  current_step?: { name: string };
  status: string;
  created_at: string;
}

interface PendingApprovalsListProps {
  records: WorkflowRecord[];
}

export function PendingApprovalsList({ records }: PendingApprovalsListProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <CardTitle className="text-base">Pending Approvals</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {records.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No pending approvals
          </p>
        ) : (
          <div className="space-y-3">
            {records.slice(0, 5).map((record) => (
              <div
                key={record.id}
                className="flex items-center justify-between rounded-lg bg-muted/50 p-3"
              >
                <div>
                  <p className="font-medium text-sm">
                    {record.workflow?.name ?? "Workflow"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {record.entity?.name ?? "Unknown Entity"} •{" "}
                    {record.current_step?.name ?? "Pending"}
                  </p>
                </div>
                <Badge
                  variant="secondary"
                  className="text-xs"
                >
                  {record.status}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
