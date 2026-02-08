import { FileText } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FormSubmission {
  id: string;
  workflow_step?: { name: string };
  entity?: { name: string };
  status: string;
  created_at: string;
}

interface RecentSubmissionsListProps {
  submissions: FormSubmission[];
}

export function RecentSubmissionsList({
  submissions,
}: RecentSubmissionsListProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <CardTitle className="text-base">Recent Submissions</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {submissions.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No recent submissions
          </p>
        ) : (
          <div className="space-y-3">
            {submissions.slice(0, 5).map((submission) => (
              <div
                key={submission.id}
                className="flex items-center justify-between rounded-lg bg-muted/50 p-3"
              >
                <div>
                  <p className="font-medium text-sm">
                    {submission.workflow_step?.name ?? "Form Submission"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {submission.entity?.name ?? "Unknown Entity"}
                  </p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {submission.status}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
