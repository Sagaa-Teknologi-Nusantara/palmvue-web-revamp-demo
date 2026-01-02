"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { PlayCircle, Repeat, Zap } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import type { EntityTypeOption } from "@/api/types/entity";
import type { UpdateWorkflowRequest } from "@/api/types/workflow";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import type { CompletionAction, WorkflowDetail } from "@/types";

import { CompletionActionsEditor } from "./CompletionActionsEditor";
import { EntityTypesSection } from "./EntityTypesSection";
import { StepsReadOnlyCard } from "./StepsReadOnlyCard";

const formSchema = z.object({
  name: z.string().min(1, "Workflow name is required"),
  isAutoStart: z.boolean(),
  isLoopable: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

interface WorkflowEditFormProps {
  workflow: WorkflowDetail;
  entityTypeOptions: EntityTypeOption[];
  onSubmit: (data: UpdateWorkflowRequest) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function WorkflowEditForm({
  workflow,
  entityTypeOptions,
  onSubmit,
  onCancel,
  isLoading,
}: WorkflowEditFormProps) {
  const [addEntityTypeIds, setAddEntityTypeIds] = useState<string[]>([]);
  const [includeExisting, setIncludeExisting] = useState(false);
  const [completionActions, setCompletionActions] = useState<
    CompletionAction[]
  >(workflow.on_complete_actions || []);

  const originalActionsJson = JSON.stringify(
    workflow.on_complete_actions || [],
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: workflow.name,
      isAutoStart: workflow.is_auto_start,
      isLoopable: workflow.is_loopable,
    },
  });

  const existingEntityTypeIds = workflow.entity_types.map((et) => et.id);
  const allEntityTypeIds = [...existingEntityTypeIds, ...addEntityTypeIds];

  const handleSubmit = (values: FormValues) => {
    const request: UpdateWorkflowRequest = {};

    if (values.name !== workflow.name) {
      request.name = values.name;
    }
    if (values.isAutoStart !== workflow.is_auto_start) {
      request.is_auto_start = values.isAutoStart;
    }
    if (values.isLoopable !== workflow.is_loopable) {
      request.is_loopable = values.isLoopable;
    }

    if (addEntityTypeIds.length > 0) {
      request.add_entity_type_ids = addEntityTypeIds;
      request.include_existing = includeExisting;
    }

    const currentActionsJson = JSON.stringify(completionActions);
    if (currentActionsJson !== originalActionsJson) {
      request.on_complete = completionActions;
    }

    onSubmit(request);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-5">
          {/* Left Column: Details */}
          <div className="space-y-6 md:col-span-2">
            {/* Details Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <span className="bg-primary/10 text-primary rounded-md p-1.5">
                    <PlayCircle className="h-4 w-4" />
                  </span>
                  Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Workflow Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Palm Tree Assessment"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        A descriptive name for your workflow.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Toggles */}
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="isAutoStart"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel className="flex items-center gap-2">
                            <Zap className="text-muted-foreground h-4 w-4" />
                            Auto Start
                          </FormLabel>
                          <FormDescription className="text-xs">
                            Automatically start when entity is created.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isLoopable"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel className="flex items-center gap-2">
                            <Repeat className="text-muted-foreground h-4 w-4" />
                            Loopable
                          </FormLabel>
                          <FormDescription className="text-xs">
                            Allow workflow to restart after completion.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Entity Types Section */}
            <EntityTypesSection
              assignedEntityTypes={workflow.entity_types}
              entityTypeOptions={entityTypeOptions}
              addEntityTypeIds={addEntityTypeIds}
              onAddEntityTypeIdsChange={setAddEntityTypeIds}
              includeExisting={includeExisting}
              onIncludeExistingChange={setIncludeExisting}
            />

            {/* Completion Actions */}
            <CompletionActionsEditor
              value={completionActions}
              onChange={setCompletionActions}
              selectedEntityTypeIds={allEntityTypeIds}
              steps={workflow.steps}
            />
          </div>

          {/* Right Column: Steps (Read-only) */}
          <div className="md:col-span-3">
            <StepsReadOnlyCard steps={workflow.steps} />
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="h-20" />
        <div className="bg-background fixed right-0 bottom-0 left-64 z-50 flex items-center justify-end gap-3 border-t p-4 shadow-sm transition-all duration-300">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
