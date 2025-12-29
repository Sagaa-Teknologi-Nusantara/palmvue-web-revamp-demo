import { PlayCircle, Plus } from "lucide-react";
import { DynamicIcon, type IconName } from "lucide-react/dynamic";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getColorByLabel } from "@/lib/colors";
import type {
  CompletionAction,
  CreateEntitiesConfig,
  StartWorkflowConfig,
  WorkflowStep,
} from "@/types";

interface CompletionActionsCardProps {
  actions: CompletionAction[];
  steps: WorkflowStep[];
}

export function CompletionActionsCard({
  actions,
  steps,
}: CompletionActionsCardProps) {
  if (actions.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <span className="bg-primary/10 text-primary rounded-md p-1.5">
            <Plus className="h-4 w-4" />
          </span>
          Completion Actions
        </CardTitle>
        <CardDescription>
          Actions triggered when workflow completes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {actions.map((action, index) => (
            <CompletionActionCard key={index} action={action} steps={steps} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function CompletionActionCard({
  action,
  steps,
}: {
  action: CompletionAction;
  steps: WorkflowStep[];
}) {
  if (action.type === "start_workflow") {
    const config = action.config as StartWorkflowConfig;
    return (
      <div className="bg-card flex flex-col gap-3 rounded-lg border p-3 shadow-sm transition-all">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
            <PlayCircle className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium">Start Workflow</p>
            <p className="text-muted-foreground text-xs">
              Trigger another process
            </p>
          </div>
        </div>

        <div className="bg-border h-px w-full" />

        <div className="flex flex-1 items-center gap-2">
          <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
            Target:
          </span>
          <Link href={`/workflows/${config.workflow_id}`}>
            <Badge
              variant="outline"
              className="hover:bg-accent font-medium transition-colors"
            >
              {config.workflow_name || config.workflow_id}
            </Badge>
          </Link>
        </div>
      </div>
    );
  }

  if (action.type === "create_entities") {
    const config = action.config as CreateEntitiesConfig;
    const entityInfo = config.entity_type_info;
    const { bg, fg } = entityInfo
      ? getColorByLabel(entityInfo.color)
      : { bg: "#f3f4f6", fg: "#6b7280" };

    const isFixed = config.count_source.type === "fixed";
    const defaultValue = config.count_source.value;

    let configDisplay: React.ReactNode;

    if (isFixed) {
      configDisplay = (
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
            Count:
          </span>
          <span className="text-sm font-semibold">{defaultValue}</span>
          <Badge variant="outline" className="text-xs">
            Fixed
          </Badge>
        </div>
      );
    } else {
      const step = steps.find(
        (s) => s.order_index === config.count_source.step_order,
      );
      const fieldName =
        step?.form.schema.properties?.[config.count_source.field_path || ""]
          ?.title || config.count_source.field_path;

      configDisplay = (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
              From:
            </span>
            <div className="flex items-center gap-1.5 text-sm">
              <span className="font-medium">
                {step ? step.name : "Unknown Step"}
              </span>
              <span className="text-muted-foreground">›</span>
              <code className="bg-muted rounded px-1 py-0.5 font-mono text-xs">
                {fieldName}
              </code>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
              Default:
            </span>
            <span className="text-sm font-semibold">{defaultValue}</span>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-card flex flex-col gap-3 rounded-lg border p-3 shadow-sm transition-all hover:shadow-md">
        {/* Left: Action Type & Icon */}
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border-[0.5px]"
            style={{ backgroundColor: bg, color: fg, borderColor: fg }}
          >
            <DynamicIcon
              name={(entityInfo?.icon as IconName) || "box"}
              className="h-5 w-5"
            />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium">Create Entities</p>
            <p className="text-muted-foreground truncate text-xs">
              {entityInfo?.name || config.entity_type_id}
            </p>
          </div>
        </div>

        <div className="bg-border h-px w-full" />

        {/* Configuration Details */}
        {configDisplay}
      </div>
    );
  }

  return null;
}
