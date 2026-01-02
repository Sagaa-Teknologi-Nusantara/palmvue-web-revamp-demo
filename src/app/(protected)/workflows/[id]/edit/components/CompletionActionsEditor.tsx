"use client";

import { Info, Package, Plus, Trash2, Workflow } from "lucide-react";
import { DynamicIcon } from "lucide-react/dynamic";
import { useMemo } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEntityTypeOptionsQuery } from "@/hooks/queries";
import { useWorkflowOptionsQuery } from "@/hooks/queries";
import { getColorByLabel } from "@/lib/colors";
import type {
  CompletionAction,
  CompletionActionType,
  CountSourceType,
  CreateEntitiesConfig,
  StartWorkflowConfig,
  WorkflowStep,
} from "@/types";

interface CompletionActionsEditorProps {
  value: CompletionAction[];
  onChange: (actions: CompletionAction[]) => void;
  selectedEntityTypeIds: string[];
  steps: WorkflowStep[];
}

export function CompletionActionsEditor({
  value,
  onChange,
  selectedEntityTypeIds,
  steps,
}: CompletionActionsEditorProps) {
  const { options: allEntityTypes } = useEntityTypeOptionsQuery();

  const isDisabled = selectedEntityTypeIds.length === 0;
  const disabledMessage =
    "Assign at least one entity type to enable on-complete actions.";

  const handleAddAction = () => {
    const newAction: CompletionAction = {
      type: "create_entities",
      config: {
        entity_type_id: "",
        count_source: {
          type: "fixed",
          value: 1,
        },
      } as CreateEntitiesConfig,
    };
    onChange([...value, newAction]);
  };

  const handleRemoveAction = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const handleUpdateAction = (index: number, updated: CompletionAction) => {
    onChange(value.map((action, i) => (i === index ? updated : action)));
  };

  const handleTypeChange = (index: number, type: CompletionActionType) => {
    const newConfig =
      type === "create_entities"
        ? ({
            entity_type_id: "",
            count_source: {
              type: "fixed",
              value: 1,
            },
          } as CreateEntitiesConfig)
        : ({
            workflow_id: "",
            entity_type_id: "",
          } as StartWorkflowConfig);

    handleUpdateAction(index, { type, config: newConfig });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <span className="bg-primary/10 text-primary rounded-md p-1.5">
              <Workflow className="h-4 w-4" />
            </span>
            On Complete Actions
          </CardTitle>
          {!isDisabled && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleAddAction}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Action
            </Button>
          )}
        </div>
        <p className="text-muted-foreground text-sm">
          Actions to execute when the workflow completes.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {isDisabled ? (
          <div className="bg-muted/30 animate-in fade-in-50 flex min-h-[200px] flex-col items-center justify-center rounded-xl border border-dashed p-8 text-center">
            <div className="bg-primary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-full">
              <Info className="text-primary h-6 w-6" />
            </div>
            <p className="text-foreground text-sm font-medium">
              Feature Unavailable
            </p>
            <p className="text-muted-foreground mt-1 max-w-xs text-xs">
              {disabledMessage ||
                "This feature requires specific conditions to be met."}
            </p>
          </div>
        ) : value.length === 0 ? (
          <div className="border-border bg-card rounded-lg border-2 border-dashed py-8 text-center">
            <div className="bg-muted/50 mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full">
              <Workflow className="text-muted-foreground h-6 w-6 opacity-50" />
            </div>
            <p className="text-muted-foreground font-medium">
              No actions defined
            </p>
            <p className="text-muted-foreground text-xs">
              Add actions to trigger automation when this workflow completes.
            </p>
          </div>
        ) : (
          value.map((action, index) => (
            <ActionCard
              key={index}
              action={action}
              index={index}
              allEntityTypes={allEntityTypes}
              selectedEntityTypeIds={selectedEntityTypeIds}
              steps={steps}
              onUpdate={(updated) => handleUpdateAction(index, updated)}
              onRemove={() => handleRemoveAction(index)}
              onTypeChange={(type) => handleTypeChange(index, type)}
            />
          ))
        )}
      </CardContent>
    </Card>
  );
}

interface ActionCardProps {
  action: CompletionAction;
  index: number;
  allEntityTypes: Array<{
    id: string;
    name: string;
    color: string;
    icon: string;
  }>;
  selectedEntityTypeIds: string[];
  steps: WorkflowStep[];
  onUpdate: (action: CompletionAction) => void;
  onRemove: () => void;
  onTypeChange: (type: CompletionActionType) => void;
}

