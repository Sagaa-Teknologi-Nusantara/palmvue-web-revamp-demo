import { PlayCircle, Plus } from "lucide-react";
import { DynamicIcon, type IconName } from "lucide-react/dynamic";

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
} from "@/types";

interface CompletionActionsCardProps {
  actions: CompletionAction[];
}

export function CompletionActionsCard({ actions }: CompletionActionsCardProps) {
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
            <CompletionActionCard key={index} action={action} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function CompletionActionCard({ action }: { action: CompletionAction }) {
  if (action.type === "start_workflow") {
    const config = action.config as StartWorkflowConfig;
    return (
      <div className="bg-card flex items-center gap-3 rounded-lg border p-3">
        <div className="bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
          <PlayCircle className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium">Start Workflow</p>
          <p className="text-muted-foreground truncate text-xs">
            {config.workflow_name || config.workflow_id}
          </p>
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

    const countLabel =
      config.count_source.type === "fixed"
        ? `${config.count_source.value} entities`
        : `From field: ${config.count_source.field_path} (fallback: ${config.count_source.value})`;

    return (
      <div className="bg-card flex items-center gap-3 rounded-lg border p-3">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border-[0.5px]"
          style={{ backgroundColor: bg, color: fg, borderColor: fg }}
        >
          <DynamicIcon
            name={(entityInfo?.icon as IconName) || "box"}
            className="h-5 w-5"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium">Create Entities</p>
          <p className="text-muted-foreground text-xs">
            {entityInfo?.name || config.entity_type_id}
          </p>
          <p className="text-muted-foreground truncate text-[10px]">
            {countLabel}
          </p>
        </div>
      </div>
    );
  }

  return null;
}
