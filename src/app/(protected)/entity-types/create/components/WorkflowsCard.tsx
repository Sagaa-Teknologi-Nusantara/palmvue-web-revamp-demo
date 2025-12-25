import { PlayCircle } from "lucide-react";
import { Control } from "react-hook-form";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { WorkflowSelector } from "@/components/workflows";
import type { WorkflowOption } from "@/types";

interface WorkflowsCardProps {
  control: Control<{
    name: string;
    description: string;
    prefix: string;
    icon: string;
    color: string;
    workflow_ids: string[];
  }>;
  availableWorkflows: WorkflowOption[];
}

export function WorkflowsCard({
  control,
  availableWorkflows,
}: WorkflowsCardProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <span className="bg-primary/10 text-primary rounded-md p-1.5">
            <PlayCircle className="h-4 w-4" />
          </span>
          Default Workflows
        </CardTitle>
        <CardDescription>
          Workflows automatically assigned to new entities
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FormField
          control={control}
          name="workflow_ids"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <WorkflowSelector
                  availableWorkflows={availableWorkflows}
                  selectedWorkflowIds={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormDescription>
                Select workflows to be automatically assigned.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