function ActionCard({
  action,
  index,
  allEntityTypes,
  selectedEntityTypeIds,
  steps,
  onUpdate,
  onRemove,
  onTypeChange,
}: ActionCardProps) {
  return (
    <div className="bg-card relative rounded-lg border p-4 shadow-sm transition-all hover:shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 text-primary flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold">
            {index + 1}
          </div>
          <Select value={action.type} onValueChange={onTypeChange}>
            <SelectTrigger className="h-8 w-48 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="create_entities">
                <div className="flex items-center gap-2 font-semibold">
                  <Package className="h-3 w-3" />
                  Create Entities
                </div>
              </SelectItem>
              <SelectItem value="start_workflow">
                <div className="flex items-center gap-2 font-semibold">
                  <Workflow className="h-3 w-3" />
                  Start Workflow
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-destructive h-8 w-8"
          onClick={onRemove}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="pl-9">
        {action.type === "create_entities" ? (
          <CreateEntitiesForm
            config={action.config as CreateEntitiesConfig}
            entityTypes={allEntityTypes}
            steps={steps}
            onUpdate={(config) => onUpdate({ ...action, config })}
          />
        ) : (
          <StartWorkflowForm
            config={action.config as StartWorkflowConfig}
            allEntityTypes={allEntityTypes}
            selectedEntityTypeIds={selectedEntityTypeIds}
            onUpdate={(config) => onUpdate({ ...action, config })}
          />
        )}
      </div>
    </div>
  );
}

interface CreateEntitiesFormProps {
  config: CreateEntitiesConfig;
  entityTypes: Array<{ id: string; name: string; color: string; icon: string }>;
  steps: WorkflowStep[];
  onUpdate: (config: CreateEntitiesConfig) => void;
}

function CreateEntitiesForm({
  config,
  entityTypes,
  steps,
  onUpdate,
}: CreateEntitiesFormProps) {
  const stepsWithIntegerFields = useMemo(() => {
    return steps
      .map((step) => {
        if (!step?.form?.schema?.properties) return null;
        const integerFields = Object.entries(step.form.schema.properties)
          .filter(([, schema]) => {
            const fieldSchema = schema as { type?: string };
            return (
              fieldSchema.type === "integer" || fieldSchema.type === "number"
            );
          })
          .map(([fieldName, schema]) => ({
            name: fieldName,
            title: (schema as { title?: string }).title || fieldName,
          }));

        if (integerFields.length === 0) return null;
        return { step, idx: step.order_index, integerFields };
      })
      .filter(Boolean) as Array<{
      step: WorkflowStep;
      idx: number;
      integerFields: Array<{ name: string; title: string }>;
    }>;
  }, [steps]);

  const getIntegerFields = (stepIndex: number) => {
    const found = stepsWithIntegerFields.find((s) => s.idx === stepIndex);
    return found?.integerFields ?? [];
  };

  const handleCountSourceTypeChange = (type: CountSourceType) => {
    onUpdate({
      ...config,
      count_source: {
        ...config.count_source,
        type,
        step_order: undefined,
        field_path: undefined,
      },
    });
  };

  const selectedEntityType = entityTypes.find(
    (et) => et.id === config.entity_type_id,
  );

  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="space-y-2">
        <Label>Entity Type</Label>
        <Select
          value={config.entity_type_id}
          onValueChange={(id) => onUpdate({ ...config, entity_type_id: id })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select entity type">
              {selectedEntityType && (
                <div className="flex items-center gap-2">
                  <div
                    className="flex h-5 w-5 items-center justify-center rounded"
                    style={{
                      backgroundColor: getColorByLabel(selectedEntityType.color)
                        .bg,
                    }}
                  >
                    <DynamicIcon
                      // @ts-expect-error - dynamic icon name
                      name={selectedEntityType.icon}
                      className="h-3 w-3"
                      style={{
                        color: getColorByLabel(selectedEntityType.color).fg,
                      }}
                    />
                  </div>
                  {selectedEntityType.name}
                </div>
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {entityTypes.map((et) => {
              const color = getColorByLabel(et.color);
              return (
                <SelectItem key={et.id} value={et.id}>
                  <div className="flex items-center gap-2">
                    <div
                      className="flex h-5 w-5 items-center justify-center rounded"
                      style={{ backgroundColor: color.bg }}
                    >
                      <DynamicIcon
                        // @ts-expect-error - dynamic icon name
                        name={et.icon}
                        className="h-3 w-3"
                        style={{ color: color.fg }}
                      />
                    </div>
                    {et.name}
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Count Source</Label>
          <Select
            value={config.count_source.type}
            onValueChange={handleCountSourceTypeChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fixed">Fixed Value</SelectItem>
              <SelectItem value="submission_field">From Field</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>
            {config.count_source.type === "fixed" ? "Count" : "Default Value"}
          </Label>
          <Input
            type="number"
            min={1}
            value={config.count_source.value}
            onChange={(e) =>
              onUpdate({
                ...config,
                count_source: {
                  ...config.count_source,
                  value: parseInt(e.target.value) || 1,
                },
              })
            }
          />
        </div>
      </div>

      {config.count_source.type === "submission_field" && (
        <>
          {steps.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No steps available in this workflow to pick from.
            </p>
          ) : stepsWithIntegerFields.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No steps with integer/number fields available.
            </p>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Step</Label>
                  <Select
                    value={config.count_source.step_order?.toString() ?? ""}
                    onValueChange={(v) =>
                      onUpdate({
                        ...config,
                        count_source: {
                          ...config.count_source,
                          step_order: parseInt(v),
                          field_path: undefined,
                        },
                      })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select step" />
                    </SelectTrigger>
                    <SelectContent>
                      {stepsWithIntegerFields.map(({ step, idx }) => (
                        <SelectItem key={step.id} value={idx.toString()}>
                          <span className="font-semibold">Step {idx + 1}:</span>{" "}
                          {step.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Integer Field</Label>
                  <Select
                    value={config.count_source.field_path ?? ""}
                    onValueChange={(v) =>
                      onUpdate({
                        ...config,
                        count_source: {
                          ...config.count_source,
                          field_path: v,
                        },
                      })
                    }
                    disabled={config.count_source.step_order === undefined}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={
                          config.count_source.step_order === undefined
                            ? "Select step first"
                            : "Select field"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {config.count_source.step_order !== undefined &&
                        getIntegerFields(config.count_source.step_order).map(
                          (field) => (
                            <SelectItem key={field.name} value={field.name}>
                              {field.title}
                            </SelectItem>
                          ),
                        )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

interface StartWorkflowFormProps {
  config: StartWorkflowConfig;
  allEntityTypes: Array<{
    id: string;
    name: string;
    color: string;
    icon: string;
  }>;
  selectedEntityTypeIds: string[];
  onUpdate: (config: StartWorkflowConfig) => void;
}

function StartWorkflowForm({
  config,
  allEntityTypes,
  selectedEntityTypeIds,
  onUpdate,
}: StartWorkflowFormProps) {
  const assignedEntityTypes = allEntityTypes.filter((et) =>
    selectedEntityTypeIds.includes(et.id),
  );

  const { workflowOptions, isLoading: isLoadingWorkflows } =
    useWorkflowOptionsQuery(config.entity_type_id || null);

  const selectedEntityType = allEntityTypes.find(
    (et) => et.id === config.entity_type_id,
  );

  const handleEntityTypeChange = (entityTypeId: string) => {
    onUpdate({
      ...config,
      entity_type_id: entityTypeId,
      workflow_id: "",
    });
  };

  return (
    <div className="grid grid-cols-1 gap-4">
      {/* Entity Type Selector */}
      <div className="space-y-2">
        <Label>Entity Type</Label>
        <Select
          value={config.entity_type_id}
          onValueChange={handleEntityTypeChange}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select entity type">
              {selectedEntityType && (
                <div className="flex items-center gap-2">
                  <div
                    className="flex h-5 w-5 items-center justify-center rounded"
                    style={{
                      backgroundColor: getColorByLabel(selectedEntityType.color)
                        .bg,
                    }}
                  >
                    <DynamicIcon
                      // @ts-expect-error - dynamic icon name
                      name={selectedEntityType.icon}
                      className="h-3 w-3"
                      style={{
                        color: getColorByLabel(selectedEntityType.color).fg,
                      }}
                    />
                  </div>
                  {selectedEntityType.name}
                </div>
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {assignedEntityTypes.map((et) => {
              const color = getColorByLabel(et.color);
              return (
                <SelectItem key={et.id} value={et.id}>
                  <div className="flex items-center gap-2">
                    <div
                      className="flex h-5 w-5 items-center justify-center rounded"
                      style={{ backgroundColor: color.bg }}
                    >
                      <DynamicIcon
                        // @ts-expect-error - dynamic icon name
                        name={et.icon}
                        className="h-3 w-3"
                        style={{ color: color.fg }}
                      />
                    </div>
                    {et.name}
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
        <p className="text-muted-foreground text-xs">
          Only entities of this type will trigger the workflow on completion.
        </p>
      </div>

      {/* Workflow Selector */}
      <div className="space-y-2">
        <Label>Workflow</Label>
        <Select
          value={config.workflow_id}
          onValueChange={(id) => onUpdate({ ...config, workflow_id: id })}
          disabled={isLoadingWorkflows || !config.entity_type_id}
        >
          <SelectTrigger className="w-full">
            <SelectValue
              placeholder={
                !config.entity_type_id
                  ? "Select entity type first"
                  : isLoadingWorkflows
                    ? "Loading..."
                    : "Select workflow"
              }
            />
          </SelectTrigger>
          <SelectContent>
            {workflowOptions.map((wf) => (
              <SelectItem key={wf.id} value={wf.id}>
                {wf.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
